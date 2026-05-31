import path from "node:path";
import { fileURLToPath } from "node:url";

import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";

import { BrowseApp } from "../src/commands/browse";

// Render against the repo's real generated registry - no network.
const PUBLIC_R = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../public/r",
);

const tick = (ms = 60) => new Promise((r) => setTimeout(r, ms));

function mount() {
	return render(
		<BrowseApp
			cwd="/tmp"
			dir="components/icons"
			registryBase={PUBLIC_R}
			utilsImport="@/lib/utils"
			reportAdded={() => {}}
		/>,
	);
}

describe("BrowseApp (Ink render smoke)", () => {
	it("mounts, loads the catalog, and renders the dashboard", async () => {
		const { lastFrame, unmount } = mount();
		expect(lastFrame()).toContain("Loading");

		await tick(150);
		const frame = lastFrame() ?? "";
		expect(frame).toContain("AnimateIcons");
		expect(frame).toContain("icons");
		expect(frame).toContain("hu-activity"); // first item, unfiltered
		expect(frame).toMatch(/move/);
		unmount();
	});

	it("filters as you type and selects with space (no mode switch)", async () => {
		const { lastFrame, stdin, unmount } = mount();
		await tick(150);

		// typing filters the list immediately (fzf-style, always live)
		stdin.write("github");
		await tick(80);
		const filtered = lastFrame() ?? "";
		expect(filtered).toContain("github");
		expect(filtered).not.toContain("hu-activity"); // filtered out

		// space selects the highlighted icon instead of typing into the query
		stdin.write(" ");
		await tick(80);
		expect(lastFrame() ?? "").toContain("selected");

		unmount();
	});
});
