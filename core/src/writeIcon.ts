import fs from "node:fs";
import path from "node:path";

import type { RegistryItem } from "./types";

export const MINIMAL_CN_SOURCE = `type ClassValue = string | undefined | null | false | 0;

export const cn = (...inputs: ClassValue[]): string =>
\tinputs.filter(Boolean).join(" ");
`;

export interface RenderOptions {
	utilsImport?: string;
}

export function renderIconContent(
	item: RegistryItem,
	opts: RenderOptions = {},
): string {
	const file = item.files[0];
	if (!file) throw new Error(`Registry item "${item.name}" has no files`);

	let content = file.content;
	const utils = opts.utilsImport;
	if (utils && utils !== "@/lib/utils") {
		content = content.replace(/(["'])@\/lib\/utils\1/g, `$1${utils}$1`);
	}
	return content;
}

export interface WriteOptions extends RenderOptions {
	targetDir: string;
	fileName: string;
	cwd?: string;
	overwrite?: boolean;
}

export interface WriteResult {
	file: string;
	skipped: boolean;
}

export function writeIcon(item: RegistryItem, opts: WriteOptions): WriteResult {
	const cwd = opts.cwd ?? process.cwd();
	const dir = path.isAbsolute(opts.targetDir)
		? opts.targetDir
		: path.join(cwd, opts.targetDir);
	const dest = path.join(dir, opts.fileName);

	if (fs.existsSync(dest) && !opts.overwrite) {
		return { file: dest, skipped: true };
	}

	const content = renderIconContent(item, { utilsImport: opts.utilsImport });
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(dest, content, "utf8");
	return { file: dest, skipped: false };
}
