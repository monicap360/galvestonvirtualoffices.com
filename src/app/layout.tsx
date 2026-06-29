import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Galveston Virtual Offices — Business Support Built for Women",
    template: "%s · Galveston Virtual Offices",
  },
  description:
    "The AI-powered business hub built for women entrepreneurs on the Texas Gulf Coast: dedicated virtual assistants, AI agents, a real Galveston address, virtual mailbox, offices, and marketing. Sign up online; pay by business check to keep every account verified.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
