import { Card, CardContent } from "@/components/ui/card";
import { FileInput, Layers, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: FileInput,
    title: "Paste Your Text",
    description:
      "Submit any news headline or full article. The tool accepts text of any length — from a single sentence to a multi-paragraph story.",
  },
  {
    icon: Layers,
    title: "Deep Text Analysis",
    description:
      "The model reads your text in segments, capturing both the overall narrative and the subtle word choices that signal political framing.",
  },
  {
    icon: Brain,
    title: "Bias Classification",
    description:
      "An AI model trained on thousands of labeled articles identifies the political leaning (Left, Center-Left, Center, Center-Right, Right) and how strongly biased the text is.",
  },
  {
    icon: BarChart3,
    title: "Explainable Results",
    description:
      "See exactly which sentences and words contributed most to the prediction, so you can understand the reasoning — not just the label.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          How It Works
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          From a single paste to a full breakdown in seconds — here's what
          happens under the hood.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Card
            key={step.title}
            className="relative border-border bg-card"
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {"0" + (i + 1)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
