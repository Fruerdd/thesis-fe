"use client";

import { useState, useMemo } from "react";
import {
  predictions,
  type Domain,
  type Prediction,
} from "@/lib/data";
import { GlobalFilters } from "@/components/dashboard/global-filters";
import { LeanDistributionChart } from "@/components/dashboard/lean-distribution-chart";
import { IntensityDistributionChart } from "@/components/dashboard/intensity-distribution-chart";
import { ConfidenceScatterChart } from "@/components/dashboard/confidence-scatter-chart";
import { BiasFeatureRadarChart } from "@/components/dashboard/bias-feature-radar-chart";
import { DomainComparisonChart } from "@/components/dashboard/domain-comparison-chart";
import { PredictionTable } from "@/components/dashboard/prediction-table";

export default function DashboardPage() {
  const [domainFilter, setDomainFilter] = useState<Domain | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [minConfidence, setMinConfidence] = useState(0);

  const sources = useMemo(
    () => Array.from(new Set(predictions.map((p) => p.source))).sort(),
    []
  );

  const filtered: Prediction[] = useMemo(() => {
    return predictions.filter((p) => {
      if (domainFilter !== "all" && p.domain !== domainFilter) return false;
      if (sourceFilter !== "all" && p.source !== sourceFilter) return false;
      if (p.leanConfidence < minConfidence / 100) return false;
      return true;
    });
  }, [domainFilter, sourceFilter, minConfidence]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Predictions Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore model predictions across {predictions.length} analyzed news
          items.
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
