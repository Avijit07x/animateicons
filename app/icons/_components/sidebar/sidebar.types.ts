export type SidebarItem = {
	label: string;
	href?: string;
	name?: string;
	icon?: React.ComponentType<{ className?: string }>;
	target?: string;
	isActive?: boolean;
	isBeta?: boolean;
};

export type SidebarGroupConfig = {
	label: string;
	items: SidebarItem[];
	scrollable?: boolean;
};
