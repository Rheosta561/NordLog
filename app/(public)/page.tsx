import { Metadata } from "next";
import { LandingHero } from "./components/landing-hero";

import { CurrentPipeline } from "./components/current-pipeline";
import { LandingFeatured } from "./components/landing-featured";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Internship Journey`,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <div>
      <LandingHero />
      <CurrentPipeline />
      <LandingFeatured />
    </div>
  );
}
