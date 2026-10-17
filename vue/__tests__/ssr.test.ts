import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { describe, expect, it } from "vitest";
import { AnimateIcons } from "../src";
import { Bell, BellIcon, MailOpenIcon } from "../src/generated/lucide";

describe("server rendering", () => {
	it("renders the whole icon at rest, so pages show it before hydration", async () => {
		const html = await renderToString(
			createSSRApp({ render: () => h(BellIcon, { size: 32, color: "red" }) }),
		);
		expect(html).toContain(
			'<span style="position:relative;display:inline-flex;color:red;">',
		);
		expect(html).toContain('width="32"');
		expect(html).toContain('viewBox="0 0 24 24"');
		expect(html).toContain('d="M10.268 21a2 2 0 0 0 3.464 0"');
		expect(html).toContain('style="transform-origin: top center"');
	});

	it("renders the generic component from icon data", async () => {
		const html = await renderToString(
			createSSRApp({ render: () => h(AnimateIcons, { icon: Bell }) }),
		);
		expect(html).toContain('width="24"');
		expect(html).toContain('stroke="currentColor"');
	});

	it("gives every copy its own clip path ids", async () => {
		const html = await renderToString(
			createSSRApp({ render: () => [h(MailOpenIcon), h(MailOpenIcon)] }),
		);
		const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(([, id]) => id);
		expect(ids).toHaveLength(2);
		expect(new Set(ids).size).toBe(2);
		for (const id of ids) expect(html).toContain(`url(#${id})`);
	});
});
