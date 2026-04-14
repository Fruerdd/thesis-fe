import type { Prediction, Domain } from "@/lib/data";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AnalysesParams {
  domain?: Domain | "all";
  source?: string;
  minConfidence?: number; // 0–100 (frontend scale)
}

export async function fetchAnalyses(
  params: AnalysesParams = {}
): Promise<Prediction[]> {
  const query = new URLSearchParams();

  if (params.domain && params.domain !== "all") {
    query.set("domain", params.domain);
  }
  if (params.source && params.source !== "all") {
    query.set("source", params.source);
  }
  if (params.minConfidence && params.minConfidence > 0) {
    query.set("min_confidence", String(params.minConfidence / 100));
  }

  const res = await fetch(`${API_BASE}/analyses?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch analyses: ${res.status}`);
  }

  return res.json() as Promise<Prediction[]>;
}

export async function fetchSources(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/sources`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}