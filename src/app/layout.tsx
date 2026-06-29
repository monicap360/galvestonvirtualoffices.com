import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://galvestonvirtualoffices.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Galveston Virtual Offices — Virtual Office, Mailbox & AI Business Support | Galveston & Houston, TX",
    template: "%s · Galveston Virtual Offices",
  },
  description:
    "The AI-powered business hub for Galveston & Houston, TX: virtual office address, virtual mailbox with package pickup, managed virtual assistants, AI agents, offices, and marketing. Sign up online; pay by business check.",
  keywords: [
    "virtual office Galveston",
    "virtual office Houston",
    "virtual mailbox Galveston TX",
    "business address Galveston",
    "registered agent Texas",
    "virtual assistant Galveston",
    "virtual assistant Houston",
    "AI receptionist Houston",
    "coworking Galveston",
    "women business support Galveston",
    "AI assistant for small business Texas",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Galveston Virtual Offices",
    title: "Galveston Virtual Offices — Virtual Office, Mailbox & AI Business Support",
    description:
      "Virtual office, mailbox, managed virtual assistants, and AI agents for businesses across Galveston & Houston, TX.",
    images: [{ url: "/galveston-hero.jpg", width: 2000, height: 1333, alt: "Galveston Virtual Offices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galveston Virtual Offices — Virtual Office, Mailbox & AI Business Support",
    description: "Virtual office, mailbox, VAs, and AI agents for Galveston & Houston, TX.",
    images: ["/galveston-hero.jpg"],
  },
};

// LocalBusiness structured data → Google rich results + local map pack.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Galveston Virtual Offices",
  description:
    "Virtual office address, virtual mailbox, managed virtual assistants, AI agents, offices, and marketing for businesses in Galveston and Houston, Texas.",
  url: SITE_URL,
  image: `${SITE_URL}/galveston-hero.jpg`,
  telephone: "+1-409-402-7908",
  priceRange: "$$",
  foundingDate: "2019",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3501 Winnie St",
    addressLocality: "Galveston",
    addressRegion: "TX",
    postalCode: "77550",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 29.2992, longitude: -94.8068 },
  areaServed: [
    "Galveston, TX", "Houston, TX", "League City, TX", "Texas City, TX",
    "Friendswood, TX", "Pearland, TX", "Dickinson, TX", "La Marque, TX",
  ].map((name) => ({ "@type": "City", name })),
  serviceType: [
    "Virtual office", "Virtual mailbox", "Business address", "Registered agent",
    "Managed virtual assistant", "AI assistant", "AI receptionist", "Coworking office", "Local marketing",
  ],
  openingHours: "Mo-Fr 09:00-17:00",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
