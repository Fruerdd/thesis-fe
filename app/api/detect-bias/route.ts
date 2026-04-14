import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  console.log("[detect-bias] payload from UI:", payload);

  const apiUrl = process.env.MODEL_API_URL ?? "http://127.0.0.1:8000";

  const forwardBody = {
    source: payload.source,
    link_or_text: payload.linkOrText ?? payload.link_or_text ?? payload.url ?? payload.text ?? "",
    threshold: payload.threshold ?? 0.5,
  };

  console.log("[detect-bias] forwarding to backend:", forwardBody);

  const r = await fetch(`${apiUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(forwardBody),
  });

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}