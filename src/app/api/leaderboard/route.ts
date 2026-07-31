import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const me = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!me) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const [global, sameUni, aheadCount] = await Promise.all([
    prisma.user.findMany({
      where: { onboarded: true },
      orderBy: { points: "desc" },
      take: 10,
      select: { id: true, firstName: true, points: true, streak: true },
    }),
    me.universityName
      ? prisma.user.findMany({
          where: { onboarded: true, universityName: me.universityName },
          orderBy: { points: "desc" },
          take: 10,
          select: { id: true, firstName: true, points: true, streak: true },
        })
      : Promise.resolve([]),
    prisma.user.count({ where: { onboarded: true, points: { gt: me.points } } }),
  ]);

  return NextResponse.json({
    global,
    sameUni,
    myRank: aheadCount + 1,
    myId: me.id,
  });
}
