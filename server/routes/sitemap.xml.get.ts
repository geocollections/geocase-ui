const pages = [
  "",
  "/search",
  "/about",
  "/access",
  "/tutorial",
  "/efg",
  "/partners_and_providers",
  "/help",
  "/links",
];
export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  const urls = ["", "/ee", "/de"].flatMap((locale) =>
    pages.map(
      (page) =>
        `<url><loc>https://geocase.eu${locale}${page || "/"}</loc></url>`,
    ),
  );
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
});
