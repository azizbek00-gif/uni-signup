import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    regionId: user.regionId,
    uniName: user.universityName,
    dir: user.direction,
    onboarded: user.onboarded,
    streak: user.streak,
    points: user.points,
    lastDay: user.lastDay,
  });
}
