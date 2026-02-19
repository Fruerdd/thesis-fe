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
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChartIcon } from "lucide-react";
import {
  INTENSITY_LABELS,
  INTENSITY_COLORS,
  type Prediction,
} from "@/lib/data";

export function IntensityDistributionChart({
  data,
}: {
  data: Prediction[];
}) {
  const [view, setView] = useState<"bar" | "pie">("bar");

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of INTENSITY_LABELS) counts[l] = 0;
    for (const p of data) counts[p.predictedIntensity]++;
    return INTENSITY_LABELS.map((l) => ({
      name: l,
      count: counts[l],
      fill: INTENSITY_COLORS[l],
    }));
  }, [data]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Bias Intensity Distribution
        </CardTitle>
        <div className="flex gap-0.5">
          <Button
            variant={view === "bar" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("bar")}
            className="h-7 w-7 p-0"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={view === "pie" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("pie")}
            className="h-7 w-7 p-0"
          >
            <PieChartIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {view === "bar" ? (
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
                    color: "oklch(0.95 0.01 250)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="name"
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 250)",
                    border: "1px solid oklch(0.25 0.01 250)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0.01 250)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: d.fill }}
              />
              <span className="text-[10px] text-muted-foreground">
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
