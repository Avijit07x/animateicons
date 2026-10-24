import type { IconHandle } from "@/types/icon";
import type { ComponentType, Ref } from "react";
import type { Library } from "./types";

export type IconComponent = ComponentType<{
	size?: number;
	ref?: Ref<IconHandle>;
}>;

export type Registry = Record<Library, Map<string, IconComponent>>;

const toMap = (list: IconListItem[]) =>
	new Map(list.map((item) => [item.name, item.icon as IconComponent]));

export const loadRegistry = async (): Promise<Registry> => {
	const [lucide, huge] = await Promise.all([
		import("@/icons/lucide"),
		import("@/icons/huge"),
	]);
	return { lucide: toMap(lucide.ICON_LIST), huge: toMap(huge.ICON_LIST) };
};
