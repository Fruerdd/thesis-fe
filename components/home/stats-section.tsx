import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Target,
  Zap,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    label: "Political Lean Categories",
    value: "5",
    icon: BarChart3,
  },
  {
    label: "Bias Intensity Levels",
    value: "3",
    icon: Target,
  },
  {
    label: "Avg. Analysis Time",
    value: "< 2s",
    icon: Zap,
  },
  {
    label: "Explainable Predictions",
    value: "100%",
    icon: ShieldCheck,
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
