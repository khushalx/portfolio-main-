import { writeFile } from "node:fs/promises";

// Original vector art for first paint, reduced-capability devices and context loss.
// Rebuild with: node scripts/generate-fallbacks.mjs
const root = new URL("../public/images/", import.meta.url);
const membrane = [];
for (let i = 0; i < 100; i++) {
  const v = i / 99 * 2 - 1;
  let d = "";
  for (let j = 0; j <= 140; j++) {
    const u = j / 140 * 2 - 1;
    const z = Math.sin(u * 3.8 + v * 1.55 + 0.17) * 1.65 + Math.sin(u * 8.5 - v * 3.1 - 0.28) * 0.48;
    const x = 700 + (u * 7.8 + v * 0.48 * Math.sin(u * 3 + 0.28)) * 94;
    const y = 310 - (Math.sin(u * 3.2 + 0.3) * 1.18 + v * (1.28 + 0.42 * Math.cos(u * 3)) + z * 0.33) * 112;
    d += `${j ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  const tone = Math.round(80 + Math.pow(Math.sin(i / 99 * Math.PI), 0.7) * 120);
  membrane.push(`<path d="${d}" stroke="rgb(${tone},${tone},${tone})" stroke-width="3.6" opacity="${(0.18 + Math.sin(i / 99 * Math.PI) * 0.56).toFixed(2)}"/>`);
}
await writeFile(new URL("silver-membrane.svg", root), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 600" fill="none"><defs><radialGradient id="h"><stop stop-color="#bbb" stop-opacity=".04"/><stop offset="1" stop-color="#050505" stop-opacity="0"/></radialGradient></defs><ellipse cx="700" cy="330" rx="560" ry="210" fill="url(#h)"/>${membrane.join("")}</svg>`);

let seed = 45;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const bins = Array.from({length:8},()=>[]);
const dot = (x,y,z) => {
  // Slightly turned bust, matching the WebGL sculpture's view.
  const rx=x*.955-z*.296, rz=x*.296+z*.955;
  const px=250+rx*137, py=320-y*137;
  bins[Math.max(0,Math.min(7,Math.floor((rz+.65)*5)))].push(`M${px.toFixed(1)} ${py.toFixed(1)}v.1`);
};
for(let i=0;i<4000;i++) {
 const a=random()*Math.PI*2,h=random()*2-1,r=Math.sqrt(1-h*h);
 let x=Math.cos(a)*r*.58; const y=.99+h*.79; let z=Math.sin(a)*r*.51;
 if(z>0){z+=.22*Math.exp(-Math.pow(x/.105,2)-Math.pow((y-.92)/.19,2));z-=.075*(Math.exp(-Math.pow((x-.21)/.13,2))+Math.exp(-Math.pow((x+.21)/.13,2)))*Math.exp(-Math.pow((y-1.13)/.09,2));x*=.86+.14*Math.min(1,Math.abs(y-.25)*2);}
 dot(x,y,z);
}
for(let i=0;i<600;i++){const a=random()*Math.PI*2,t=random();dot(Math.cos(a)*(.24+t*.03),-.43+t*.92,Math.sin(a)*.25-.06);}
for(let i=0;i<4500;i++){const t=random(),a=random()*Math.PI*2,w=.78+.67*Math.exp(-Math.pow((t-.82)*3.4,2));dot(Math.cos(a)*w,-2.25+t*2.05-Math.pow(Math.abs(Math.cos(a)),4)*Math.pow(t,5)*.33,Math.sin(a)*(.39+t*.08)-.12);}
for(let i=0;i<400;i++)dot((random()-.5)*3.7,(random()-.5)*4.8,(random()-.5)*1.6);
const dots=bins.map((d,i)=>`<path d="${d.join('')}" fill="none" stroke="#eee" stroke-width="${.85+i*.055}" stroke-linecap="round" opacity="${.25+i*.09}"/>`);
await writeFile(new URL("particle-figure.svg",root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 680">${dots.join("")}</svg>`);

const curtains=[];
for(let i=0;i<110;i++){const x=80+i*11.5;const opacity=.015+Math.pow(.5+.5*Math.sin(i*.61),6)*.13;curtains.push(`<path d="M${x.toFixed(1)} -10C${(x+40).toFixed(1)} 120 ${(x-60).toFixed(1)} 260 ${(x+20).toFixed(1)} 550" stroke="white" opacity="${opacity.toFixed(3)}" stroke-width="${i%8===0?2:0.6}"/>`);}
await writeFile(new URL("light-curtain.svg",root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 550" fill="none"><defs><linearGradient id="f" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".5" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><mask id="m"><path fill="url(#f)" d="M0 0h1400v550H0z"/></mask></defs><g mask="url(#m)">${curtains.join("")}</g></svg>`);
console.log("Generated membrane, particle figure, and light curtain fallbacks.");
