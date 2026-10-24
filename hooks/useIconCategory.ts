"use client";

import { ICON_CATEGORIES as HUGE_CATEGORIES } from "@/icons/huge/summary";
import { ICON_CATEGORIES as LUCIDE_CATEGORIES } from "@/icons/lucide/summary";
import { useSearchParams } from "next/navigation";

export const ALL_CATEGORIES = "all";

const CATEGORY_PARAM = "category";

const CATEGORIES = { lucide: LUCIDE_CATEGORIES, huge: HUGE_CATEGORIES };

export const categoriesOf = (library: IconLibrary) => CATEGORIES[library];

export const useIconCategory = (library: IconLibrary) => {
	const searchParams = useSearchParams();
	const requested = searchParams?.get(CATEGORY_PARAM);
	const category =
		requested && CATEGORIES[library].some((c) => c.name === requested)
			? requested
			: ALL_CATEGORIES;

	const hrefFor = (next: string) => {
		const params = new URLSearchParams(searchParams?.toString());
		if (next === ALL_CATEGORIES) params.delete(CATEGORY_PARAM);
		else params.set(CATEGORY_PARAM, next);
		const query = params.toString();
		return `/icons/${library}${query ? `?${query}` : ""}`;
	};

	return { category, hrefFor };
};
