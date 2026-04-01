"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
} from "react";
import { useDebounce } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

type IconSearchInputContextValue = {
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
};

type IconSearchResultContextValue = {
	debouncedQuery: string;
};

const IconSearchInputContext =
	createContext<IconSearchInputContextValue | null>(null);
const IconSearchResultContext =
	createContext<IconSearchResultContextValue | null>(null);

export const IconSearchProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const query = searchParams?.get("q") ?? "";
	const [debouncedQuery] = useDebounce(query, 300);

	const setQuery = useCallback<React.Dispatch<React.SetStateAction<string>>>(
		(value) => {
			const previousQuery = searchParams?.get("q") ?? "";
			const nextQuery =
				typeof value === "function" ? value(previousQuery) : value;

			if (nextQuery === previousQuery) {
				return;
			}

			const nextSearchParams = new URLSearchParams(
				searchParams?.toString() ?? "",
			);

			if (nextQuery) {
				nextSearchParams.set("q", nextQuery);
			} else {
				nextSearchParams.delete("q");
			}

			const nextUrl = `${window.location.pathname}${
				nextSearchParams.toString() ? `?${nextSearchParams.toString()}` : ""
			}`;

			router.replace(nextUrl, { scroll: false });
		},
		[router, searchParams],
	);

	const inputValue = useMemo(() => ({ query, setQuery }), [query, setQuery]);
	const resultValue = useMemo(() => ({ debouncedQuery }), [debouncedQuery]);

	return (
		<IconSearchInputContext.Provider value={inputValue}>
			<IconSearchResultContext.Provider value={resultValue}>
				{children}
			</IconSearchResultContext.Provider>
		</IconSearchInputContext.Provider>
	);
};

export const useIconSearch = () => {
	const ctx = useContext(IconSearchInputContext);
	if (!ctx) {
		throw new Error("useIconSearch must be used inside IconSearchProvider");
	}
	return ctx;
};

export const useIconSearchResult = () => {
	const ctx = useContext(IconSearchResultContext);
	if (!ctx) {
		throw new Error(
			"useIconSearchResult must be used inside IconSearchProvider",
		);
	}
	return ctx;
};
