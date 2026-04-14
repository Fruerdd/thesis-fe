"use client";

import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LEAN_COLORS,
  INTENSITY_COLORS,
  type Prediction,
  type PoliticalLean,
  type BiasIntensity,
} from "@/lib/data";

type ColorBy = "lean" | "intensity";

export function ConfidenceScatterChart({ data }: { data: Prediction[] }) {
  const [colorBy, setColorBy] = useState<ColorBy>("lean");

  const chartData = useMemo(
    () =>
      data.map((p) => ({
        leanConf: +(p.leanConfidence * 100).toFixed(1),
        intConf: +(p.intensityConfidence * 100).toFixed(1),
        lean: p.lean,
        intensity: p.intensity,
        source: p.source,
        text: p.text.slice(0, 50) + "...",
      })),
    [data]
  );

  const getColor = (entry: (typeof chartData)[0]) => {
    if (colorBy === "lean") return LEAN_COLORS[entry.lean as PoliticalLean];
    return INTENSITY_COLORS[entry.intensity as BiasIntensity];
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Confidence Distribution
        </CardTitle>
        <Select
          value={colorBy}
          onValueChange={(v) => setColorBy(v as ColorBy)}
        >
          <SelectTrigger className="h-7 w-32 text-xs bg-secondary text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lean">Color by Lean</SelectItem>
            <SelectItem value="intensity">Color by Intensity</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ bottom: 5, left: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.01 250)"
              />
              <XAxis
                type="number"
                dataKey="leanConf"
                name="Lean Confidence"
                unit="%"
                domain={[50, 100]}
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Lean Confidence %",
                  position: "insideBottom",
                  offset: -2,
                  fill: "oklch(0.6 0.02 250)",
                  fontSize: 10,
                }}
              />
              <YAxis
                type="number"
                dataKey="intConf"
                name="Intensity Confidence"
                unit="%"
                domain={[50, 100]}
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Intensity Confidence %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "oklch(0.6 0.02 250)",
                  fontSize: 10,
                }}
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
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name,
                ]}
              />
              <Scatter data={chartData}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={getColor(entry)}
                    fillOpacity={0.8}
                    r={5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
