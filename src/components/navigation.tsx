"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = ["Work", "About", "Experience", "Contact"];
export function Navigation({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = document.querySelectorAll<HTMLElement>("main, footer");
    background.forEach(element => { element.inert = true; });
    const focusable = () => [toggle.current!, ...Array.from(menu.current!.querySelectorAll<HTMLAnchorElement>("a"))];
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (e.key === "Tab") {
        const items = focusable();
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        if (e.shiftKey && index <= 0) { e.preventDefault(); items.at(-1)?.focus(); }
        else if (!e.shiftKey && index === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    }
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; background.forEach(element => { element.inert = false; }); window.removeEventListener("keydown", key); };
  }, [open]);

  return <header className={`site-header ${open ? "menu-open" : ""}`}>
    <Link className="wordmark" href="/" aria-label="Khushal Dangar home">KD<span>®</span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((item) => <Link href={`${home ? "" : "/"}#${item.toLowerCase()}`} key={item}>{item}{item === "Contact" && <ArrowUpRight size={13} />}</Link>)}</nav>
    <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav ref={menu} id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">{links.map((item, i) => <Link key={item} href={`${home ? "" : "/"}#${item.toLowerCase()}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{item}<ArrowUpRight /></Link>)}</nav>}
  </header>;
}
