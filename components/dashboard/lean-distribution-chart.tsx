"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { LEAN_LABELS, LEAN_COLORS, type Prediction } from "@/lib/data";

export function LeanDistributionChart({ data }: { data: Prediction[] }) {
  const [sortByCount, setSortByCount] = useState(false);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of LEAN_LABELS) counts[l] = 0;
    for (const p of data) counts[p.lean]++;
    const arr = LEAN_LABELS.map((l) => ({ name: l, count: counts[l] }));
    if (sortByCount) arr.sort((a, b) => b.count - a.count);
    return arr;
  }, [data, sortByCount]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Political Leaning Distribution
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortByCount((v) => !v)}
          className="h-7 gap-1 text-xs text-muted-foreground"
        >
          <ArrowUpDown className="h-3 w-3" />
          {sortByCount ? "Sorted" : "Default"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.01 250)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
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
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={LEAN_COLORS[entry.name as keyof typeof LEAN_COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
