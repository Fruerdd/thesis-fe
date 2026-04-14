# Bias Detector - NLP News Bias Detection

A presentation website showcasing a hierarchical multi-task BERT model for detecting political bias in news articles. Developed by Pavel Kuznetsov at Sarajevo School of Science and Technology.

---

## Technologies Used

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16 | React framework with App Router for server-side rendering, routing, and optimized builds |
| **React** | 19 | UI component library with hooks for state management |
| **TypeScript** | 5.x | Static type checking for improved code quality and developer experience |

### Styling & Design
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS v4** | Utility-first CSS framework with custom design tokens |
| **CSS Variables** | Custom theming via `globals.css` (dark theme with teal-cyan accent) |
| **shadcn/ui** | Pre-built accessible UI components built on Radix UI primitives |

### Data Visualization
| Technology | Purpose |
|------------|---------|
| **Recharts** | React charting library (via shadcn/ui chart wrapper) |
| Chart Types | BarChart, PieChart, ScatterChart, RadarChart with custom tooltips |

### Fonts
| Font | Usage |
|------|-------|
| **Inter** | Primary font for headings and body text |
| **JetBrains Mono** | Monospace font for data values and code elements |

### Build & Development
| Tool | Purpose |
|------|---------|
| **Turbopack** | Default bundler in Next.js 16 for fast HMR |
| **pnpm** | Package manager |
| **Vercel Analytics** | Performance monitoring (optional) |

---

## File Hierarchy

```
bias-detector/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts, header, metadata
│   ├── page.tsx                  # Home page (/)
│   ├── globals.css               # Global styles, Tailwind config, design tokens
│   └── dashboard/
│       └── page.tsx              # Dashboard page (/dashboard)
│
├── components/
│   ├── site-header.tsx           # Navigation header (Home/Dashboard links)
│   │
│   ├── home/                     # Home page sections
│   │   ├── hero-section.tsx      # Title, description, CTA buttons
│   │   ├── stats-section.tsx     # Key metrics cards (accuracy, predictions, etc.)
│   │   ├── how-it-works-section.tsx  # 4-step pipeline explanation
│   │   └── architecture-section.tsx  # Model architecture details
│   │
│   ├── dashboard/                # Dashboard components
│   │   ├── global-filters.tsx    # Domain, source, confidence filters
│   │   ├── lean-distribution-chart.tsx    # Political leaning bar chart
│   │   ├── intensity-distribution-chart.tsx # Bias intensity pie/bar chart
│   │   ├── confidence-scatter-chart.tsx   # Confidence vs attention scatter
│   │   ├── bias-feature-radar-chart.tsx   # Feature analysis radar chart
│   │   ├── domain-comparison-chart.tsx    # Headline vs Article comparison
│   │   └── prediction-table.tsx           # Sortable predictions table
│   │
│   └── ui/                       # shadcn/ui components (pre-installed)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── chart.tsx             # Recharts wrapper with theming
│       ├── select.tsx
│       ├── slider.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── ... (50+ components)
│
├── lib/
│   ├── data.ts                   # Mock prediction data (20 samples)
│   └── utils.ts                  # Utility functions (cn for classnames)
│
├── hooks/
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
│
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── components.json               # shadcn/ui configuration
```

---

## Application Logic

### Data Flow

```
lib/data.ts (Static Mock Data)
       │
       ▼
┌──────────────────────────────────────────────────────┐
│                    Dashboard Page                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Global Filters State                │ │
│  │  • selectedDomain: "all" | "headline" | "article"│ │
│  │  • selectedSource: "all" | specific source       │ │
│  │  • minConfidence: 0-100 (slider)                │ │
│  └─────────────────────────────────────────────────┘ │
│                         │                            │
│              Filtered Data Array                     │
│                         │                            │
│    ┌────────────────────┼────────────────────┐      │
│    ▼                    ▼                    ▼      │
│ ┌──────────┐      ┌──────────┐        ┌──────────┐ │
│ │  Chart 1 │      │  Chart 2 │   ...  │  Table   │ │
│ │ + Local  │      │ + Local  │        │ + Local  │ │
│ │  Filter  │      │  Filter  │        │  Filter  │ │
│ └──────────┘      └──────────┘        └──────────┘ │
└──────────────────────────────────────────────────────┘
```

### Global Filters (Apply to ALL Charts)

| Filter | Type | Description |
|--------|------|-------------|
| **Domain** | Select | Filter by prediction domain (Headline / Article / All) |
| **Source** | Select | Filter by news source (CNN, Fox News, BBC, etc.) |
| **Min Confidence** | Slider | Only show predictions above threshold (0-100%) |

### Per-Chart Filters (Chart-Specific)

| Chart | Local Filter | Options |
|-------|--------------|---------|
| **Lean Distribution** | Sort Order | By count / By political spectrum |
| **Intensity Distribution** | Chart Type | Pie chart / Bar chart |
| **Confidence Scatter** | Color By | Political lean / Bias intensity |
| **Bias Feature Radar** | Aggregation | Mean / Maximum values |
| **Domain Comparison** | Metric | Count / Average confidence |
| **Prediction Table** | Intensity Filter | All / Highly Biased / Slightly Biased / Neutral |

### State Management

All state is managed using React's `useState` hook at the component level:

```typescript
// Dashboard page - Global filter state
const [selectedDomain, setSelectedDomain] = useState<string>("all");
const [selectedSource, setSelectedSource] = useState<string>("all");
const [minConfidence, setMinConfidence] = useState<number>(0);

// Filtered data computation
const filteredData = predictions.filter((p) => {
  const domainMatch = selectedDomain === "all" || p.domain === selectedDomain;
  const sourceMatch = selectedSource === "all" || p.source === selectedSource;
  const confidenceMatch = p.confidence >= minConfidence / 100;
  return domainMatch && sourceMatch && confidenceMatch;
});
```

---

## Data Model

### Prediction Object Structure

```typescript
interface Prediction {
  id: number;
  text: string;                    // News headline or article snippet
  domain: "headline" | "article";  // Content type
  source: string;                  // News outlet name
  
  // Political Leaning Prediction
  lean: "Left" | "Left-center" | "Center" | "Right-center" | "Right";
  leanConfidence: number;          // 0-1 probability
  
  // Bias Intensity Prediction
  intensity: "Neutral" | "Slightly Biased" | "Highly Biased";
  intensityConfidence: number;     // 0-1 probability
  
  // Overall confidence (max of lean/intensity)
  confidence: number;              // 0-1
  
  // Chunk-level attention weights (interpretability)
  chunkAttention: number[];        // Array of attention scores per chunk
}
```

### Sample Data Sources

The mock data includes predictions from various news outlets:
- **Left-leaning**: CNN, MSNBC, The Guardian, NPR
- **Center**: Reuters, AP News, BBC
- **Right-leaning**: Fox News, Breitbart, The Daily Wire

---

## Color Scheme

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | Dark blue-gray | Page background |
| `--card` | Slightly lighter | Card backgrounds |
| `--primary` | Teal/Cyan | Accent color, buttons, links |
| `--muted` | Medium gray | Secondary backgrounds |
| `--foreground` | Off-white | Primary text |
| `--muted-foreground` | Gray | Secondary text |
| `--border` | Dark gray | Borders and dividers |

### Chart Colors (Political Spectrum)

```typescript
const LEAN_COLORS = {
  "Left": "#3b82f6",        // Blue
  "Left-center": "#06b6d4", // Cyan
  "Center": "#a855f7",      // Purple
  "Right-center": "#f97316",// Orange
  "Right": "#ef4444",       // Red
};

const INTENSITY_COLORS = {
  "Neutral": "#22c55e",        // Green
  "Slightly Biased": "#eab308",// Yellow
  "Highly Biased": "#ef4444",  // Red
};
```

---

## Running the Project

### Development

```bash
# Install dependencies
pnpm install

# Start dev server (Turbopack)
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Create optimized build
pnpm build

# Start production server
pnpm start
```

---

## Extending the Project

### Adding Real Data

Replace the mock data in `lib/data.ts` with an API call:

```typescript
// Option 1: Server Component fetch
async function getPredictions() {
  const res = await fetch('https://your-api.com/predictions');
  return res.json();
}

// Option 2: Client-side with SWR
import useSWR from 'swr';
const { data, error } = useSWR('/api/predictions', fetcher);
```

### Adding New Charts

1. Create component in `components/dashboard/`
2. Import and use Recharts components
3. Accept `data` prop (filtered predictions array)
4. Add local filter state if needed
5. Include in dashboard page grid

---

## License

Academic project - Sarajevo School of Science and Technology, 2025/2026
