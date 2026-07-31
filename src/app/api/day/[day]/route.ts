import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildPlan } from "@/lib/curriculum";
import { generateLessonText, generateQuiz } from "@/lib/gemini";

export async function GET(req: Request, { params }: { params: Promise<{ day: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const day = Number((await params).day);
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return NextResponse.json({ error: "invalid_day" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (day > user.lastDay) {
    return NextResponse.json({ error: "locked" }, { status: 403 });
  }

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang") || "uz";

  const existing = await prisma.dayContent.findUnique({ where: { userId_day: { userId: user.id, day } } });
  if (existing) {
    return NextResponse.json({
      day,
      subject: existing.subject,
      topic: existing.topic,
      lessonText: existing.lessonText,
      quiz: (existing.quiz as { question: string; options: string[] }[]).map((q) => ({
        question: q.question,
        options: q.options,
      })),
      score: existing.score,
      completed: !!existing.completedAt,
    });
  }

  const plan = buildPlan(user.direction);
  const item = plan[day - 1];

  const [lessonText, quiz] = await Promise.all([
    generateLessonText({ subject: item.subject, topic: item.topic, lang }),
    generateQuiz({ subject: item.subject, topic: item.topic, lang }),
  ]);

  await prisma.dayContent.create({
    data: {
      userId: user.id,
      day,
      subject: item.subject,
      topic: item.topic,
      lessonText,
      quiz,
    },
  });

  return NextResponse.json({
    day,
    subject: item.subject,
    topic: item.topic,
    lessonText,
    quiz: quiz.map((q) => ({ question: q.question, options: q.options })),
    score: null,
    completed: false,
  });
}
