import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = (process.env.SITE_URL || "https://www.viveretropea.it").replace(/\/$/, "");
const API_URL = (process.env.SITEMAP_API_URL || "https://antispreco-app-2.onrender.com/api").replace(/\/$/, "");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sitemapPath = path.join(projectRoot, "public", "sitemap.xml");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slugify(text) {
  return (text || "evento")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "evento";
}

function buildUrl(loc, changefreq, priority) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function fetchEvents() {
  const response = await fetch(`${API_URL}/annunci`);
  if (!response.ok) {
    throw new Error(`Fetch eventi fallita: HTTP ${response.status}`);
  }

  const events = await response.json();
  if (!Array.isArray(events)) {
    throw new Error("Risposta API non valida: atteso array eventi");
  }

  return events;
}

async function generate() {
  const staticUrls = [
    buildUrl(`${SITE_URL}/`, "daily", "1.0"),
    buildUrl(`${SITE_URL}/eventi`, "hourly", "0.9"),
    buildUrl(`${SITE_URL}/nuovo-evento`, "weekly", "0.7"),
    buildUrl(`${SITE_URL}/presentazione`, "monthly", "0.5"),
    buildUrl(`${SITE_URL}/login`, "monthly", "0.4"),
    buildUrl(`${SITE_URL}/register`, "monthly", "0.4")
  ];

  const events = await fetchEvents();
  const eventUrls = events
    .filter((eventItem) => eventItem && eventItem._id)
    .map((eventItem) => {
      const eventPath = `/eventi/${eventItem._id}/${slugify(eventItem.titolo)}`;
      return buildUrl(`${SITE_URL}${eventPath}`, "daily", "0.8");
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...eventUrls].join("\n")}\n</urlset>\n`;

  await fs.writeFile(sitemapPath, xml, "utf8");
  console.log(`Sitemap aggiornata con ${eventUrls.length} URL evento: ${sitemapPath}`);
}

generate().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
