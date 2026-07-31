import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}
function isYesterday(prev: Date, now: Date) {
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  return isSameDay(prev, y);
}

export async function POST(req: Request, { params }: { params: Promise<{ day: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const day = Number((await params).day);
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    return NextResponse.json({ error: "invalid_day" }, { status: 400 });
  }

  const { answers } = (await req.json()) as { answers: number[] };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (day > user.lastDay) return NextResponse.json({ error: "locked" }, { status: 403 });

  const content = await prisma.dayContent.findUnique({ where: { userId_day: { userId: user.id, day } } });
  if (!content) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const quiz = content.quiz as { correctIndex: number }[];
  const total = quiz.length || 1;
  const correct = quiz.reduce((acc, q, i) => acc + (answers?.[i] === q.correctIndex ? 1 : 0), 0);
  const scorePct = Math.round((correct / total) * 100);
  const earnedPoints = correct * 10;

  const now = new Date();
  const wasAlreadyCompleted = !!content.completedAt;

  await prisma.dayContent.update({
    where: { id: content.id },
    data: { score: scorePct, completedAt: content.completedAt ?? now },
  });

  let newStreak = user.streak;
  let newLastDay = user.lastDay;
  let newPoints = user.points;

  if (!wasAlreadyCompleted) {
    newPoints += earnedPoints;

    if (day === user.lastDay) {
      newLastDay = Math.min(31, user.lastDay + 1);

      if (!user.lastActiveAt) newStreak = 1;
      else if (isSameDay(user.lastActiveAt, now)) newStreak = user.streak || 1;
      else if (isYesterday(user.lastActiveAt, now)) newStreak = user.streak + 1;
      else newStreak = 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { points: newPoints, lastDay: newLastDay, streak: newStreak, lastActiveAt: now },
    });
  }

  return NextResponse.json({
    correct,
    total,
    scorePct,
    earnedPoints: wasAlreadyCompleted ? 0 : earnedPoints,
    unlockedNextDay: !wasAlreadyCompleted && newLastDay > user.lastDay,
    streak: newStreak,
    points: newPoints,
  });
}
