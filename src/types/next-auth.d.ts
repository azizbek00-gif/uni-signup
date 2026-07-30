import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      age: number | null;
      regionId: string | null;
      universityName: string | null;
      direction: string | null;
      onboarded: boolean;
      streak: number;
      points: number;
      lastDay: number;
    } & DefaultSession["user"];
  }
}
