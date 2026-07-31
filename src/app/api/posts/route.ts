import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { firstName: true, lastName: true } } },
      },
    },
  });

  const shaped = posts.map((p) => ({
    id: p.id,
    text: p.text,
    createdAt: p.createdAt,
    author: p.author.firstName || "Talaba",
    likeCount: p.likes.length,
    liked: p.likes.some((l) => l.userId === session.user.id),
    comments: p.comments.map((c) => ({
      id: c.id,
      text: c.text,
      author: c.author.firstName || "Talaba",
    })),
  }));

  return NextResponse.json({ posts: shaped });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { text } = (await req.json()) as { text?: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { authorId: session.user.id, text: text.trim().slice(0, 500) },
  });

  return NextResponse.json({ id: post.id });
}
