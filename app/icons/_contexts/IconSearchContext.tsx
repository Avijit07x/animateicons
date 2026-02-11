"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

type IconSearchContextValue = {
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	debouncedQuery: string;
};

const IconSearchContext = createContext<IconSearchContextValue | null>(null);

export const IconSearchProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [query, setQuery] = useState("");
	const [debouncedQuery] = useDebounce(query, 300);

	const value = useMemo(
		() => ({
			query,
			setQuery,
			debouncedQuery,
		}),
		[query, debouncedQuery],
	);

	return (
		<IconSearchContext.Provider value={value}>
			{children}
		</IconSearchContext.Provider>
	);
};

export const useIconSearch = () => {
	const ctx = useContext(IconSearchContext);
	if (!ctx) {
		throw new Error("useIconSearch must be used inside IconSearchProvider");
	}
	return ctx;
};
