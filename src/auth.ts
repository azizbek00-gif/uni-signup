import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user?.id) token.sub = user.id;
      if (user || trigger === "update") {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.age = dbUser.age;
          token.regionId = dbUser.regionId;
          token.universityName = dbUser.universityName;
          token.direction = dbUser.direction;
          token.onboarded = dbUser.onboarded;
          token.streak = dbUser.streak;
          token.points = dbUser.points;
          token.lastDay = dbUser.lastDay;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.firstName = (token.firstName as string | null) ?? null;
        session.user.lastName = (token.lastName as string | null) ?? null;
        session.user.age = (token.age as number | null) ?? null;
        session.user.regionId = (token.regionId as string | null) ?? null;
        session.user.universityName = (token.universityName as string | null) ?? null;
        session.user.direction = (token.direction as string | null) ?? null;
        session.user.onboarded = (token.onboarded as boolean) ?? false;
        session.user.streak = (token.streak as number) ?? 0;
        session.user.points = (token.points as number) ?? 0;
        session.user.lastDay = (token.lastDay as number) ?? 1;
      }
      return session;
    },
  },
});
