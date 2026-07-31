/**
 * Docs navigation tree. Left-sidebar groups → pages, in display order.
 * `docsPages` is the same list flattened, powering the prev/next pager.
 * Add a page here and it shows up in the sidebar automatically.
 */
export interface DocLink {
	title: string;
	href: string;
	/** Small tag rendered next to the label, e.g. "AI" or "New". */
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
		],
	},
	{
		title: "Examples",
		items: [
			{ title: "Buttons & tooltips", href: "/icons/docs/examples/buttons" },
			{ title: "Inputs", href: "/icons/docs/examples/inputs" },
			{ title: "Cards & feedback", href: "/icons/docs/examples/cards" },
			{ title: "Menus & navigation", href: "/icons/docs/examples/navigation" },
			{ title: "Hover helper", href: "/icons/docs/examples/hover-helper" },
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

/** The nav entry matching a pathname — powers the breadcrumb + pager. */
export const findDocPage = (pathname: string): DocLink | undefined =>
	docsPages.find((p) => p.href === pathname);
