import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ArchitectureSection } from "@/components/home/architecture-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <ArchitectureSection />
    </div>
  );
}
