"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

export type SceneMode = "silk" | "particles" | "curtain";
export type RenderRegion = { x: number; y: number; width: number; height: number };
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
  const region = useRef<RenderRegion>({ x: 0, y: 0, width: 0, height: 0 });
  const readyScene = useCallback(() => setReady(true), []);
  const failScene = useCallback(() => { setFailed(true); setReady(false); }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const boundary = element.closest<HTMLElement>(".hero, .about");
    let near = false;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = element.getBoundingClientRect();
      const b = boundary?.getBoundingClientRect() ?? r;
      const left = Math.max(0, r.left, b.left);
      const right = Math.min(document.documentElement.clientWidth, r.right, b.right);
      // Keep the full vertical surface painted so scrolling can reveal it
      // immediately, even before the next animation frame.
      const top = Math.max(r.top, b.top);
      const bottom = Math.min(r.bottom, b.bottom);
      const visible = region.current;
      visible.x = left - r.left;
      visible.y = r.bottom - bottom;
      visible.width = Math.max(0, right - left);
      visible.height = Math.max(0, bottom - top);
      progress.current = Math.max(-1, Math.min(1, (window.innerHeight / 2 - r.top - r.height / 2) / window.innerHeight));
      setActive(near && !document.hidden && visible.width > 0 && visible.height > 0 && bottom > 0 && top < window.innerHeight);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) setMounted(true);
      schedule();
    }, { rootMargin: "100px" });
    observer.observe(element);
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    const scroll = () => { if (near) schedule(); };
    const visibility = () => { if (document.hidden) setActive(false); else schedule(); };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div ref={ref} className={`atmospheric-scene scene-${mode} ${ready && !failed ? "scene-ready" : ""} ${className}`} aria-hidden="true">
    <div className="scene-fallback" />
    {mounted && !failed && <SceneBoundary onFailure={failScene}><AtmosphereCanvas mode={mode} reduced={!!reduced} active={active} progress={progress} region={region} onReady={readyScene} onFailure={failScene} /></SceneBoundary>}
  </div>;
}
