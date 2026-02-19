export type PoliticalLean =
  | "Right"
  | "Right-center"
  | "Center"
  | "Left-center"
  | "Left";
export type BiasIntensity = "Highly Biased" | "Slightly Biased" | "Neutral";
export type Domain = "headline" | "article";

export interface Prediction {
  id: number;
  text: string;
  source: string;
  domain: Domain;
  predictedLean: PoliticalLean;
  predictedIntensity: BiasIntensity;
  leanConfidence: number;
  intensityConfidence: number;
  chunkAttentionWeights: number[];
  biasFeatures: {
    hedges: number;
    intensifiers: number;
    negations: number;
    punctuation: number;
    uppercaseRatio: number;
    quotationUsage: number;
  };
}

export const LEAN_LABELS: PoliticalLean[] = [
  "Left",
  "Left-center",
  "Center",
  "Right-center",
  "Right",
];

export const INTENSITY_LABELS: BiasIntensity[] = [
  "Neutral",
  "Slightly Biased",
  "Highly Biased",
];

export const LEAN_COLORS: Record<PoliticalLean, string> = {
  Left: "oklch(0.55 0.15 240)",
  "Left-center": "oklch(0.6 0.12 210)",
  Center: "oklch(0.7 0.15 160)",
  "Right-center": "oklch(0.65 0.15 50)",
  Right: "oklch(0.6 0.2 30)",
};

export const INTENSITY_COLORS: Record<BiasIntensity, string> = {
  Neutral: "oklch(0.7 0.15 160)",
  "Slightly Biased": "oklch(0.75 0.1 80)",
  "Highly Biased": "oklch(0.6 0.2 30)",
};

export const predictions: Prediction[] = [
  {
    id: 1,
    text: "Government announces sweeping new tax reforms targeting wealthy",
    source: "CNN",
    domain: "headline",
    predictedLean: "Left-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.82,
    intensityConfidence: 0.74,
    chunkAttentionWeights: [0.85],
    biasFeatures: { hedges: 0, intensifiers: 2, negations: 0, punctuation: 0, uppercaseRatio: 0.02, quotationUsage: 0 },
  },
  {
    id: 2,
    text: "Democrats push radical spending bill despite economic warnings from experts",
    source: "Fox News",
    domain: "headline",
    predictedLean: "Right",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.91,
    intensityConfidence: 0.88,
    chunkAttentionWeights: [0.92],
    biasFeatures: { hedges: 0, intensifiers: 3, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 3,
    text: "Senate passes bipartisan infrastructure deal with broad support from both parties",
    source: "Reuters",
    domain: "headline",
    predictedLean: "Center",
    predictedIntensity: "Neutral",
    leanConfidence: 0.87,
    intensityConfidence: 0.91,
    chunkAttentionWeights: [0.55],
    biasFeatures: { hedges: 0, intensifiers: 0, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 4,
    text: "The recent climate legislation represents a significant step forward in addressing environmental concerns, though critics argue the measures don't go far enough to meet international targets. The bill allocates funding across multiple sectors including renewable energy, electric vehicle infrastructure, and carbon capture technology. Environmental groups have largely praised the effort while calling for more aggressive timelines.",
    source: "The Guardian",
    domain: "article",
    predictedLean: "Left-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.76,
    intensityConfidence: 0.69,
    chunkAttentionWeights: [0.72, 0.45, 0.61],
    biasFeatures: { hedges: 2, intensifiers: 1, negations: 1, punctuation: 2, uppercaseRatio: 0.01, quotationUsage: 1 },
  },
  {
    id: 5,
    text: "Republican leaders expose wasteful government spending in shocking report",
    source: "Breitbart",
    domain: "headline",
    predictedLean: "Right",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.94,
    intensityConfidence: 0.85,
    chunkAttentionWeights: [0.88],
    biasFeatures: { hedges: 0, intensifiers: 3, negations: 0, punctuation: 1, uppercaseRatio: 0.03, quotationUsage: 0 },
  },
  {
    id: 6,
    text: "Healthcare reform proposals aim to extend coverage to uninsured Americans. The proposed legislation draws on models from several countries with universal healthcare systems. Supporters point to potential long-term savings while opponents cite concerns about government overreach and increased taxes. Hospital associations have expressed cautious optimism.",
    source: "AP News",
    domain: "article",
    predictedLean: "Center",
    predictedIntensity: "Neutral",
    leanConfidence: 0.83,
    intensityConfidence: 0.86,
    chunkAttentionWeights: [0.51, 0.48, 0.52],
    biasFeatures: { hedges: 1, intensifiers: 0, negations: 0, punctuation: 1, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 7,
    text: "Progressive activists demand immediate action on student debt crisis",
    source: "MSNBC",
    domain: "headline",
    predictedLean: "Left",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.89,
    intensityConfidence: 0.82,
    chunkAttentionWeights: [0.9],
    biasFeatures: { hedges: 0, intensifiers: 2, negations: 0, punctuation: 1, uppercaseRatio: 0.02, quotationUsage: 0 },
  },
  {
    id: 8,
    text: "Immigration policy changes spark debate. The new executive order modifies visa processing times and introduces additional vetting requirements. Advocacy groups argue the changes disproportionately impact families, while security officials defend the measures as necessary. Legal challenges are already being prepared by multiple organizations.",
    source: "BBC",
    domain: "article",
    predictedLean: "Left-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.71,
    intensityConfidence: 0.65,
    chunkAttentionWeights: [0.65, 0.55, 0.7],
    biasFeatures: { hedges: 1, intensifiers: 1, negations: 0, punctuation: 2, uppercaseRatio: 0.01, quotationUsage: 1 },
  },
  {
    id: 9,
    text: "Economy adds 250,000 jobs in strong monthly report beating expectations",
    source: "Bloomberg",
    domain: "headline",
    predictedLean: "Center",
    predictedIntensity: "Neutral",
    leanConfidence: 0.85,
    intensityConfidence: 0.89,
    chunkAttentionWeights: [0.48],
    biasFeatures: { hedges: 0, intensifiers: 1, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 10,
    text: "Conservative commentators rally against so-called woke corporate policies destroying American values",
    source: "Daily Wire",
    domain: "headline",
    predictedLean: "Right",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.93,
    intensityConfidence: 0.91,
    chunkAttentionWeights: [0.95],
    biasFeatures: { hedges: 0, intensifiers: 4, negations: 0, punctuation: 0, uppercaseRatio: 0.04, quotationUsage: 1 },
  },
  {
    id: 11,
    text: "Trade negotiations continue between major powers. Diplomats from both sides have expressed cautious optimism about reaching a deal before year-end. Key sticking points include agricultural subsidies and technology transfer restrictions. Markets have responded positively to reports of progress, with futures indicating modest gains.",
    source: "Financial Times",
    domain: "article",
    predictedLean: "Center",
    predictedIntensity: "Neutral",
    leanConfidence: 0.88,
    intensityConfidence: 0.92,
    chunkAttentionWeights: [0.5, 0.47, 0.53],
    biasFeatures: { hedges: 2, intensifiers: 0, negations: 0, punctuation: 1, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 12,
    text: "Workers demand living wage as corporate profits soar to record heights",
    source: "HuffPost",
    domain: "headline",
    predictedLean: "Left",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.86,
    intensityConfidence: 0.79,
    chunkAttentionWeights: [0.87],
    biasFeatures: { hedges: 0, intensifiers: 2, negations: 0, punctuation: 0, uppercaseRatio: 0.02, quotationUsage: 0 },
  },
  {
    id: 13,
    text: "Supreme Court ruling may reshape voting rights landscape",
    source: "NPR",
    domain: "headline",
    predictedLean: "Left-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.73,
    intensityConfidence: 0.68,
    chunkAttentionWeights: [0.71],
    biasFeatures: { hedges: 1, intensifiers: 0, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 14,
    text: "Defense spending bill clears committee amid fierce partisan disagreement. The proposed budget represents an increase over last year with additional allocations for cybersecurity and space operations. Opposition members criticized the lack of funding for domestic programs. Committee chair stated the bill reflects current threat assessments.",
    source: "Washington Post",
    domain: "article",
    predictedLean: "Left-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.74,
    intensityConfidence: 0.71,
    chunkAttentionWeights: [0.68, 0.52, 0.64],
    biasFeatures: { hedges: 0, intensifiers: 1, negations: 1, punctuation: 2, uppercaseRatio: 0.01, quotationUsage: 1 },
  },
  {
    id: 15,
    text: "Tech companies resist government overreach in new data privacy regulation",
    source: "Wall Street Journal",
    domain: "headline",
    predictedLean: "Right-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.78,
    intensityConfidence: 0.72,
    chunkAttentionWeights: [0.74],
    biasFeatures: { hedges: 0, intensifiers: 1, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 16,
    text: "Gun control advocates may be overreacting to recent policy changes according to analysts",
    source: "The Hill",
    domain: "headline",
    predictedLean: "Right-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.75,
    intensityConfidence: 0.66,
    chunkAttentionWeights: [0.69],
    biasFeatures: { hedges: 2, intensifiers: 1, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 17,
    text: "Education reform gains momentum as states adopt new standards. Early results from pilot programs show improvements in reading comprehension and mathematical reasoning among students. Teachers unions have raised concerns about implementation timelines and adequate training resources. Federal funding for the initiative is expected to be debated next quarter.",
    source: "The Atlantic",
    domain: "article",
    predictedLean: "Left-center",
    predictedIntensity: "Slightly Biased",
    leanConfidence: 0.7,
    intensityConfidence: 0.63,
    chunkAttentionWeights: [0.6, 0.48, 0.57],
    biasFeatures: { hedges: 1, intensifiers: 0, negations: 0, punctuation: 1, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 18,
    text: "Patriotic Americans push back against attempts to rewrite national history in schools",
    source: "New York Post",
    domain: "headline",
    predictedLean: "Right",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.9,
    intensityConfidence: 0.84,
    chunkAttentionWeights: [0.91],
    biasFeatures: { hedges: 0, intensifiers: 2, negations: 0, punctuation: 0, uppercaseRatio: 0.03, quotationUsage: 0 },
  },
  {
    id: 19,
    text: "Federal Reserve signals potential rate changes. Markets responded with mixed signals as investors weighed the implications of the central bank's latest communication. Bond yields shifted modestly while equity markets remained relatively stable. Economists noted the language was carefully measured to avoid triggering volatility.",
    source: "CNBC",
    domain: "article",
    predictedLean: "Center",
    predictedIntensity: "Neutral",
    leanConfidence: 0.9,
    intensityConfidence: 0.93,
    chunkAttentionWeights: [0.52, 0.49, 0.5],
    biasFeatures: { hedges: 2, intensifiers: 0, negations: 0, punctuation: 1, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
  {
    id: 20,
    text: "Community organizers fight for environmental justice in underserved neighborhoods left behind by policymakers",
    source: "The Nation",
    domain: "headline",
    predictedLean: "Left",
    predictedIntensity: "Highly Biased",
    leanConfidence: 0.88,
    intensityConfidence: 0.81,
    chunkAttentionWeights: [0.86],
    biasFeatures: { hedges: 0, intensifiers: 2, negations: 0, punctuation: 0, uppercaseRatio: 0.01, quotationUsage: 0 },
  },
];
