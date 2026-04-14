import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featureBlocks = [
  {
    title: "Transformer-Based Understanding",
    tag: "BERT",
    items: [
      "Fine-tuned on political news datasets",
      "Understands context, not just keywords",
      "Handles long articles through smart chunking",
    ],
  },
  {
    title: "Dual Classification",
    tag: "Multi-Task",
    items: [
      "Political leaning: Left → Right (5 categories)",
      "Bias intensity: Neutral, Moderate, High",
      "Both predictions from a single pass",
    ],
  },
  {
    title: "Linguistic Signals",
    tag: "Feature Extraction",
    items: [
      "Detects hedging language and intensifiers",
      "Flags emotional or loaded phrasing",
      "Measures punctuation and capitalization patterns",
    ],
  },
  {
    title: "Transparent Explanations",
    tag: "Interpretability",
    items: [
      "Highlights the most influential text segments",
      "Token-level attribution shows word importance",
      "No black-box decisions — you see the reasoning",
    ],
  },
];

const highlights = [
  { label: "Political Lean Classes", value: "5" },
  { label: "Bias Intensity Levels", value: "3" },
  { label: "Explainability", value: "Built-in" },
  { label: "Max Input Length", value: "Unlimited" },
  { label: "Analysis Speed", value: "< 2 sec" },
  { label: "Domains Supported", value: "Cross-domain" },
];

export function ArchitectureSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          What Makes It Reliable
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Built on modern NLP research, the tool combines deep language
          understanding with interpretable outputs you can actually trust.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {featureBlocks.map((block) => (
          <Card key={block.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <CardTitle className="text-sm font-semibold">
                {block.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="ml-auto text-[10px] font-mono"
              >
                {block.tag}
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-1.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              At a Glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {highlights.map((h) => (
                <div key={h.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {h.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {h.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
