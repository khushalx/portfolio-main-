"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={{ opacity: [0.75, 1], y: reduced ? 0 : [22, 0], filter: reduced ? "none" : ["blur(0px)", "blur(0px)"] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 20 });
  const y = useSpring(0, { stiffness: 180, damping: 20 });
  function move(e: MouseEvent<HTMLDivElement>) {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.13);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.13);
  }
  return <motion.div ref={ref} className={className} style={{ x, y }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>;
}
