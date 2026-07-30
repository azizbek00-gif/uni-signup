import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { SessionProvider } from "@/lib/session";
import Background from "@/components/Background";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UniStep — O'zbekiston abituriyentlari uchun DTM tayyorgarlik",
  description:
    "UniStep — DTM imtihoniga tayyorgarlik va motivatsion platforma. Ro'yxatdan o'ting, 31 kunlik darslikni boshlang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body
        style={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <NextAuthSessionProvider>
          <SessionProvider>
            <Background />
            {children}
          </SessionProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
