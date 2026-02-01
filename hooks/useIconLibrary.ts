"use client";

import { usePathname } from "next/navigation";

export type IconLibrary = "lucide" | "huge";

export const useIconLibrary = (): IconLibrary | null => {
	const pathname = usePathname();
	if (!pathname) return null;

	const segments = pathname.split("/").filter(Boolean);
	const library = segments[1];

	if (library === "lucide" || library === "huge") {
		return library;
	}

	return null;
};
