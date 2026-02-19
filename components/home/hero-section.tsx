import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ScanSearch } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center gap-8 px-6 py-24 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.65_0.18_195_/_0.15),transparent)]" />

      <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
        <ScanSearch className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          SSST Department of Computer Science
        </span>
      </div>

      <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        Detecting Political Bias in News with{" "}
        <span className="text-primary">AI</span>
      </h1>

      <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        A hierarchical multi-task BERT model for classifying political leaning
        and bias intensity in news articles and headlines, with built-in
        interpretability through chunk attention and integrated gradients.
      </p>

      <div className="flex items-center gap-3">
        <Button asChild size="lg">
          <Link href="/dashboard">
            View Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Pavel Kuznetsov &middot; Prof. Jasminka Hasic &middot; Academic Year
        2025/2026
      </p>
    </section>
  );
}
