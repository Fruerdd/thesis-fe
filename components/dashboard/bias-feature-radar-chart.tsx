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
import { LEAN_LABELS, INTENSITY_LABELS, type Prediction } from "@/lib/data";

type ProfileMode = "lean" | "intensity";

export function BiasFeatureRadarChart({ data }: { data: Prediction[] }) {
  const [mode, setMode] = useState<ProfileMode>("lean");

  const chartData = useMemo(() => {
    if (data.length === 0) {
      const labels = mode === "lean" ? LEAN_LABELS : INTENSITY_LABELS;
      return labels.map((l) => ({ feature: l, value: 0 }));
    }

    if (mode === "lean") {
      // average leanConfidence for each lean class across all predictions
      return LEAN_LABELS.map((label) => {
        const matching = data.filter((p) => p.lean === label);
        const avg =
          matching.length > 0
            ? matching.reduce((s, p) => s + p.leanConfidence, 0) /
              matching.length
            : 0;
        return { feature: label, value: +( avg * 100).toFixed(1) };
      });
    } else {
      // average intensityConfidence for each intensity class
      return INTENSITY_LABELS.map((label) => {
        const matching = data.filter((p) => p.intensity === label);
        const avg =
          matching.length > 0
            ? matching.reduce((s, p) => s + p.intensityConfidence, 0) /
              matching.length
            : 0;
        return { feature: label, value: +(avg * 100).toFixed(1) };
      });
    }
  }, [data, mode]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Confidence Profile
        </CardTitle>
        <Select
          value={mode}
          onValueChange={(v) => setMode(v as ProfileMode)}
        >
          <SelectTrigger className="h-7 w-28 text-xs bg-secondary text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lean">By Lean</SelectItem>
            <SelectItem value="intensity">By Intensity</SelectItem>
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
                name="Avg Confidence %"
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
                  fontSize: 12,
                }}
                labelStyle={{ color: "oklch(0.95 0.01 250)" }}
                itemStyle={{ color: "oklch(0.95 0.01 250)" }}
                formatter={(value: number) => [`${value}%`, "Avg Confidence"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}