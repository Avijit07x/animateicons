import { getIcon as getHugeIcon } from "@/icons/huge/loaders";
import { getIcon as getLucideIcon } from "@/icons/lucide/loaders";

export const getLibraryIcon = (library: IconLibrary, name: string) =>
	library === "huge" ? getHugeIcon(name) : getLucideIcon(name);
