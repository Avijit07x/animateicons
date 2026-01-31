import type { LucideIcon } from "lucide-react";

type SidebarIconMap = {
	lucide: LucideIcon;
	huge: null;
};

export const resolveSidebarIcon = (
	library: "lucide" | "huge",
	icons: SidebarIconMap,
) => {
	if (library === "huge") return null;
	return icons.lucide;
};
