export interface DocLink {
	title: string;
	href: string;
	label?: string;
}

export interface DocGroup {
	title: string;
	items: DocLink[];
}

export const docsNav: DocGroup[] = [
	{
		title: "Getting Started",
		items: [
			{ title: "Installation", href: "/icons/docs" },
			{ title: "Usage", href: "/icons/docs/usage" },
			{
				title: "Hover helper",
				href: "/icons/docs/examples/hover-helper",
				label: "Hook",
			},
		],
	},
	{
		title: "Examples",
		items: [
			{ title: "Buttons & tooltips", href: "/icons/docs/examples/buttons" },
			{ title: "Inputs", href: "/icons/docs/examples/inputs" },
			{ title: "Cards & feedback", href: "/icons/docs/examples/cards" },
			{ title: "Menus & navigation", href: "/icons/docs/examples/navigation" },
		],
	},
	{
		title: "Installation methods",
		items: [
			{ title: "shadcn CLI", href: "/icons/docs/shadcn" },
			{ title: "animateicons CLI", href: "/icons/docs/cli" },
			{ title: "MCP Server", href: "/icons/docs/mcp", label: "AI" },
		],
	},
];

export const docsPages: DocLink[] = docsNav.flatMap((g) => g.items);

export const findDocPage = (pathname: string): DocLink | undefined =>
	docsPages.find((p) => p.href === pathname);
