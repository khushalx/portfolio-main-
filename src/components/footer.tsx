import { ArrowUpRight, ArrowUp } from "lucide-react";
import { socials, contact } from "@/data/socials";
import { profile } from "@/data/profile";
import { editorial } from "@/data/editorial";
import { Reveal } from "./motion";

export function Footer() {
  return <footer id="contact" className="contact section-space"><div className="contact-lightfield" aria-hidden="true" /><Reveal><div className="contact-top"><span className="field-label">CONTACT</span><ArrowUpRight size={58} strokeWidth={1.5} /></div><div className="contact-composition"><h2>{editorial.contact.title}</h2><div className="contact-bottom"><p>{editorial.contact.introduction}</p><div className="social-links">{socials.map(link => <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label.toUpperCase()}<ArrowUpRight size={22} /></a>)}{contact.email && <a href={`mailto:${contact.email}`} aria-label={`Email Khushal Dangar at ${contact.email}`}>EMAIL<ArrowUpRight size={22} /></a>}{contact.x && <a href={contact.x} aria-label="Khushal Dangar on X (opens in a new tab)" target="_blank" rel="noopener noreferrer">X<ArrowUpRight size={22} /></a>}{contact.other.map(link => <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label}<ArrowUpRight size={22} /></a>)}</div></div></div></Reveal><div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><a href="#top">BACK TO TOP<ArrowUp size={18} /></a></div></footer>;
}
