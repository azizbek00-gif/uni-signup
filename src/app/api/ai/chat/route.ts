import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { askAssistant } from "@/lib/gemini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { topic, message, history } = body as {
    topic: string;
    message: string;
    history?: { role: "user" | "model"; text: string }[];
  };

  if (!topic || !message?.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const text = await askAssistant({ topic, message: message.trim(), history: history ?? [] });
    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({ error: "ai_failed" }, { status: 502 });
  }
}
