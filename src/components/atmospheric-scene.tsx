"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

export type SceneMode = "silk" | "particles" | "curtain";
const AtmosphereCanvas = dynamic(() => import("./atmosphere-canvas"), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function AtmosphericScene({ mode, className = "" }: { mode: SceneMode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const progress = useRef(0);
  const readyScene = useCallback(() => setReady(true), []);
  const failScene = useCallback(() => { setFailed(true); setReady(false); }, []);
  useEffect(() => {
    let near = false;
    const update = () => setActive(near && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) setMounted(true);
      update();
    }, { rootMargin: "100px" });
    if (ref.current) observer.observe(ref.current);
    const scroll = () => {
      if (!near || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      progress.current = Math.max(-1, Math.min(1, (window.innerHeight / 2 - r.top - r.height / 2) / window.innerHeight));
    };
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", update);
    scroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", scroll); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div ref={ref} className={`atmospheric-scene scene-${mode} ${ready && !failed ? "scene-ready" : ""} ${className}`} aria-hidden="true">
    <div className="scene-fallback" />
    {mounted && !failed && <SceneBoundary onFailure={failScene}><AtmosphereCanvas mode={mode} reduced={!!reduced} active={active} progress={progress} onReady={readyScene} onFailure={failScene} /></SceneBoundary>}
  </div>;
}
