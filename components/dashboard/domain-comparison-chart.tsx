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

type Metric = "count" | "avgConfidence";

export function DomainComparisonChart({ data }: { data: Prediction[] }) {
  const [metric, setMetric] = useState<Metric>("count");

  const chartData = useMemo(() => {
    const grouped: Record<string, Prediction[]> = {};
    for (const p of data) {
      const key = p.domain;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    }
    return Object.entries(grouped).map(([domain, preds]) => ({
      domain: domain.charAt(0).toUpperCase() + domain.slice(1),
      count: preds.length,
      avgConfidence: +(
        (preds.reduce((s, p) => s + p.leanConfidence, 0) / preds.length) *
        100
      ).toFixed(1),
    }));
  }, [data]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Domain Comparison
        </CardTitle>
        <Select
          value={metric}
          onValueChange={(v) => setMetric(v as Metric)}
        >
          <SelectTrigger className="h-7 w-36 text-xs bg-secondary text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="avgConfidence">Avg Confidence</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%" layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.01 250)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={metric === "avgConfidence" ? [0, 100] : undefined}
              />
              <YAxis
                type="category"
                dataKey="domain"
                tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.008 250)",
                  border: "1px solid oklch(0.25 0.01 250)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0.01 250)",
                  fontSize: 12,
                }}
                formatter={(value: number) =>
                  metric === "avgConfidence" ? `${value}%` : value
                }
              />
              <Bar
                dataKey={metric}
                fill="oklch(0.65 0.18 195)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
