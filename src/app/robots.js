import { SITE_URL } from "@/constants/site";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
