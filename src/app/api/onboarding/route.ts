import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName, age, regionId, uniName, dir } = body as {
    firstName: string;
    lastName: string;
    age: string;
    regionId: string;
    uniName: string;
    dir: string;
  };

  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 10 || ageNum > 99) {
    return NextResponse.json({ error: "invalid_age" }, { status: 400 });
  }
  if (!regionId || !uniName || !dir) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: ageNum,
      regionId,
      universityName: uniName,
      direction: dir,
    },
  });

  return NextResponse.json({ ok: true });
}
