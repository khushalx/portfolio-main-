import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { Reveal } from "./motion";
import { AtmosphericScene } from "./atmospheric-scene";

export function About() {
  return <section id="about" className="about section-space" aria-labelledby="about-title">
    <div className="about-grid"><div className="about-art"><h2 id="about-title">ABOUT</h2><div className="particle-portrait"><AtmosphericScene mode="particles" /></div></div>
      <Reveal className="about-copy"><p className="about-lead">SOFTWARE ENGINEERING.<br />ARTIFICIAL INTELLIGENCE.<br />REAL PRODUCTS.</p><p className="intro">{profile.introduction}</p><p>{profile.biography}</p><div className="education"><span className="field-label">EDUCATION</span><h3>{education.university}</h3><span>{education.school}</span><p>{education.degree}</p><strong>{education.period}</strong></div></Reveal>
    </div>
    <Reveal className="capabilities"><h3>SKILLS & INTERESTS</h3><ul>{profile.capabilities.map(skill => <li key={skill}>{skill}</li>)}</ul></Reveal>
  </section>;
}
