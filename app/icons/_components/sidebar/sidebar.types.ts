import type { RequestType } from "@/lib/request";
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
	request?: RequestType;
};

export type SidebarGroupConfig = {
	label: string;
	items: SidebarItem[];
	scrollable?: boolean;
};
