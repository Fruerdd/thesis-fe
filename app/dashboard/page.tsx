"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Domain, Prediction } from "@/lib/data";
import { fetchAnalyses, fetchSources } from "@/lib/api";
import { GlobalFilters } from "@/components/dashboard/global-filters";
import { LeanDistributionChart } from "@/components/dashboard/lean-distribution-chart";
import { IntensityDistributionChart } from "@/components/dashboard/intensity-distribution-chart";
import { ConfidenceScatterChart } from "@/components/dashboard/confidence-scatter-chart";
import { BiasFeatureRadarChart } from "@/components/dashboard/bias-feature-radar-chart";
import { DomainComparisonChart } from "@/components/dashboard/domain-comparison-chart";
import { PredictionTable } from "@/components/dashboard/prediction-table";

export default function DashboardPage() {
  // ── filter state (same as before) ──────────────────────────────────────
  const [domainFilter, setDomainFilter] = useState<Domain | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [minConfidence, setMinConfidence] = useState(0);

  // ── remote data state ──────────────────────────────────────────────────
  const [allData, setAllData]     = useState<Prediction[]>([]);
  const [sources, setSources]     = useState<string[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // ── fetch all data once on mount ───────────────────────────────────────
  // We fetch unfiltered and let the existing client-side filter logic work,
  // preserving exactly the same UX as before.
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, srcs] = await Promise.all([
        fetchAnalyses(),   // no params → fetch all
        fetchSources(),
      ]);
      setAllData(data);
      setSources(srcs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── client-side filtering (identical logic to original) ────────────────
  const filtered: Prediction[] = useMemo(() => {
    return allData.filter((p) => {
      if (domainFilter !== "all" && p.domain !== domainFilter) return false;
      if (sourceFilter !== "all" && p.source !== sourceFilter) return false;
      if (p.leanConfidence < minConfidence / 100) return false;
      return true;
    });
  }, [allData, domainFilter, sourceFilter, minConfidence]);

  // ── loading / error UI ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Predictions Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Loading data…</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Predictions Dashboard
          </h1>
        </div>
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-6 py-5 text-sm text-destructive">
          <p className="font-semibold">Failed to load data</p>
          <p className="mt-1 text-muted-foreground">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── main render (identical to original) ───────────────────────────────
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Predictions Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore model predictions across {allData.length} analyzed news items.
        </p>
      </div>

      <GlobalFilters
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        minConfidence={minConfidence}
        setMinConfidence={setMinConfidence}
        sources={sources}
        resultCount={filtered.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <LeanDistributionChart data={filtered} />
        <IntensityDistributionChart data={filtered} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ConfidenceScatterChart data={filtered} />
        <BiasFeatureRadarChart data={filtered} />
      </div>

      <DomainComparisonChart data={filtered} />
      <PredictionTable data={filtered} />
    </div>
  );
}