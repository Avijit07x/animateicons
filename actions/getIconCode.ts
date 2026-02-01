"use server";

import fs from "node:fs/promises";
import path from "node:path";

export type IconLibrary = "lucide" | "huge";

export async function getIconCode(iconName: string, library: IconLibrary) {
	try {
		const ROOT = process.cwd();

		const ICONS_DIR = path.join(ROOT, "icons", library);

		const fileName = `${iconName}-icon.tsx`;
		const filePath = path.join(ICONS_DIR, fileName);

		await fs.access(filePath);

		const content = await fs.readFile(filePath, "utf8");
		return content;
	} catch {
		return "";
	}
}
