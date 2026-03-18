"use client";

import { usePathname } from "next/navigation";

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

	const LIBRARY_MAP: Record<string, IconLibraryPrefix> = {
		lucide: "lu",
		huge: "hu",
	};

	const prefix = LIBRARY_MAP[library];

	if (prefix) {
		return { library: library as IconLibrary, prefix };
	}

	return { library: null, prefix: null };
};
