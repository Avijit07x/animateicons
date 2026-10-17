import { buildUsageSnippet } from "@/app/icons/_components/playground/snippet";
import {
	frameworkOf,
	importLine,
	packageFor,
} from "@/app/icons/_contexts/DistributionContext";
import { iconNameToComponent } from "@/utils/iconNameToComponent";
import { describe, expect, it } from "vitest";

const config = { size: 32, duration: 1.5, color: "#ffffff" };

const snippet = (
	distribution: Parameters<typeof buildUsageSnippet>[0],
	library: "lucide" | "huge" = "lucide",
	name = "bell-ring",
) =>
	buildUsageSnippet(
		distribution,
		library,
		name,
		iconNameToComponent(name),
		config,
	);

describe("importLine", () => {
	it("imports the React component for npm", () => {
		expect(importLine("npm", "bell-ring", "lucide")).toBe(
			'import { BellRingIcon } from "@animateicons/react/lucide";',
		);
	});

	it("imports the Vue component", () => {
		expect(importLine("vue", "bell-ring", "huge")).toBe(
			'import { BellRingIcon } from "@animateicons/vue/huge";',
		);
	});

	it("imports the icon data for plain JS and Angular", () => {
		expect(importLine("vanilla", "bell-ring", "lucide")).toBe(
			'import { BellRing } from "@animateicons/vanilla/lucide";',
		);
		expect(importLine("angular", "arrow-up-right-0-1", "huge")).toBe(
			'import { ArrowUpRight01 } from "@animateicons/angular/huge";',
		);
	});
});

describe("packageFor", () => {
	it("maps both React methods to the React package", () => {
		expect(packageFor("npm")).toBe("@animateicons/react");
		expect(packageFor("shadcn")).toBe("@animateicons/react");
		expect(frameworkOf("shadcn")).toBe("react");
	});

	it("maps the other frameworks to their own package", () => {
		expect(packageFor("vanilla")).toBe("@animateicons/vanilla");
		expect(packageFor("vue")).toBe("@animateicons/vue");
		expect(packageFor("angular")).toBe("@animateicons/angular");
	});
});

describe("buildUsageSnippet", () => {
	it("keeps the React npm snippet", () => {
		expect(snippet("npm")).toBe(
			'import { BellRingIcon } from "@animateicons/react/lucide";\n\n<BellRingIcon\n  size={32}\n  duration={1.5}\n  color="#ffffff"\n/>',
		);
	});

	it("keeps the shadcn snippet", () => {
		expect(snippet("shadcn")).toBe(
			'import { BellRingIcon } from "@/components/ui/bell-ring-icon";\n\n<BellRingIcon\n  size={32}\n  duration={1.5}\n  color="#ffffff"\n/>',
		);
	});

	it("builds the plain JS snippet", () => {
		expect(snippet("vanilla")).toBe(
			[
				'import { createIcon } from "@animateicons/vanilla";',
				'import { BellRing } from "@animateicons/vanilla/lucide";',
				"",
				"const icon = createIcon(BellRing, {",
				"  size: 32,",
				"  duration: 1.5,",
				'  color: "#ffffff",',
				"});",
				"document.body.append(icon);",
			].join("\n"),
		);
	});

	it("builds the Vue snippet", () => {
		expect(snippet("vue", "huge")).toBe(
			[
				'<script setup lang="ts">',
				'import { BellRingIcon } from "@animateicons/vue/huge";',
				"</script>",
				"",
				"<template>",
				"  <BellRingIcon",
				'    :size="32"',
				'    :duration="1.5"',
				'    color="#ffffff"',
				"  />",
				"</template>",
			].join("\n"),
		);
	});

	it("builds the Angular snippet with a camelCase field", () => {
		expect(snippet("angular", "huge", "arrow-up-right-0-1")).toBe(
			[
				'import { Component } from "@angular/core";',
				'import { AnimateIcons } from "@animateicons/angular";',
				'import { ArrowUpRight01 } from "@animateicons/angular/huge";',
				"",
				"@Component({",
				'  selector: "app-example",',
				"  imports: [AnimateIcons],",
				"  template: `",
				"    <animate-icons",
				'      [icon]="arrowUpRight01"',
				'      [size]="32"',
				'      [duration]="1.5"',
				'      color="#ffffff"',
				"    />",
				"  `,",
				"})",
				"export class Example {",
				"  arrowUpRight01 = ArrowUpRight01;",
				"}",
			].join("\n"),
		);
	});
});
