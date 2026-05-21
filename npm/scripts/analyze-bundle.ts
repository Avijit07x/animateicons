/**
 * Bundle analysis script for @animateicons/react.
 *
 * Run after `tsup` to measure per-icon gzip sizes using esbuild's metafile
 * API, compare against a persisted history, and fail CI when budgets are
 * exceeded. Outputs size-history.json next to this script so the file
 * travels with the package source.
 *
 * Usage:
 *   npx tsx scripts/analyze-bundle.ts            # full report, update history
 *   npx tsx scripts/analyze-bundle.ts --ci       # exit 1 on budget breach
 *   npx tsx scripts/analyze-bundle.ts --pr-comment  # emit GitHub Actions output
 */

import { readFile, readdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import zlib from "node:zlib";
import { promisify } from "node:util";

const gzip = promisify(zlib.gzip);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..");
const DIST = path.join(PKG_ROOT, "dist");
const HISTORY_FILE = path.join(__dirname, "size-history.json");

// Icons live in the monorepo root, not in npm/src.
const ICONS_DIRS: Record<string, string> = {
  lucide: path.join(REPO_ROOT, "icons", "lucide"),
  huge: path.join(REPO_ROOT, "icons", "huge"),
};

// ---------------------------------------------------------------------------
// Budget table — mirrors the size-limit config in package.json.
// Enforced on gzip to match what browsers actually receive.
// ---------------------------------------------------------------------------

const BUDGETS: Record<string, number> = {
  "lucide (full barrel)": 55 * 1024,
  "huge (full barrel)": 40 * 1024,
  // Warn threshold for a single tree-shaken icon. Size-limit hard gate is
  // 50 kB; 8 kB here catches creep early before the hard gate fires.
  "per-icon warn": 8 * 1024,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IconEntry {
  name: string;       // e.g. "BellRingIcon"
  library: string;    // "lucide" | "huge"
  gzipBytes: number;
  rawBytes: number;
  // Bytes of input modules pulled in after tree-shaking (from esbuild metafile).
  // Lower = better tree-shaking. Helps distinguish "icon is big" vs "icon pulls
  // in a large shared chunk that can't be eliminated".
  inputBytes: number;
}

interface BarrelEntry {
  name: string;
  library: string;
  gzipBytes: number;
  rawBytes: number;
  budget: number;
  pass: boolean;
}

interface HistoryRecord {
  version: string;
  timestamp: string;
  barrels: BarrelEntry[];
  icons: Record<string, IconEntry>;
}

interface SizeHistory {
  [version: string]: HistoryRecord;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fileGzipSize(filePath: string): Promise<{ raw: number; gz: number }> {
  const buf = await readFile(filePath);
  const compressed = await gzip(buf, { level: 9 });
  return { raw: buf.byteLength, gz: compressed.byteLength };
}

/**
 * Measure the tree-shaken size of a single named export from a pre-built
 * barrel using esbuild. Reports the real cost a consumer pays for
 * `import { BellRingIcon } from "@animateicons/react/lucide"`.
 */
async function measureTreeShakenIcon(
  barrelDistPath: string,
  exportName: string
): Promise<{ raw: number; gz: number; inputBytes: number }> {
  // Dynamic import — esbuild is a transitive dep of tsup, not a direct dep.
  const { build } = await import("esbuild");

  const result = await build({
    stdin: {
      contents: `export { ${exportName} } from ${JSON.stringify(barrelDistPath)};`,
      resolveDir: PKG_ROOT,
      loader: "ts",
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    external: ["react", "react-dom", "react/jsx-runtime"],
    metafile: true,
    minify: true,
    treeShaking: true,
  });

  const outputBytes = result.outputFiles[0]?.contents ?? new Uint8Array();
  const buf = Buffer.from(outputBytes);
  const compressed = await gzip(buf, { level: 9 });

  // Sum bytes of every input module that survived tree-shaking.
  // This is the "why is it this size" signal: large inputBytes relative to
  // output means a shared chunk (e.g. motion internals) was pulled in.
  const inputBytes = Object.values(result.metafile.inputs).reduce(
    (sum, m) => sum + m.bytes,
    0
  );

  return { raw: buf.byteLength, gz: compressed.byteLength, inputBytes };
}

/** Discover all *-icon.tsx files and extract their exported component name. */
async function discoverIcons(
  library: string
): Promise<Array<{ name: string; library: string }>> {
  const dir = ICONS_DIRS[library];
  let entries: string[];

  try {
    entries = await readdir(dir);
  } catch {
    console.warn(`⚠  icons/${library} directory not found — skipping.`);
    return [];
  }

  const results: Array<{ name: string; library: string }> = [];
  for (const entry of entries) {
    if (!entry.endsWith("-icon.tsx")) continue;
    const src = await readFile(path.join(dir, entry), "utf8");
    const match = src.match(/(?:const|function)\s+([A-Z][A-Za-z0-9]*Icon)\s*[=(:<]/m);
    if (match?.[1]) {
      results.push({ name: match[1], library });
    }
  }
  return results;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(2)} kB`;
}

function diffLabel(prev: number, curr: number): string {
  if (prev === 0) return "new";
  const delta = curr - prev;
  const pct = ((delta / prev) * 100).toFixed(1);
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${formatBytes(delta)} (${sign}${pct}%)`;
}

async function loadHistory(): Promise<SizeHistory> {
  try {
    const raw = await readFile(HISTORY_FILE, "utf8");
    return JSON.parse(raw) as SizeHistory;
  } catch {
    return {};
  }
}

async function saveHistory(history: SizeHistory): Promise<void> {
  await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2) + "\n");
}

function getPkgVersion(): string {
  const req = createRequire(import.meta.url);
  const pkg = req(path.join(PKG_ROOT, "package.json")) as { version: string };
  return pkg.version;
}

/** Find the most recent history record before the current version. */
function findPreviousRecord(
  history: SizeHistory,
  currentVersion: string
): HistoryRecord | undefined {
  const versions = Object.keys(history)
    .filter((v) => v !== currentVersion)
    .sort((a, b) => {
      const pa = a.split(".").map(Number);
      const pb = b.split(".").map(Number);
      for (let i = 0; i < 3; i++) {
        if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pb[i] ?? 0) - (pa[i] ?? 0);
      }
      return 0;
    });
  return versions[0] ? history[versions[0]] : undefined;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const isCI = args.includes("--ci");
  const prComment = args.includes("--pr-comment");

  console.log("📦  @animateicons/react — bundle analysis\n");

  // 1. Measure barrel files --------------------------------------------------
  const barrels: BarrelEntry[] = [];
  for (const [library, budget] of [
    ["lucide", BUDGETS["lucide (full barrel)"]],
    ["huge", BUDGETS["huge (full barrel)"]],
  ] as Array<[string, number]>) {
    const distPath = path.join(DIST, `${library}.js`);
    try {
      const { raw, gz } = await fileGzipSize(distPath);
      barrels.push({
        name: `${library} (full barrel)`,
        library,
        gzipBytes: gz,
        rawBytes: raw,
        budget,
        pass: gz <= budget,
      });
    } catch {
      console.error(`✗  dist/${library}.js not found — did you run the build?`);
      if (isCI) process.exit(1);
    }
  }

  // 2. Per-icon tree-shaken measurement --------------------------------------
  const icons: Record<string, IconEntry> = {};
  let overBudgetIcons = 0;

  for (const library of ["lucide", "huge"] as const) {
    const barrelPath = path.join(DIST, `${library}.js`);
    const iconList = await discoverIcons(library);

    if (iconList.length === 0) {
      console.warn(`  No icons found for ${library} — skipping per-icon analysis.`);
      continue;
    }

    console.log(`  Measuring ${iconList.length} ${library} icons…`);

    const CONCURRENCY = 8;
    for (let i = 0; i < iconList.length; i += CONCURRENCY) {
      const batch = iconList.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(async ({ name }) => {
          const { raw, gz, inputBytes } = await measureTreeShakenIcon(barrelPath, name);
          return { name, library, gzipBytes: gz, rawBytes: raw, inputBytes };
        })
      );
      for (const r of results) {
        if (r.status === "fulfilled") {
          const { name, gzipBytes, rawBytes, inputBytes } = r.value;
          icons[name] = { name, library, gzipBytes, rawBytes, inputBytes };
          if (gzipBytes > BUDGETS["per-icon warn"]) overBudgetIcons++;
        } else {
          console.warn(`  ⚠  Measurement failed: ${String(r.reason)}`);
        }
      }
    }
  }

  // 3. Load history & build current record -----------------------------------
  const history = await loadHistory();
  const version = getPkgVersion();
  const prev = findPreviousRecord(history, version);

  const record: HistoryRecord = {
    version,
    timestamp: new Date().toISOString(),
    barrels,
    icons,
  };

  // 4. Print barrel table ----------------------------------------------------
  console.log("\n┌─ Barrel sizes ──────────────────────────────────────────────────┐");
  for (const b of barrels) {
    const status = b.pass ? "✓" : "✗";
    const prevGz = prev?.barrels.find((x) => x.name === b.name)?.gzipBytes ?? 0;
    const diff = prev ? `  ${diffLabel(prevGz, b.gzipBytes)}` : "";
    console.log(
      `│ ${status} ${b.name.padEnd(30)} ${formatBytes(b.gzipBytes).padStart(9)} gzip   limit ${formatBytes(b.budget)}${diff}`
    );
  }
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  // 5. Print top-heavy icons -------------------------------------------------
  const sortedIcons = Object.values(icons).sort((a, b) => b.gzipBytes - a.gzipBytes);
  const top = sortedIcons.slice(0, 10);

  if (top.length > 0) {
    console.log("Top 10 heaviest icons (tree-shaken, gzip):");
    console.log(`  ${"lib".padEnd(6)}  ${"icon".padEnd(32)} ${"output".padStart(9)}   ${"input".padStart(9)}   Δ`);
    for (const icon of top) {
      const flag = icon.gzipBytes > BUDGETS["per-icon warn"] ? " ⚠" : "";
      const prevGz = prev?.icons[icon.name]?.gzipBytes ?? 0;
      const diff = prev ? `  ${diffLabel(prevGz, icon.gzipBytes)}` : "";
      console.log(
        `  ${icon.library.padEnd(6)}  ${icon.name.padEnd(32)} ${formatBytes(icon.gzipBytes).padStart(9)} gz  ${formatBytes(icon.inputBytes).padStart(9)} in${flag}${diff}`
      );
    }
    console.log();
  }

  // 6. Emit GitHub Actions PR comment payload --------------------------------
  if (prComment) {
    await emitGitHubOutput(barrels, sortedIcons, prev, version);
  }

  // 7. Persist history -------------------------------------------------------
  history[version] = record;
  await saveHistory(history);
  console.log(`✔  Size history updated → scripts/size-history.json  (v${version})\n`);

  // 8. CI gate ---------------------------------------------------------------
  const barrelFailures = barrels.filter((b) => !b.pass);
  if (isCI && barrelFailures.length > 0) {
    console.error("✗  Bundle budget exceeded:");
    for (const b of barrelFailures) {
      console.error(
        `     ${b.name}: ${formatBytes(b.gzipBytes)} > limit ${formatBytes(b.budget)}`
      );
    }
    process.exit(1);
  }

  if (overBudgetIcons > 0) {
    console.warn(
      `⚠  ${overBudgetIcons} icon(s) exceed the per-icon warn threshold of ${formatBytes(BUDGETS["per-icon warn"])} gzip.`
    );
    console.warn("   Consider splitting animation variants or reducing motion keyframes.\n");
  }
}

// ---------------------------------------------------------------------------
// GitHub Actions output helper
// ---------------------------------------------------------------------------

async function emitGitHubOutput(
  barrels: BarrelEntry[],
  sortedIcons: IconEntry[],
  prev: HistoryRecord | undefined,
  version: string
): Promise<void> {
  const rows: string[] = [];

  rows.push("## Bundle Size Report\n");
  rows.push(`**Version:** \`${version}\`\n`);
  rows.push("### Barrels\n");
  rows.push("| Entry | Size (gzip) | Budget | Status | Δ vs previous |");
  rows.push("|-------|-------------|--------|--------|----------------|");

  for (const b of barrels) {
    const status = b.pass ? "✅ pass" : "❌ over budget";
    const prevGz = prev?.barrels.find((x) => x.name === b.name)?.gzipBytes ?? 0;
    const diff = prev ? diffLabel(prevGz, b.gzipBytes) : "—";
    rows.push(
      `| \`${b.name}\` | ${formatBytes(b.gzipBytes)} | ${formatBytes(b.budget)} | ${status} | ${diff} |`
    );
  }

  const top20 = sortedIcons.slice(0, 20);
  if (top20.length > 0) {
    rows.push("\n### Top 20 Heaviest Icons (tree-shaken, gzip)\n");
    rows.push("| Icon | Library | Output (gzip) | Input (pre-minify) | Δ vs previous |");
    rows.push("|------|---------|---------------|--------------------|----------------|");
    for (const icon of top20) {
      const prevGz = prev?.icons[icon.name]?.gzipBytes ?? 0;
      const diff = prev ? diffLabel(prevGz, icon.gzipBytes) : "—";
      const flag = icon.gzipBytes > BUDGETS["per-icon warn"] ? " ⚠️" : "";
      rows.push(
        `| \`${icon.name}\`${flag} | ${icon.library} | ${formatBytes(icon.gzipBytes)} | ${formatBytes(icon.inputBytes)} | ${diff} |`
      );
    }
  }

  const body = rows.join("\n");

  if (process.env.GITHUB_OUTPUT) {
    // Multi-line output format required by GitHub Actions.
    const delimiter = `EOF_${Date.now()}`;
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `pr_comment_body<<${delimiter}\n${body}\n${delimiter}\n`
    );
  } else {
    console.log("\n--- PR comment preview ---\n");
    console.log(body);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
