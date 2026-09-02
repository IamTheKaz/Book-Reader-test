import { copyFileSync, cpSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const STATIC_DIR = join(ROOT, ".vercel/output/static");
const SERVER_ENTRY = join(ROOT, ".vercel/output/functions/__server.func/index.mjs");
const OUT_DIR = join(ROOT, "dist-gh-pages");

async function buildGhPages() {
  const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
  const basePath = repoName ? `/${repoName}/` : "/";
  const url = `http://localhost${basePath}`;
  console.log(`[gh-pages] Rendering static index.html from build server entry at ${url}...`);
  const server = await import(SERVER_ENTRY);
  const req = new Request(url, {
    headers: { accept: "text/html" },
  });
  const res = await server.default.fetch(req);
  if (!res.ok) {
    throw new Error(`Failed to render HTML: status ${res.status}`);
  }
  const html = await res.text();

  mkdirSync(OUT_DIR, { recursive: true });

  // Copy static assets
  cpSync(STATIC_DIR, OUT_DIR, { recursive: true });

  // Write index.html and 404.html (for SPA route fallbacks on GitHub Pages)
  writeFileSync(join(OUT_DIR, "index.html"), html, "utf-8");
  writeFileSync(join(OUT_DIR, "404.html"), html, "utf-8");

  // Prevent GitHub Pages from treating folders starting with _ (e.g. __grok) as Jekyll
  writeFileSync(join(OUT_DIR, ".nojekyll"), "", "utf-8");

  console.log(`[gh-pages] Static bundle successfully exported to ${OUT_DIR}`);
}

buildGhPages().catch((err) => {
  console.error("[gh-pages] Export failed:", err);
  process.exit(1);
});
