import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "01", slug: "astroboat", title: "ASTROBOAT", category: "Astronomy / Web Platform", cover: "astro", featured: true,
    description: "An astronomy intelligence platform bringing together space updates, global celestial events, Moon phase data, and near-Earth object information.",
    url: "https://www.astroboat.in", technologies: [], images: [], caseStudy: [],
  },
  {
    id: "02", slug: "the-long-view", title: "THE LONG VIEW", category: "Finance / Independent Publication", cover: "longview", featured: true,
    description: "An independent publication exploring businesses, financial markets, company valuations, and financial technology through research and source-linked articles.",
    role: "Founder", technologies: [], images: [], caseStudy: [],
  },
  {
    id: "03", slug: "corealert", title: "COREALERT", category: "Android / Personal Safety", cover: "core", featured: true,
    description: "An Android-first personal safety application designed to help users quickly alert trusted guardians during emergencies.",
    technologies: [], images: [], caseStudy: [],
  },
  {
    id: "04", slug: "launch-lab", title: "LAUNCH_LAB", category: "Interactive Simulation", cover: "launch", featured: true,
    description: "A browser-based startup management simulation game where business decisions influence interconnected company systems.",
    technologies: [], images: [], caseStudy: [],
  },
  {
    id: "05", slug: "railsamanvay", title: "RAILSAMANVAY", category: "AI / Problem Solving", cover: "rail", featured: true,
    description: "An AI-powered solution developed around an Indian Railways problem statement.",
    technologies: [], images: [], caseStudy: [],
  },
  {
    id: "06", slug: "filepilot", title: "FILEPILOT", category: "Python / Utility", cover: "file", featured: false,
    description: "A Python CLI utility for safely cleaning and organizing messy folders.",
    technologies: ["Python"], images: [], caseStudy: [],
  },
  {
    id: "07", slug: "github-roaster", title: "GITHUB ROASTER", category: "AI / Web Application", cover: "github", featured: false,
    description: "An AI-powered web application that analyzes public GitHub profiles and turns repository data into entertaining observations.",
    technologies: [], images: [], caseStudy: [],
  },
  {
    id: "08", slug: "truckdeck", title: "TRUCKDECK", category: "Android / Simulation", cover: "truck", featured: false,
    description: "An Android controller and live dashboard for Euro Truck Simulator 2 running on macOS.",
    technologies: [], images: [], caseStudy: [],
  },
];
