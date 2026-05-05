import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { getSiteSettings } from "../lib/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "optional",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "optional",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const metadataBase = new URL(site.seo.siteUrl);
  const defaultOgImage = new URL(site.seo.defaultOgImage, metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: site.seo.defaultTitle,
      template: "%s | Majoolify",
    },
    description: site.seo.defaultDescription,
    keywords: site.seo.keywords,
    applicationName: site.brand.name,
    authors: [{ name: site.brand.founder }],
    creator: site.brand.founder,
    publisher: site.brand.legalName,
    openGraph: {
      type: "website",
      siteName: site.brand.name,
      title: site.seo.defaultTitle,
      description: site.seo.defaultDescription,
      images: [
        {
          url: defaultOgImage,
          alt: `${site.brand.name} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seo.defaultTitle,
      description: site.seo.defaultDescription,
      images: [defaultOgImage],
    },
  };
}

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
