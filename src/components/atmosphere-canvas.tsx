"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { RenderRegion, SceneMode } from "./atmospheric-scene";

type SceneProps = { mode: SceneMode; reduced: boolean; active: boolean; progress: RefObject<number>; region: RefObject<RenderRegion>; onReady: () => void; onFailure: () => void };

// Keep the original camera and resolution; skip fragments hidden by CSS clipping
// or outside the viewport. The DOM region is measured only on scroll/resize.
function VisibleRegion({ region, reduced }: Pick<SceneProps, "region" | "reduced">) {
  useFrame(({ gl }) => {
    // A reduced-motion scene renders once, including portions revealed later.
    if (reduced) { gl.setScissorTest(false); return; }
    const { x, y, width, height } = region.current;
    gl.setScissor(x, y, width, height);
    gl.setScissorTest(true);
  }, -1);
  return null;
}

const membraneVertex = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uCurtain;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;
  vec3 surface(vec2 p) {
    float t = uTime * 0.17;
    float u = p.x;
    float v = p.y;
    vec3 q;
    if (uCurtain < 0.5) {
      float arch = sin(u * 3.2 + 0.3);
      float fold = sin(u * 8.0 + v * 2.4 + t);
      q.x = u * 7.8 + v * 0.48 * sin(u * 3.0 + t);
      q.y = arch * 1.18 + v * (1.28 + 0.42 * cos(u * 3.0)) + fold * 0.21;
      q.z = sin(u * 3.8 + v * 1.55 + t * 0.6) * 1.65;
      q.z += sin(u * 8.5 - v * 3.1 - t) * 0.48;
      q.z += sin(v * 5.0 + u * 5.0 + t * 0.4) * 0.19;
      q.y += sin(u * 2.0 + t) * 0.12 + uScroll * 0.2;
      q.z += uPointer.x * u * 0.22 + uPointer.y * v * 0.19;
    } else {
      q.x = u * 6.8;
      q.y = v * 2.6;
      q.z = sin(u * 10.0 + t + v * 0.4) * 0.3 + sin(u * 21.0 - t) * 0.12;
      q.x += sin(v * 1.6 + t) * 0.13;
    }
    return q;
  }
  void main() {
    vec2 p = uv * 2.0 - 1.0;
    vec3 q = surface(p);
    vec3 dx = surface(p + vec2(0.003, 0.0)) - q;
    vec3 dy = surface(p + vec2(0.0, 0.003)) - q;
    vNormal = normalize(normalMatrix * normalize(cross(dx, dy)));
    vec4 view = modelViewMatrix * vec4(q, 1.0);
    vPosition = view.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * view;
  }
`;

const membraneFragment = `
  uniform float uCurtain;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 eye = normalize(-vPosition);
    normal *= gl_FrontFacing ? 1.0 : -1.0;
    float rim = pow(1.0 - abs(dot(normal, eye)), 2.7);
    float key = pow(abs(dot(normal, normalize(vec3(-0.4, 0.8, 1.0)))), 3.0);
    float silk = pow(abs(dot(normal, normalize(vec3(0.2, 0.4, 1.0)))), 14.0);
    float strip = pow(abs(dot(normal, normalize(vec3(-0.7, -0.1, 1.0)))), 30.0);
    vec3 reflection = reflect(-eye, normal);
    float softbox = exp(-pow((reflection.y - 0.32) * 5.5, 2.0));
    float whiteStrip = exp(-pow((reflection.x + reflection.y * 0.4 - 0.15) * 11.0, 2.0));
    float darkBand = smoothstep(-0.1, 0.3, reflection.y) * (1.0 - smoothstep(0.35, 0.7, reflection.y));
    float fineFold = 0.97 + 0.03 * sin(vUv.y * 105.0 + vUv.x * 18.0);
    float sheen = (0.025 + key * 0.19 + silk * 0.32 + strip * 0.55 + rim * 0.85 + softbox * 0.7 + whiteStrip * 0.55) * fineFold;
    sheen *= 1.0 - darkBand * 0.48;
    float edge = smoothstep(0.0, 0.055, vUv.y) * (1.0 - smoothstep(0.93, 1.0, vUv.y));
    float ends = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
    float alpha = (0.93 + rim * 0.07) * edge * ends;
    if (uCurtain > 0.5) {
      float falloff = pow(sin(vUv.y * 3.14159), 1.6);
      float rays = pow(0.5 + 0.5 * sin(vUv.x * 160.0), 12.0);
      sheen = (rim * 0.3 + silk * 0.18 + rays * 0.15) * falloff;
      alpha = falloff * ends * 0.65;
    }
    gl_FragColor = vec4(vec3(sheen), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Membrane({ mode, reduced, progress }: Pick<SceneProps, "mode" | "reduced" | "progress">) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree(state => state.viewport);
  const uniforms = useMemo(() => ({ uTime: { value: 1.7 }, uScroll: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uCurtain: { value: mode === "curtain" ? 1 : 0 } }), [mode]);
  const elapsed = useRef(1.7);
  useFrame((state, dt) => {
    if (!material.current || reduced) return;
    elapsed.current += Math.min(dt, 0.05);
    material.current.uniforms.uTime.value = elapsed.current;
    material.current.uniforms.uScroll.value = THREE.MathUtils.lerp(material.current.uniforms.uScroll.value, progress.current, 0.035);
    material.current.uniforms.uPointer.value.lerp(state.pointer, 0.025);
  });
  return <mesh position={mode === "silk" ? [0.7, -0.1, 0] : [0, 0, 0]} rotation={mode === "silk" ? [-0.22, -0.08, 0.32] : [0, 0, -0.06]} scale={mode === "silk" && viewport.aspect < 1.2 ? 0.9 : 1.08}>
    <planeGeometry args={[1, 1, 260, 100]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={membraneVertex} fragmentShader={membraneFragment} transparent side={THREE.DoubleSide} depthWrite={false} />
  </mesh>;
}

// Original deterministic particle bust, with a shaped face, neck and broad
// shoulder volume. All samples are points; there is no imported human mesh.
function particleFigure() {
  let seed = 1206;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const positions: number[] = [], seeds: number[] = [];
  const add = (x: number, y: number, z: number, loose = 0.025) => {
    positions.push(x + (random() - 0.5) * loose, y + (random() - 0.5) * loose, z + (random() - 0.5) * loose);
    seeds.push(random(), random(), random());
  };
  for (let i = 0; i < 10000; i++) {
    const a = random() * Math.PI * 2, h = random() * 2 - 1, r = Math.sqrt(1 - h * h);
    let x = Math.cos(a) * r * 0.58;
    const y = 0.99 + h * 0.79;
    let z = Math.sin(a) * r * 0.51;
    // A quiet facial profile: nose, eye sockets, brow, and jaw.
    if (z > 0) {
      z += 0.22 * Math.exp(-Math.pow(x / 0.105, 2) - Math.pow((y - 0.92) / 0.19, 2));
      z -= 0.075 * (Math.exp(-Math.pow((x - 0.21) / 0.13, 2)) + Math.exp(-Math.pow((x + 0.21) / 0.13, 2))) * Math.exp(-Math.pow((y - 1.13) / 0.09, 2));
      z += 0.045 * Math.exp(-Math.pow(x / 0.38, 2) - Math.pow((y - 1.25) / 0.08, 2));
      x *= 0.86 + 0.14 * Math.min(1, Math.abs(y - 0.25) * 2);
    }
    add(x, y, z);
  }
  for (let i = 0; i < 1600; i++) {
    const a = random() * Math.PI * 2, t = random();
    add(Math.cos(a) * (0.24 + t * 0.03), -0.43 + t * 0.92, Math.sin(a) * 0.25 - 0.06);
  }
  for (let i = 0; i < 11000; i++) {
    const t = random(), a = random() * Math.PI * 2;
    const width = 0.78 + 0.67 * Math.exp(-Math.pow((t - 0.82) * 3.4, 2));
    const y = -2.25 + t * 2.05;
    const shoulder = -Math.pow(Math.abs(Math.cos(a)), 4) * Math.pow(t, 5) * 0.33;
    add(Math.cos(a) * width, y + shoulder, Math.sin(a) * (0.39 + t * 0.08) - 0.12);
  }
  for (let i = 0; i < 1400; i++) add((random() - 0.5) * 3.7, (random() - 0.5) * 4.8, (random() - 0.5) * 1.6, 0);
  return { position: new Float32Array(positions), seed: new Float32Array(seeds) };
}

const particleVertex = `
  uniform float uTime; uniform float uScroll; uniform vec2 uPointer; uniform float uDpr;
  attribute vec3 aSeed; varying float vAlpha;
  void main() {
    vec3 p = position;
    float t = uTime * 0.3;
    float drift = 0.015 + pow(abs(uScroll), 3.0) * 0.23;
    p.x += sin(t + aSeed.x * 18.0 + p.y) * drift;
    p.y += cos(t * 0.6 + aSeed.y * 15.0) * drift;
    p.z += sin(t + aSeed.z * 14.0) * drift;
    float distanceToCursor = length(p.xy - uPointer * vec2(1.4, 2.8));
    p.x += (1.0 - smoothstep(0.0, 0.8, distanceToCursor)) * (aSeed.x - 0.5) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((0.45 + aSeed.x * 0.9) * 18.0 / -mv.z, 0.7, 2.8) * uDpr;
    float illumination = 0.6 + smoothstep(-0.5, 0.4, p.z) * 0.4;
    if (position.y > 0.25 && abs(position.x) < 0.7) {
      vec3 n = normalize(vec3(position.x / 0.58, (position.y - 0.99) / 0.79, position.z / 0.51));
      float key = max(0.0, dot(n, normalize(vec3(-0.65, 0.55, 1.0))));
      illumination = 0.12 + key * 0.95;
      if (position.z > 0.0) {
        float eyes = exp(-pow((abs(position.x) - 0.21) / 0.12, 2.0) - pow((position.y - 1.13) / 0.085, 2.0));
        float mouth = exp(-pow(position.x / 0.19, 4.0) - pow((position.y - 0.65) / 0.035, 2.0));
        illumination *= 1.0 - eyes * 0.92 - mouth * 0.65;
      } else { illumination *= 0.3; }
    }
    vAlpha = (0.34 + aSeed.z * 0.85) * illumination;
  }
`;
const particleFragment = `
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float glow = exp(-r * r * 18.0);
    gl_FragColor = vec4(vec3(0.92), glow * vAlpha);
  }
`;

function Figure({ reduced, progress }: Pick<SceneProps, "reduced" | "progress">) {
  const points = useMemo(() => particleFigure(), []);
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const dpr = useThree(state => state.gl.getPixelRatio());
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uScroll: { value: 0 }, uPointer: { value: new THREE.Vector2(4, 4) }, uDpr: { value: dpr } }), [dpr]);
  useFrame((state, dt) => {
    if (reduced || !material.current || !group.current) return;
    elapsed.current += Math.min(dt, 0.05);
    material.current.uniforms.uTime.value = elapsed.current;
    material.current.uniforms.uScroll.value = progress.current;
    material.current.uniforms.uPointer.value.lerp(state.pointer, 0.025);
    group.current.rotation.y = -0.3 + Math.sin(elapsed.current * 0.1) * 0.09 + state.pointer.x * 0.06;
  });
  return <group ref={group} rotation={[0, -0.3, -0.035]} position={[0, 0.2, 0]} scale={1.25}><points>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[points.position, 3]} /><bufferAttribute attach="attributes-aSeed" args={[points.seed, 3]} /></bufferGeometry>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={particleVertex} fragmentShader={particleFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
  </points></group>;
}

function ContextHealth({ onReady, onFailure }: Pick<SceneProps, "onReady" | "onFailure">) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    let frame2 = 0;
    const frame = requestAnimationFrame(() => { frame2 = requestAnimationFrame(onReady); });
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(frame2); gl.domElement.removeEventListener("webglcontextlost", lost); };
  }, [gl, onReady, onFailure]);
  return null;
}

export default function AtmosphereCanvas(props: SceneProps) {
  return <Canvas camera={{ position: [0, 0, props.mode === "particles" ? 7.7 : 9.5], fov: 38 }} dpr={[1, 1.4]} frameloop={props.active && !props.reduced ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} fallback={<span />}>
    <VisibleRegion region={props.region} reduced={props.reduced} />
    <ContextHealth onReady={props.onReady} onFailure={props.onFailure} />
    {props.mode === "particles" ? <Figure reduced={props.reduced} progress={props.progress} /> : <Membrane mode={props.mode} reduced={props.reduced} progress={props.progress} />}
  </Canvas>;
}
