import type { MetadataRoute } from "next";
import { getSiteSettings } from "../lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSettings();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en", "/fr"],
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${site.seo.siteUrl}/sitemap.xml`,
    host: site.seo.siteUrl,
  };
}
