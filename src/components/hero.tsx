import { ArrowDown, ArrowUpRight } from "lucide-react";
import { editorial } from "@/data/editorial";
import { AtmosphericScene } from "./atmospheric-scene";

export function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <AtmosphericScene mode="silk" className="hero-lightform" />
    <div className="hero-copy">
      <p className="hero-eyebrow">{editorial.hero.eyebrow}</p>
      <h1 id="hero-title"><span>{editorial.hero.lineOne}</span><span>{editorial.hero.lineTwo}</span></h1>
      <p className="hero-intro">{editorial.hero.introduction}</p>
      <div className="hero-actions"><a href="#work" className="primary-link">{editorial.hero.primaryAction}<ArrowDown size={19} /></a><a href="#about" className="secondary-link">{editorial.hero.secondaryAction}<ArrowUpRight size={19} /></a></div>
    </div>
    <a className="hero-scroll" href="#work" aria-label="Scroll to work"><ArrowDown size={22} /></a>
  </section>;
}
