"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

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
	const [query, setQuery] = useState("");
	const [debouncedQuery] = useDebounce(query, 300);

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
