import {
	type Distribution,
	type Framework,
	frameworkOf,
	iconDataName,
	importLine,
} from "../../_contexts/DistributionContext";
import type { IconConfig } from "./useIconConfig";

type Library = "lucide" | "huge";

export const MANUAL_CONTROL_HINT: Record<Framework, string> = {
	react: "Attach a ref to call startAnimation() and stopAnimation().",
	vue: "Attach a ref to call startAnimation() and stopAnimation().",
	angular:
		"Use viewChild(AnimateIcons) to call startAnimation() and stopAnimation().",
	vanilla:
		"Call icon.startAnimation() and icon.stopAnimation() to play it yourself.",
};

const reactSnippet = (
	distribution: Distribution,
	library: Library,
	name: string,
	componentName: string,
	config: IconConfig,
): string => {
	const importFrom =
		distribution === "shadcn"
			? `@/components/ui/${name}-icon`
			: `@animateicons/react/${library}`;

	return `import { ${componentName} } from "${importFrom}";\n\n<${componentName}\n  size={${config.size}}\n  duration={${config.duration}}\n  color="${config.color}"\n/>`;
};

const vanillaSnippet = (
	library: Library,
	name: string,
	{ size, duration, color }: IconConfig,
): string =>
	[
		'import { createIcon } from "@animateicons/vanilla";',
		importLine("vanilla", name, library),
		"",
		`const icon = createIcon(${iconDataName(name)}, {`,
		`  size: ${size},`,
		`  duration: ${duration},`,
		`  color: "${color}",`,
		"});",
		"document.body.append(icon);",
	].join("\n");

const vueSnippet = (
	library: Library,
	name: string,
	componentName: string,
	{ size, duration, color }: IconConfig,
): string =>
	[
		'<script setup lang="ts">',
		importLine("vue", name, library),
		"</script>",
		"",
		"<template>",
		`  <${componentName}`,
		`    :size="${size}"`,
		`    :duration="${duration}"`,
		`    color="${color}"`,
		"  />",
		"</template>",
	].join("\n");

const angularSnippet = (
	library: Library,
	name: string,
	{ size, duration, color }: IconConfig,
): string => {
	const data = iconDataName(name);
	const field = data.charAt(0).toLowerCase() + data.slice(1);

	return [
		'import { Component } from "@angular/core";',
		'import { AnimateIcons } from "@animateicons/angular";',
		importLine("angular", name, library),
		"",
		"@Component({",
		'  selector: "app-example",',
		"  imports: [AnimateIcons],",
		"  template: `",
		"    <animate-icons",
		`      [icon]="${field}"`,
		`      [size]="${size}"`,
		`      [duration]="${duration}"`,
		`      color="${color}"`,
		"    />",
		"  `,",
		"})",
		"export class Example {",
		`  ${field} = ${data};`,
		"}",
	].join("\n");
};

export const buildUsageSnippet = (
	distribution: Distribution,
	library: Library,
	name: string,
	componentName: string,
	config: IconConfig,
): string => {
	switch (frameworkOf(distribution)) {
		case "vanilla":
			return vanillaSnippet(library, name, config);
		case "vue":
			return vueSnippet(library, name, componentName, config);
		case "angular":
			return angularSnippet(library, name, config);
		default:
			return reactSnippet(distribution, library, name, componentName, config);
	}
};
