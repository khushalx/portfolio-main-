import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";

export default function Home() {
  return <div id="top"><Navigation /><main id="main"><Hero /><Work /><About /><Experience /></main><Footer /></div>;
}
