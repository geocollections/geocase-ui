/** Store multiple exact sources as JSON internally and repeated URL parameters externally. */
export function parseSourceFilter(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) return [...new Set(parsed.filter(Boolean))];
  } catch { /* Single source URLs are not JSON. */ }
  return value ? [value] : [];
}
export function sourceFilterQueryValue(value: string): string | string[] {
  const urls = parseSourceFilter(value);
  return urls.length === 1 ? urls[0]! : urls;
}
export function quoteFilterValue(value: string): string {
  return `"${value.replace(/["\\]/g, "\\$&")}"`;
}
