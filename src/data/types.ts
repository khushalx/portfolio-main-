export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  featured: boolean;
  cover: "astro" | "longview" | "core" | "launch" | "rail" | "file" | "github" | "truck";
  role?: string;
  url?: string;
  repository?: string;
  technologies: string[]; // Empty until the actual implementation stack is confirmed.
  images: { src: string; alt: string; width: number; height: number }[];
  caseStudy: { heading: string; body: string }[];
};
export type Experience = { role: string; organization: string; period: string; year: string; description: string };
