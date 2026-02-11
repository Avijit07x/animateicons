export type SidebarItem = {
	label: string;
	href?: string;
	name?: string;
	icon?: React.ComponentType<{ className?: string }>;
	target?: string;
	isActive?: boolean;
};

export type SidebarGroupConfig = {
	label: string;
	items: SidebarItem[];
	scrollable?: boolean;
};
