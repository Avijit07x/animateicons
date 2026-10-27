import type { IconHandle } from "@/types/icon";
import type { ComponentType, Ref } from "react";

type SidebarItem = {
	label: string;
	href?: string;
	name?: string;
	icon?: ComponentType<{
		size?: number;
		color?: string;
		ref?: Ref<IconHandle>;
	}>;
	target?: string;
	isActive?: boolean;
	highlight?: boolean;
};

export type SidebarGroupConfig = {
	label: string;
	items: SidebarItem[];
	scrollable?: boolean;
};
