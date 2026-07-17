const FALLBACK_SITE_URL = "http://localhost:3000";

/** URL pública usada por metadata, sitemap e robots. */
export const SITE_URL = (process.env.SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");
