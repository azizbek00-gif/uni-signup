import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateSpeech, pcmToWav } from "@/lib/gemini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { text } = (await req.json()) as { text?: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const pcm = await generateSpeech(text.trim().slice(0, 3000));
    const wavBuffer = pcmToWav(pcm);
    return new NextResponse(new Uint8Array(wavBuffer), {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("AI speech error:", err);
    return NextResponse.json({ error: "ai_failed" }, { status: 502 });
  }
}
