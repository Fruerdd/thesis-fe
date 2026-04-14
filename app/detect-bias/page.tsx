"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

type PredictionPayload = {
  political_bias?: string | null;
  bias_intensity?: string | null;
  biased?: boolean | null;
  biased_score?: number | null;

  probs_lean?: Record<string, number | string> | null;
  probs_int?: Record<string, number | string> | null;
  chunk_attention?: number[] | null;

  error?: string;
  [k: string]: any;
};

type AnalyzeResponse = {
  id: number;
  analyzed_at?: string;

  // your DB/API uses source_name (not source)
  source_name: string;

  input_type: "text" | "url";
  url?: string | null;

  // might exist top-level, but we will fallback to prediction
  political_bias?: string | null;
  bias_intensity?: string | null;
  biased_score?: number | null;

  prediction: PredictionPayload;

  duration_ms?: number | null;
};

const POPULAR_SOURCES = [
  "BBC",
  "Reuters",
  "AP News",
  "The Guardian",
  "CNN",
  "MSNBC",
  "Fox News",
  "The Wall Street Journal",
  "The New York Times",
  "Breitbart",
];

function looksLikeUrl(s: string) {
  return /^https?:\/\/\S+/i.test(s.trim());
}

/**
 * Handles values that may come as number OR string (e.g. from JSON)
 */
function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function maxProb(map?: Record<string, unknown> | null): number | null {
  if (!map) return null;
  let m: number | null = null;
  for (const val of Object.values(map)) {
    const n = toNumber(val);
    if (n == null) continue;
    m = m == null ? n : Math.max(m, n);
  }
  return m;
}

export default function DetectBiasPage() {
  const [source, setSource] = useState<string>("BBC");
  const [customSource, setCustomSource] = useState<string>("");
  const [input, setInput] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const finalSource = useMemo(() => {
    return source === "__custom__" ? customSource.trim() : source;
  }, [source, customSource]);

  async function onSubmit() {
    setError(null);
    setResult(null);

    if (!finalSource) {
      setError("Please provide a news source name.");
      return;
    }

    const value = input.trim();
    if (!value) {
      setError("Please provide a URL or paste article text.");
      return;
    }

    // Backend expects either {source, url} or {source, text}
    const payload = looksLikeUrl(value)
      ? { source: finalSource, url: value }
      : { source: finalSource, text: value };

    setLoading(true);
    try {
      const res = await fetch("/api/detect-bias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // try JSON error first, then text
        let msg = "";
        try {
          const j = await res.json();
          msg = JSON.stringify(j);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg || "Request failed");
      }

      const data: AnalyzeResponse = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ---------- Derived display fields ----------
  const display = useMemo(() => {
    if (!result) return null;

    const p = result.prediction ?? {};
    const politicalBias = result.political_bias ?? p.political_bias ?? "—";
    const biasIntensity = result.bias_intensity ?? p.bias_intensity ?? "—";

    const leanMax = maxProb(p.probs_lean);
    const intMax = maxProb(p.probs_int);

    const confidence = Math.max(leanMax ?? 0, intMax ?? 0);
    const confidencePct = Math.round(confidence * 100);

    const biasedScore = toNumber(result.biased_score ?? p.biased_score) ?? null;
    const biased =
      typeof p.biased === "boolean"
        ? p.biased
        : biasedScore != null
          ? biasedScore >= 0.5
          : false;

    return {
      sourceName: result.source_name,
      inputType: result.input_type,
      politicalBias,
      biasIntensity,
      confidencePct,
      biasedScore,
      biased,
      error: p.error,
    };
  }, [result]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Detect Bias</h1>
        <p className="mt-2 text-muted-foreground">
          Paste a news article or provide a link. The model will predict political leaning and bias intensity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze an Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">News Source</div>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom__">Custom…</SelectItem>
                </SelectContent>
              </Select>

              {source === "__custom__" && (
                <Input
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  placeholder="Type a source name (e.g., Al Jazeera)"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Link / Text</div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a URL (https://...) or article text..."
                className="min-h-[180px]"
              />
              <div className="text-xs text-muted-foreground">
                Tip: If it starts with http(s), it will be treated as a URL.
              </div>
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}

            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Analyzing..." : "Run Detection"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && !error && (
              <div className="text-sm text-muted-foreground">
                Submit an article to see predictions here.
              </div>
            )}

            {result && display && (
              <>
                {/* Top badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{display.sourceName}</Badge>
                  {display.biased
                    ? <Badge>Biased</Badge>
                    : <Badge variant="secondary">Not Biased</Badge>}
                </div>

                {/* Main result cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground">Political Leaning</div>
                      <div className="text-lg font-semibold">{display.politicalBias}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground">Bias Intensity</div>
                      <div className="text-lg font-semibold">{display.biasIntensity}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="text-lg font-semibold">{display.confidencePct}%</div>
                  </CardContent>
                </Card>

                {/* Analysis details toggle */}
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    Analysis Details
                  </span>
                  {showDetails
                    ? <ChevronUp className="h-3.5 w-3.5" />
                    : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showDetails && (
                  <div className="space-y-3 rounded-md border border-border p-4 text-sm">
                    {/* Lean probabilities */}
                    {result.prediction?.probs_lean && (
                      <div>
                        <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Leaning Probabilities
                        </div>
                        <div className="space-y-1.5">
                          {Object.entries(result.prediction.probs_lean)
                            .sort(([, a], [, b]) => (toNumber(b) ?? 0) - (toNumber(a) ?? 0))
                            .map(([label, prob]) => {
                              const pct = Math.round((toNumber(prob) ?? 0) * 100);
                              return (
                                <div key={label} className="flex items-center gap-2">
                                  <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
                                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
                                    <div
                                      className="h-full rounded-full bg-primary"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="w-8 text-right text-xs tabular-nums">{pct}%</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Intensity probabilities */}
                    {result.prediction?.probs_int && (
                      <div>
                        <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Intensity Probabilities
                        </div>
                        <div className="space-y-1.5">
                          {Object.entries(result.prediction.probs_int)
                            .sort(([, a], [, b]) => (toNumber(b) ?? 0) - (toNumber(a) ?? 0))
                            .map(([label, prob]) => {
                              const pct = Math.round((toNumber(prob) ?? 0) * 100);
                              return (
                                <div key={label} className="flex items-center gap-2">
                                  <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
                                  <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
                                    <div
                                      className="h-full rounded-full bg-primary"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="w-8 text-right text-xs tabular-nums">{pct}%</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Chunk attention */}
                    {result.prediction?.chunk_attention && result.prediction.chunk_attention.length > 0 && (
                      <div>
                        <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Chunk Attention Weights
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.prediction.chunk_attention.map((w, i) => {
                            const pct = Math.round(w * 100);
                            return (
                              <span
                                key={i}
                                className="rounded px-2 py-0.5 text-xs tabular-nums"
                                style={{ backgroundColor: `oklch(0.65 0.18 195 / ${0.15 + w * 0.7})`, color: "oklch(0.95 0.01 250)" }}
                                title={`Chunk ${i + 1}: ${pct}%`}
                              >
                                #{i + 1} · {pct}%
                              </span>
                            );
                          })}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          How much each segment of the text influenced the prediction. Brighter = more weight.
                        </p>
                      </div>
                    )}

                    {display.error && (
                      <div className="text-xs text-yellow-500">
                        Model note: {display.error}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}