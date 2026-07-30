import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.firstName || !user?.universityName || !user?.direction) {
    return NextResponse.json({ error: "onboarding_incomplete" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboarded: true, lastActiveAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
