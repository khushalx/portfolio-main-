import { experience } from "@/data/experience";
import { Reveal } from "./motion";

export function Experience() {
  return <section id="experience" className="experience section-space" aria-labelledby="experience-title">
    <Reveal className="section-heading"><h2 id="experience-title">EXPERIENCE</h2></Reveal>
    <div className="experience-grid">{experience.map((item, i) => <Reveal className={`experience-block experience-${i}`} key={item.organization}><span className="experience-year" aria-hidden="true">{item.year}</span><div className="experience-content"><span className="experience-date">{item.period}</span><h3>{item.role}</h3><p className="experience-organization">{item.organization}</p><p className="experience-description">{item.description}</p></div></Reveal>)}</div>
  </section>;
}
