"use server";

import fs from "node:fs/promises";
import path from "node:path";

export type IconLibrary = "lucide" | "huge" | "fontawesome";

const ROOT = process.cwd();
const ICONS_BASE_DIR = path.join(ROOT, "icons");

function sanitize(name: string) {
	return name.replace(/[^a-z0-9-]/gi, "").toLowerCase();
}

export async function getIconCode(
	iconName: string,
	library: IconLibrary,
): Promise<string | null> {
	try {
		const safeName = sanitize(iconName);
		if (!safeName) return null;

		const filePath = path.join(ICONS_BASE_DIR, library, `${safeName}-icon.tsx`);

		return await fs.readFile(filePath, "utf8");
	} catch {
		return null;
	}
}
