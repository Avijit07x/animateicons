import type { Framework } from "@/app/icons/_contexts/DistributionContext";

export interface FrameworkGuide {
	framework: Framework;
	name: string;
	pkg: string;
	href: string;
	summary: string;
}

export const FRAMEWORK_GUIDES: FrameworkGuide[] = [
	{
		framework: "react",
		name: "React",
		pkg: "@animateicons/react",
		href: "/icons/docs/react",
		summary: "Icon components for React 18 and 19, including Next.js.",
	},
	{
		framework: "vue",
		name: "Vue",
		pkg: "@animateicons/vue",
		href: "/icons/docs/vue",
		summary: "Icon components for Vue 3.5 and newer, including Nuxt.",
	},
	{
		framework: "angular",
		name: "Angular",
		pkg: "@animateicons/angular",
		href: "/icons/docs/angular",
		summary: "One standalone component for Angular 20, 21 and 22.",
	},
	{
		framework: "vanilla",
		name: "Plain JS",
		pkg: "@animateicons/vanilla",
		href: "/icons/docs/vanilla",
		summary: "A function, a custom element and a CDN script for any page.",
	},
];
