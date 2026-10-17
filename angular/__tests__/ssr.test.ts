import "@angular/compiler";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import {
	bootstrapApplication,
	type BootstrapContext,
} from "@angular/platform-browser";
import {
	provideServerRendering,
	renderApplication,
} from "@angular/platform-server";
import { describe, expect, it } from "vitest";
import { AnimateIcons } from "@animateicons/angular";
import { Bell } from "@animateicons/angular/lucide";

const Root = Component({
	selector: "app-root",
	imports: [AnimateIcons],
	template: `<animate-icons [icon]="bell" [size]="32" color="tomato" />`,
})(
	class {
		readonly bell = Bell;
	},
);

describe("server rendering", () => {
	it("renders the whole icon at rest on the server", async () => {
		const html = await renderApplication(
			(context: BootstrapContext) =>
				bootstrapApplication(
					Root,
					{
						providers: [
							provideServerRendering(),
							provideZonelessChangeDetection(),
						],
					},
					context,
				),
			{ document: "<html><body><app-root></app-root></body></html>", url: "/" },
		);
		expect(html).toMatch(/<animate-icons[^>]*ngskiphydration/);
		expect(html).toMatch(/<animate-icons[^>]*color: tomato/);
		expect(html).toContain('width="32"');
		expect(html).toContain('d="M10.268 21a2 2 0 0 0 3.464 0"');
	});
});
