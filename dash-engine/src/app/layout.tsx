import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "D.A.S.H. - Dynamic Arcade Speaking Hub",
  description: "Zero-prep classroom party game & speaking arena for 100-inch projectors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-screen w-screen overflow-hidden select-none`}>
      <body className="h-screen w-screen overflow-hidden select-none bg-[#1A103C] text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
