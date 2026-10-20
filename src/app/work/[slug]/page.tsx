import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { projectDisplayNames } from "@/data/editorial";
import { Navigation } from "@/components/navigation";
import { ProjectCover } from "@/components/project-cover";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/motion";

export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  return project ? { title: project.title, description: project.description, ...(process.env.NEXT_PUBLIC_SITE_URL ? { alternates: { canonical: `/work/${slug}` } } : {}), openGraph: { title: project.title, description: project.description } } : {};
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <div id="top"><Navigation home={false} /><main id="main" className="detail-page"><Link className="back-link micro" href="/#work"><ArrowLeft size={15} /> BACK TO WORK</Link><div className="detail-heading"><span className="micro muted">PROJECT {project.id} / {project.category.toUpperCase()}</span><h1>{projectDisplayNames[project.slug]}</h1></div><ProjectCover project={project} /><Reveal className="detail-overview"><div><span className="micro muted">OVERVIEW</span>{project.role && <p className="detail-role">Role: {project.role}</p>}</div><div><p className="detail-description">{project.description}</p><div className="detail-links">{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit the live project <ArrowUpRight size={20} /></a>}{project.repository && <a className="text-link" href={project.repository} target="_blank" rel="noopener noreferrer">View repository <ArrowUpRight size={20} /></a>}</div>{project.technologies.length > 0 && <div className="tech-list">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>}</div></Reveal>{project.images.map(img => <figure className="project-screenshot" key={img.src}><Image {...img} alt={img.alt} sizes="(max-width: 700px) 90vw, 85vw" /><figcaption>{img.alt}</figcaption></figure>)}{project.caseStudy.length ? project.caseStudy.map(section => <Reveal className="case-section" key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></Reveal>) : null}<Link className="next-project" href={`/work/${next.slug}`}><span className="micro">NEXT PROJECT</span><span>{projectDisplayNames[next.slug]}<ArrowRight /></span></Link></main><Footer /></div>;
}
