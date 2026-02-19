import { predictions, LEAN_LABELS, INTENSITY_LABELS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Target,
  FileText,
  Layers,
} from "lucide-react";

const stats = [
  {
    label: "Predictions Analyzed",
    value: predictions.length,
    icon: FileText,
  },
  {
    label: "Leaning Classes",
    value: LEAN_LABELS.length,
    icon: BarChart3,
  },
  {
    label: "Intensity Classes",
    value: INTENSITY_LABELS.length,
    icon: Layers,
  },
  {
    label: "Avg Confidence",
    value:
      (
        predictions.reduce((s, p) => s + p.leanConfidence, 0) /
        predictions.length
      ).toFixed(0) + "%",
    icon: Target,
  },
];

export function StatsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex flex-col gap-2 p-5">
              <stat.icon className="h-5 w-5 text-primary" />
              <p className="font-mono text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
