"use server";

/**
 * getIconCode
 *
 * Server action that returns the source of an AnimateIcons component
 * file (e.g. icons/lucide/bell-ring-icon.tsx). Powers the "Copy code"
 * button on every tile in the AnimateIcons gallery.
 *
 * Validation:
 *   - sanitize() blocks path traversal (alphanum + dash only) so the
 *     filename can't escape icons/lucide or icons/huge.
 *   - Belt-and-suspenders: require the icon to be in ICON_LIST. Even a
 *     hypothetical regex bug can't read arbitrary files because the
 *     name has to match an actual AnimateIcons entry.
 *
 * Errors:
 *   - All exceptions logged with context, never swallowed silently.
 *     Returns null on failure so the gallery's "Copy code" button can
 *     fall back gracefully without crashing the tile.
 *
 * Caching note: this version intentionally avoids `unstable_cache` /
 * `react.cache` because their behavior in Next 16 server actions is
 * unstable (the unstable_cache import path was the source of a runtime
 * "undefined.apply" crash on the AnimateIcons site). The client-side
 * `codeCache` Map in IconTileActions already handles per-tab dedupe;
 * revisit server-side caching once Next 16's `'use cache'` directive
 * stabilizes.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";

const ROOT = process.cwd();
const ICONS_BASE_DIR = path.join(ROOT, "icons");

/** O(1) lookup set of every legal icon name in either library. */
const VALID_ICON_NAMES: ReadonlySet<string> = new Set([
	...LUCIDE_ICON_LIST.map((i) => i.name),
	...HUGE_ICON_LIST.map((i) => i.name),
]);

const sanitize = (name: string): string =>
	name.replace(/[^a-z0-9-]/gi, "").toLowerCase();

const isLibrary = (v: string): v is IconLibrary =>
	v === "lucide" || v === "huge";

export async function getIconCode(
	iconName: string,
	library: IconLibrary,
): Promise<string | null> {
	if (!isLibrary(library)) {
		console.warn("[getIconCode] invalid library", { library });
		return null;
	}

	const safeName = sanitize(iconName);
	if (!safeName) return null;

	// Whitelist guard — only icons in ICON_LIST can ever be read.
	if (!VALID_ICON_NAMES.has(safeName)) {
		console.warn("[getIconCode] unknown icon name", { iconName, safeName });
		return null;
	}

	try {
		const filePath = path.join(
			ICONS_BASE_DIR,
			library,
			`${safeName}-icon.tsx`,
		);
		return await fs.readFile(filePath, "utf8");
	} catch (err) {
		console.error("[getIconCode] file read failed", {
			iconName,
			library,
			err: err instanceof Error ? err.message : String(err),
		});
		return null;
	}
}
