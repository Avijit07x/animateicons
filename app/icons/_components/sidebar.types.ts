// sidebar.types.ts
import type { ComponentType } from "react";

export type SidebarIcon = ComponentType<{ className?: string }>;

export type SidebarLinkItem = {
	label: string;
	href: string;
	icon: SidebarIcon;
};

export type SidebarStaticItem = {
	label: string;
	icon: SidebarIcon;
};

export type SidebarItem = SidebarLinkItem | SidebarStaticItem;

export type SidebarGroup = {
	label: string;
	items: SidebarItem[];
};
