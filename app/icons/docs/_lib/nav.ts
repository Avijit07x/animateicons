import type { Framework } from "@/app/icons/_contexts/DistributionContext";
import { FRAMEWORK_GUIDES } from "./frameworks";

export interface DocLink {
	title: string;
	href: string;
	label?: string;
	framework?: Framework;
}

export interface DocGroup {
	title: string;
	items: DocLink[];
}

export const docsNav: DocGroup[] = [
	{
		title: "Getting Started",
		items: [{ title: "Introduction", href: "/icons/docs" }],
	},
	{
		title: "Frameworks",
		items: FRAMEWORK_GUIDES.map(({ name, href, framework }) => ({
			title: name,
			href,
			framework,
		})),
	},
	{
		title: "React guides",
		items: [
			{
				title: "Hover helper",
				href: "/icons/docs/examples/hover-helper",
				label: "Hook",
			},
			{ title: "Buttons & tooltips", href: "/icons/docs/examples/buttons" },
			{ title: "Inputs", href: "/icons/docs/examples/inputs" },
			{ title: "Cards & feedback", href: "/icons/docs/examples/cards" },
			{ title: "Menus & navigation", href: "/icons/docs/examples/navigation" },
		],
	},
	{
		title: "Copy the source",
		items: [
			{ title: "shadcn CLI", href: "/icons/docs/shadcn", label: "React" },
			{ title: "animateicons CLI", href: "/icons/docs/cli", label: "React" },
		],
	},
	{
		title: "AI agents",
		items: [{ title: "MCP Server", href: "/icons/docs/mcp", label: "AI" }],
	},
];

export const docsPages: DocLink[] = docsNav.flatMap((g) => g.items);

export const findDocPage = (pathname: string): DocLink | undefined =>
	docsPages.find((p) => p.href === pathname);

export const docSlug = (href: string): string =>
	href.replace(/^\/icons\/docs\/?/, "") || "installation";

export const docMarkdownPath = (href: string): string =>
	`/r/docs/${docSlug(href)}.md`;
