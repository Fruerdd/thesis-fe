"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import type { Domain } from "@/lib/data";

interface GlobalFiltersProps {
  domainFilter: Domain | "all";
  setDomainFilter: (v: Domain | "all") => void;
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
  minConfidence: number;
  setMinConfidence: (v: number) => void;
  sources: string[];
  resultCount: number;
}

export function GlobalFilters({
  domainFilter,
  setDomainFilter,
  sourceFilter,
  setSourceFilter,
  minConfidence,
  setMinConfidence,
  sources,
  resultCount,
}: GlobalFiltersProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Global Filters
          </span>
          <Badge
            variant="secondary"
            className="ml-auto font-mono text-[10px]"
          >
            {resultCount} results
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Domain
            </label>
            <Select
              value={domainFilter}
              onValueChange={(v) => setDomainFilter(v as Domain | "all")}
            >
              <SelectTrigger className="h-9 bg-secondary text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="headline">Headlines</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Source
            </label>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-9 bg-secondary text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Min Confidence: {minConfidence}%
            </label>
            <Slider
              value={[minConfidence]}
              onValueChange={([v]) => setMinConfidence(v)}
              min={0}
              max={95}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
