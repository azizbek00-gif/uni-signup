import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { goal } = (await req.json()) as { goal?: string };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { goal: (goal ?? "").trim().slice(0, 120) || null },
  });

  return NextResponse.json({ ok: true });
}
