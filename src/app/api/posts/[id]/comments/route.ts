import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id: postId } = await params;
  const { text } = (await req.json()) as { text?: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { postId, authorId: session.user.id, text: text.trim().slice(0, 300) },
  });

  return NextResponse.json({ id: comment.id });
}
