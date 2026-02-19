import { Card, CardContent } from "@/components/ui/card";
import { FileInput, Layers, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: FileInput,
    title: "Input & Preprocessing",
    description:
      "Raw text is cleaned, deterministic bias features (hedges, intensifiers, negations, punctuation, uppercase ratio) are extracted, and the text is split into overlapping chunks.",
  },
  {
    icon: Layers,
    title: "Hierarchical Chunking",
    description:
      "Long articles are tokenized into fixed-size chunks with [CLS]/[SEP] tokens. Each chunk is encoded independently by BERT, then aggregated via attention pooling.",
  },
  {
    icon: Brain,
    title: "Multi-Task Classification",
    description:
      "Gated fusion combines transformer embeddings with projected bias features. Two task heads predict political leaning (5 classes) and bias intensity (3 classes).",
  },
  {
    icon: BarChart3,
    title: "Interpretability Output",
    description:
      "Chunk attention weights reveal which document segments drove the prediction. Optional Integrated Gradients provide token-level attribution for fine-grained explanation.",
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
          The pipeline processes text through four stages, from raw input to
          explainable predictions.
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
