"use client";

import { useMemo, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Prediction } from "@/lib/data";

type AggMode = "mean" | "max";

const featureKeys = [
  "hedges",
  "intensifiers",
  "negations",
  "punctuation",
  "uppercaseRatio",
  "quotationUsage",
] as const;

const featureLabels: Record<(typeof featureKeys)[number], string> = {
  hedges: "Hedges",
  intensifiers: "Intensifiers",
  negations: "Negations",
  punctuation: "Punctuation",
  uppercaseRatio: "Uppercase",
  quotationUsage: "Quotation",
};

export function BiasFeatureRadarChart({ data }: { data: Prediction[] }) {
  const [aggMode, setAggMode] = useState<AggMode>("mean");

  const chartData = useMemo(() => {
    if (data.length === 0) {
      return featureKeys.map((k) => ({ feature: featureLabels[k], value: 0 }));
    }
    return featureKeys.map((k) => {
      const values = data.map((p) => p.biasFeatures[k]);
      const agg =
        aggMode === "mean"
          ? values.reduce((a, b) => a + b, 0) / values.length
          : Math.max(...values);
      return { feature: featureLabels[k], value: +agg.toFixed(2) };
    });
  }, [data, aggMode]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Bias Feature Profile
        </CardTitle>
        <Select
          value={aggMode}
          onValueChange={(v) => setAggMode(v as AggMode)}
        >
          <SelectTrigger className="h-7 w-24 text-xs bg-secondary text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mean">Mean</SelectItem>
            <SelectItem value="max">Max</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="oklch(0.25 0.01 250)" />
              <PolarAngleAxis
                dataKey="feature"
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 10 }}
              />
              <Radar
                name="Features"
                dataKey="value"
                stroke="oklch(0.65 0.18 195)"
                fill="oklch(0.65 0.18 195)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.008 250)",
                  border: "1px solid oklch(0.25 0.01 250)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0.01 250)",
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
