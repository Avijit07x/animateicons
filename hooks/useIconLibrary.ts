"use client";

import { usePathname } from "next/navigation";

export type IconLibrary = "lucide" | "huge";
export type IconLibraryPrefix = "lu" | "hu";

type IconLibraryResult = {
	library: IconLibrary | null;
	prefix: IconLibraryPrefix | null;
};

export const useIconLibrary = (): IconLibraryResult => {
	const pathname = usePathname();

	if (!pathname) {
		return { library: null, prefix: null };
	}

	const segments = pathname.split("/").filter(Boolean);
	const library = segments[1];

	if (library === "lucide") {
		return { library: "lucide", prefix: "lu" };
	}

	if (library === "huge") {
		return { library: "huge", prefix: "hu" };
	}

	return { library: null, prefix: null };
};
