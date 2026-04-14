"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  INTENSITY_LABELS,
  type BiasIntensity,
  type Prediction,
} from "@/lib/data";

type SortField = "leanConfidence" | "intensityConfidence" | "source";

const intensityVariant: Record<BiasIntensity, "default" | "secondary" | "destructive"> = {
  Neutral: "secondary",
  "Slightly Biased": "default",
  "Highly Biased": "destructive",
};

export function PredictionTable({ data }: { data: Prediction[] }) {
  const [intensityFilter, setIntensityFilter] = useState<
    BiasIntensity | "all"
  >("all");
  const [sortField, setSortField] = useState<SortField>("leanConfidence");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let items = [...data];
    if (intensityFilter !== "all") {
      items.filter((p) => p.intensity === intensityFilter)
    }
    items.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return items;
  }, [data, intensityFilter, sortField, sortDir]);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          Prediction Details
        </CardTitle>
        <Select
          value={intensityFilter}
          onValueChange={(v) =>
            setIntensityFilter(v as BiasIntensity | "all")
          }
        >
          <SelectTrigger className="h-7 w-36 text-xs bg-secondary text-foreground">
            <SelectValue placeholder="Intensity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intensities</SelectItem>
            {INTENSITY_LABELS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Text
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 p-0 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("source")}
                  >
                    Source
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Lean
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Intensity
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 p-0 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("leanConfidence")}
                  >
                    Lean Conf.
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 p-0 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("intensityConfidence")}
                  >
                    Int. Conf.
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="border-border">
                  <TableCell className="max-w-[260px] truncate text-xs text-foreground">
                    {p.text}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {p.source}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-mono whitespace-nowrap"
                    >
                      {p.lean}  
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={intensityVariant[p.intensity]}
                      className="text-[10px] font-mono whitespace-nowrap"
                    >
                      {p.intensity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground">
                    {(p.leanConfidence * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground">
                    {(p.intensityConfidence * 100).toFixed(0)}%
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No predictions match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
