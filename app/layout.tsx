import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://majoolify.dev"),
  title: {
    default: "Majoolify | Next.js Engineering, Frontend Systems, and AI Prompt Design",
    template: "%s | Majoolify",
  },
  description:
    "Majoolify is Ahmed Majoul's independent software development agency from Tunisia, focused on Next.js product engineering, frontend systems, and AI prompt design.",
  openGraph: {
    title: "Majoolify",
    description:
      "Independent software development agency building sharp, high-conviction products with Next.js and AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Majoolify",
    description:
      "Next.js product engineering, frontend systems, and AI prompt design by Ahmed Majoul.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
