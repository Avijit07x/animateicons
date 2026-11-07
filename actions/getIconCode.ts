"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";

const ROOT = process.cwd();
const ICONS_BASE_DIR = path.join(ROOT, "icons");

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

	if (!VALID_ICON_NAMES.has(safeName)) {
		console.warn("[getIconCode] unknown icon name", { iconName, safeName });
		return null;
	}

	try {
		const filePath = path.join(ICONS_BASE_DIR, library, `${safeName}-icon.tsx`);
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
