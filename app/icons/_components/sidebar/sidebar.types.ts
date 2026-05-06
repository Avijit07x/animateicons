export type SidebarItem = {
	label: string;
	href?: string;
	name?: string;
	icon?: React.ComponentType<{ className?: string }>;
	target?: string;
	isActive?: boolean;
	isBeta?: boolean;
	/** Visual emphasis for important CTAs (e.g. Supporters). Renders the
	 *  icon + label tinted, with a subtle border/glow. */
	highlight?: boolean;
};

export type SidebarGroupConfig = {
	label: string;
	items: SidebarItem[];
	scrollable?: boolean;
};
