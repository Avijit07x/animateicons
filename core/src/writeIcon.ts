import fs from "node:fs";
import path from "node:path";

import type { RegistryItem } from "./types";

/**
 * A drop-in `cn` helper, identical to the one shipped in
 * `@animateicons/react`. Written by the CLI's `--with-utils` flag for projects
 * that don't already have a shadcn-style `@/lib/utils`.
 */
export const MINIMAL_CN_SOURCE = `type ClassValue = string | undefined | null | false | 0;

export const cn = (...inputs: ClassValue[]): string =>
\tinputs.filter(Boolean).join(" ");
`;

export interface RenderOptions {
	/**
	 * Replacement module specifier for the icon's `@/lib/utils` import. Pass
	 * the project's resolved `cn` alias (e.g. from components.json). When equal
	 * to the default `@/lib/utils`, the import is left untouched.
	 */
	utilsImport?: string;
}

/** Transform a registry item's source into the file the CLI will write. */
export function renderIconContent(
	item: RegistryItem,
	opts: RenderOptions = {},
): string {
	const file = item.files[0];
	if (!file) throw new Error(`Registry item "${item.name}" has no files`);

	let content = file.content;
	const utils = opts.utilsImport;
	if (utils && utils !== "@/lib/utils") {
		// Rewrite both quote styles of the bare specifier only.
		content = content.replace(/(["'])@\/lib\/utils\1/g, `$1${utils}$1`);
	}
	return content;
}

export interface WriteOptions extends RenderOptions {
	/** Directory to write into (absolute, or relative to `cwd`). */
	targetDir: string;
	/** Output file name, e.g. "bell-ring.tsx". */
	fileName: string;
	/** Base directory for relative `targetDir`. Defaults to process.cwd(). */
	cwd?: string;
	/** Overwrite an existing file instead of skipping it. */
	overwrite?: boolean;
}

export interface WriteResult {
	/** Absolute path of the destination file. */
	file: string;
	/** True when an existing file was left untouched (no `overwrite`). */
	skipped: boolean;
}

/** Write an icon's source to disk, honoring the overwrite guard. */
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
