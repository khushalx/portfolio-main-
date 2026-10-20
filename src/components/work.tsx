import Link from "next/link";
import { ArrowUpRight, FolderCode, Braces, Gauge } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCover } from "./project-cover";
import { Reveal } from "./motion";

export function Work() {
  return <section id="work" className="work section-space" aria-labelledby="work-title">
    <Reveal className="section-heading"><h2 id="work-title">WORK<span className="heading-count"> / 08</span></h2><p>Selected projects across<br />{ " " }software, AI, and finance.</p></Reveal>
    <div className="project-gallery">{projects.filter(p => p.featured).map(project => <Reveal className={`exhibition exhibition-${project.cover}`} key={project.slug}>
      <div className="project-heading"><div className="project-identity"><span className="project-number">{project.id}</span><h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3></div><span className="project-category">{project.category}</span></div>
      <Link className="project-link" href={`/work/${project.slug}`} aria-label={`View ${project.title} project`}><ProjectCover project={project} /></Link>
      <div className="exhibition-caption"><p>{project.description}</p><Link className="project-open" href={`/work/${project.slug}`}>VIEW PROJECT<ArrowUpRight size={22} /></Link></div>
    </Reveal>)}</div>
    <div className="additional-heading"><h3>MORE PROJECTS</h3><span>06 — 08</span></div>
    <div className="other-projects">{projects.filter(p => !p.featured).map(project => <Reveal className="other-project" key={project.slug}><Link href={`/work/${project.slug}`}><div className="other-project-top"><span>{project.id}</span>{project.cover === "file" ? <FolderCode size={36} /> : project.cover === "github" ? <Braces size={36} /> : <Gauge size={36} />}</div><span className="project-category">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><span className="project-open">VIEW PROJECT<ArrowUpRight size={20} /></span></Link></Reveal>)}</div>
  </section>;
}
