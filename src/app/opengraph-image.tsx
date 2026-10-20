import { ImageResponse } from "next/og";
export const alt = "Khushal Dangar — Software / AI / Finance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#050505", color: "#eeeeee", display: "flex", flexDirection: "column", justifyContent: "center", padding: 70, position: "relative" }}><div style={{ display: "flex", position: "absolute", top: 50, left: 70, fontSize: 20, fontWeight: 700 }}>SOFTWARE / AI / FINANCE</div><div style={{ display: "flex", flexDirection: "column", fontSize: 122, fontWeight: 900, lineHeight: .94, letterSpacing: -9 }}><span>KHUSHAL</span><span style={{ color: "#bbb" }}>DANGAR.</span></div><svg width="800" height="550" viewBox="0 0 800 550" style={{ position: "absolute", right: -100, bottom: -80, opacity: .65 }}>{Array.from({ length: 60 }, (_, i) => <path key={i} d={`M0 ${340 + i * 2.1}C220 ${590 - i * 4} 430 ${-160 + i * 6} 800 ${40 + i * 4}`} fill="none" stroke="#ddd" strokeWidth="2" opacity={0.07 + Math.sin(i / 60 * Math.PI) * 0.4} />)}</svg><div style={{ display: "flex", position: "absolute", bottom: 50, left: 70, fontSize: 22, color: "#aaa" }}>I build software, explore ideas, and turn projects into products.</div></div>, size);
}
