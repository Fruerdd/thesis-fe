import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const architectureBlocks = [
  {
    title: "Transformer Encoder",
    tag: "BERT-base",
    items: [
      "Encodes each chunk independently",
      "[CLS] embedding as chunk representation",
      "Supports up to 256 tokens per chunk",
    ],
  },
  {
    title: "Chunk Attention Pooling",
    tag: "Aggregation",
    items: [
      "Attention score per chunk",
      "Weighted sum produces document embedding",
      "Handles variable-length documents",
    ],
  },
  {
    title: "Gated Fusion",
    tag: "Feature Merge",
    items: [
      "Projects 12-dim bias features to hidden space",
      "Learnable gate g in [0,1]",
      "fused = g * doc_emb + (1-g) * feat_emb",
    ],
  },
  {
    title: "Multi-Task Heads",
    tag: "Classification",
    items: [
      "Lean head: 5-way (Left to Right)",
      "Intensity head: 3-way (Neutral to Highly Biased)",
      "Domain head: 2-way with Gradient Reversal",
    ],
  },
];

const trainingDetails = [
  { label: "Optimizer", value: "AdamW" },
  { label: "Schedule", value: "Linear warmup" },
  { label: "Loss", value: "Masked cross-entropy" },
  { label: "W_lean", value: "1.0" },
  { label: "W_intensity", value: "1.0" },
  { label: "W_domain", value: "0.2" },
];

const dataSources = [
  {
    name: "Dataset A (Headlines)",
    description: "Short text segments labeled with political leaning",
  },
  {
    name: "Dataset B (Articles)",
    description: "Longer texts labeled with bias intensity",
  },
];

export function ArchitectureSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Model Architecture
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          A hierarchical multi-task bias model with four major blocks, domain
          adaptation, and interpretability.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {architectureBlocks.map((block) => (
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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Training Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {trainingDetails.map((d) => (
                <div key={d.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {d.label}
                  </span>
                  <span className="font-mono text-xs text-foreground">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {dataSources.map((ds) => (
              <div key={ds.name} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">
                  {ds.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ds.description}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
