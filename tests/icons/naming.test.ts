/**
 * Icon naming consistency test.
 *
 * Every icon file under `icons/<library>/` must use the canonical names:
 *   const XxxIcon       — forwardRef component
 *   XxxIconHandle       — imperative handle interface
 *   XxxIconProps        — props interface
 *
 * If a contributor adds a new icon with `BlendHandle` instead of
 * `BlendIconHandle` (or any other deviation), this test fails in CI
 * and tells them exactly what to rename.
 *
 * Auto-fix: pnpm --filter @animateicons/react normalize
 */

import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ICONS_DIRS = [
	path.join(REPO_ROOT, "icons", "lucide"),
	path.join(REPO_ROOT, "icons", "huge"),
];

const COMPONENT_RE = /(?:const|function)\s+([A-Z][A-Za-z0-9]*Icon)\s*[=(:<]/m;
const HANDLE_RE =
	/(?:^|\s)(?:export\s+)?(?:interface|type)\s+([A-Z][A-Za-z0-9]*Handle)\b/m;
const PROPS_RE =
	/(?:^|\s)(?:export\s+)?(?:interface|type)\s+([A-Z][A-Za-z0-9]*Props)\b/m;

const stemToComponent = (stem: string) =>
	`${stem
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("")}Icon`;

type IconCheck = {
	file: string;
	source: string;
	expectedComponent: string;
};

const loadIcons = async (): Promise<IconCheck[]> => {
	const checks: IconCheck[] = [];
	for (const dir of ICONS_DIRS) {
		const files = (await fs.readdir(dir))
			.filter((f) => f.endsWith("-icon.tsx"))
			.sort();
		for (const file of files) {
			const stem = file.replace(/-icon\.tsx$/, "");
			const source = await fs.readFile(path.join(dir, file), "utf8");
			checks.push({
				file: path.relative(REPO_ROOT, path.join(dir, file)),
				source,
				expectedComponent: stemToComponent(stem),
			});
		}
	}
	return checks;
};

describe("icon naming consistency", async () => {
	const icons = await loadIcons();

	it("scans a non-empty set of icons", () => {
		expect(icons.length).toBeGreaterThan(280);
	});

	describe.each(icons)("$file", ({ file, source, expectedComponent }) => {
		const componentMatch = source.match(COMPONENT_RE);
		const componentName = componentMatch?.[1];

		it("exports a component named after the file stem", () => {
			expect(componentName, `${file} has no XxxIcon component export`).toBe(
				expectedComponent,
			);
		});

		it("uses canonical handle interface name (if present)", () => {
			const handleMatch = source.match(HANDLE_RE);
			if (!handleMatch) return; // not every icon needs to expose a handle
			expect(handleMatch[1]).toBe(`${componentName}Handle`);
		});

		it("uses canonical props interface name (if present)", () => {
			const propsMatch = source.match(PROPS_RE);
			if (!propsMatch) return;
			expect(propsMatch[1]).toBe(`${componentName}Props`);
		});
	});
});
