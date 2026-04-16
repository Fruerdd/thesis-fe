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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  INTENSITY_LABELS,
  type BiasIntensity,
  type Prediction,
} from "@/lib/data";

type SortField = "leanConfidence" | "intensityConfidence" | "source";

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

const intensityVariant: Record<
  BiasIntensity,
  "default" | "secondary" | "destructive"
> = {
  Neutral: "secondary",
  "Slightly Biased": "default",
  "Highly Biased": "destructive",
};

function ProbBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs tabular-nums">{pct}%</span>
    </div>
  );
}

function PredictionDetail({ p }: { p: Prediction }) {
  const biased = p.intensity !== "Neutral";

  // Build lean probs from leanConfidence on the winning class only
  // (static data doesn't carry per-class probs, so we surface what we have)
  const chunkWeights = p.chunkAttention ?? [];

  return (
    <div className="space-y-5 text-sm">
      {/* Summary row */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={intensityVariant[p.intensity]}>{p.intensity}</Badge>
        <Badge variant="secondary">{p.lean}</Badge>
        {biased ? <Badge>Biased</Badge> : <Badge variant="secondary">Not Biased</Badge>}
        <Badge variant="secondary" className="font-mono">{p.source}</Badge>
      </div>

      {/* Full text */}
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Text
        </div>
        <p className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-relaxed text-foreground">
          {p.text}
        </p>
      </div>

      {/* Confidence scores */}
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Confidence Scores
        </div>
        <div className="space-y-1.5">
          <ProbBar label="Lean confidence" value={p.leanConfidence} />
          <ProbBar label="Intensity conf." value={p.intensityConfidence} />
        </div>
      </div>

      {/* Chunk attention */}
      {chunkWeights.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Chunk Attention
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chunkWeights.map((w, i) => {
              const pct = Math.round(w * 100);
              return (
                <span
                  key={i}
                  className="rounded px-2 py-0.5 text-xs tabular-nums"
                  style={{
                    backgroundColor: `oklch(0.65 0.18 195 / ${0.15 + w * 0.7})`,
                    color: "oklch(0.95 0.01 250)",
                  }}
                  title={`Chunk ${i + 1}: ${pct}%`}
                >
                  #{i + 1} · {pct}%
                </span>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            How much each text segment influenced the prediction. Brighter = more weight.
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Domain: <span className="text-foreground">{p.domain}</span></span>
        <span>ID: <span className="font-mono text-foreground">#{p.id}</span></span>
      </div>
    </div>
  );
}

export function PredictionTable({ data }: { data: Prediction[] }) {
  const [intensityFilter, setIntensityFilter] = useState<BiasIntensity | "all">("all");
  const [sortField, setSortField] = useState<SortField>("leanConfidence");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Prediction | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let items = [...data];
    if (intensityFilter !== "all") {
      items = items.filter((p) => p.intensity === intensityFilter);
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

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, page * pageSize + pageSize);

  // Reset to first page when filter or page size changes
  const handleIntensityChange = (v: string) => {
    setIntensityFilter(v as BiasIntensity | "all");
    setPage(0);
  };
  const handlePageSizeChange = (v: string) => {
    setPageSize(Number(v));
    setPage(0);
  };

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold">Prediction Details</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={intensityFilter} onValueChange={handleIntensityChange}>
              <SelectTrigger className="h-7 w-36 text-xs bg-secondary text-foreground">
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intensities</SelectItem>
                {INTENSITY_LABELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-7 w-20 text-xs bg-secondary text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} rows</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                      Source <ArrowUpDown className="h-3 w-3" />
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
                      Lean Conf. <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 p-0 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort("intensityConfidence")}
                    >
                      Int. Conf. <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-border cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => setSelected(p)}
                  >
                    <TableCell className="max-w-[260px] truncate text-xs text-foreground">
                      {p.text}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {p.source}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-mono whitespace-nowrap">
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
                {paginated.length === 0 && (
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

          {/* Pagination footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <span className="text-xs text-muted-foreground">
              {filtered.length === 0
                ? "No results"
                : `${page * pageSize + 1}–${Math.min(page * pageSize + pageSize, filtered.length)} of ${filtered.length}`}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-xs text-muted-foreground">
                {page + 1} / {Math.max(totalPages, 1)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Prediction Details</DialogTitle>
          </DialogHeader>
          {selected && <PredictionDetail p={selected} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
