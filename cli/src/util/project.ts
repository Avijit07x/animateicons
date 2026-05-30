import fs from "node:fs";
import path from "node:path";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

/** Guess the project's package manager from its lockfile. */
export function detectPackageManager(cwd: string): PackageManager {
	if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
	if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
	if (
		fs.existsSync(path.join(cwd, "bun.lockb")) ||
		fs.existsSync(path.join(cwd, "bun.lock"))
	) {
		return "bun";
	}
	return "npm";
}

/** The shell command this package manager uses to add a dependency. */
export function installCommand(pm: PackageManager, pkg: string): string {
	switch (pm) {
		case "pnpm":
			return `pnpm add ${pkg}`;
		case "yarn":
			return `yarn add ${pkg}`;
		case "bun":
			return `bun add ${pkg}`;
		default:
			return `npm install ${pkg}`;
	}
}

function readJson(file: string): unknown | null {
	if (!fs.existsSync(file)) return null;
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"));
	} catch {
		return null;
	}
}

export interface UtilsResolution {
	/** The module specifier the copied icon should import `cn` from. */
	utilsImport: string;
	/** Whether a `cn` util is believed to already exist in the project. */
	hasUtils: boolean;
}

/**
 * Resolve where the copied icon should import `cn` from. If a shadcn
 * `components.json` is present we honor its `aliases.utils`; otherwise we fall
 * back to the shadcn convention (`@/lib/utils`) and flag that it may not exist.
 */
export function resolveUtilsImport(cwd: string): UtilsResolution {
	const cj = readJson(path.join(cwd, "components.json")) as {
		aliases?: { utils?: string };
	} | null;
	const alias = cj?.aliases?.utils;
	if (alias) return { utilsImport: alias, hasUtils: true };
	return { utilsImport: "@/lib/utils", hasUtils: false };
}

/** Whether `motion` is already declared in the project's package.json. */
export function hasMotionDependency(cwd: string): boolean {
	const pkg = readJson(path.join(cwd, "package.json")) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	} | null;
	if (!pkg) return false;
	return Boolean(pkg.dependencies?.motion || pkg.devDependencies?.motion);
}
