"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
	createContext,
	Suspense,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useDebounce } from "use-debounce";

const QUERY_PARAM = "q";

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

export const MAX_SEARCH_LENGTH = 100;

type ProviderProps = { children: React.ReactNode };

const EMPTY_INPUT: IconSearchInputContextValue = {
	query: "",
	setQuery: () => {},
};

const EMPTY_RESULT: IconSearchResultContextValue = { debouncedQuery: "" };

const StaticIconSearchProvider: React.FC<ProviderProps> = ({ children }) => (
	<IconSearchInputContext.Provider value={EMPTY_INPUT}>
		<IconSearchResultContext.Provider value={EMPTY_RESULT}>
			{children}
		</IconSearchResultContext.Provider>
	</IconSearchInputContext.Provider>
);

export const IconSearchProvider: React.FC<ProviderProps> = ({ children }) => (
	<Suspense
		fallback={<StaticIconSearchProvider>{children}</StaticIconSearchProvider>}
	>
		<UrlIconSearchProvider>{children}</UrlIconSearchProvider>
	</Suspense>
);

const UrlIconSearchProvider: React.FC<ProviderProps> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [query, setQuery] = useState(
		() => searchParams?.get(QUERY_PARAM)?.slice(0, MAX_SEARCH_LENGTH) ?? "",
	);
	const [debouncedQuery] = useDebounce(query, 300);

	useEffect(() => {
		if (!searchParams) return;
		const current = searchParams.get(QUERY_PARAM) ?? "";
		const safeQuery = debouncedQuery.slice(0, MAX_SEARCH_LENGTH);
		if (safeQuery === current) return;

		const params = new URLSearchParams(searchParams.toString());
		if (safeQuery) {
			params.set(QUERY_PARAM, safeQuery);
		} else {
			params.delete(QUERY_PARAM);
		}

		const qs = params.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	}, [debouncedQuery, searchParams, pathname, router]);

	const searchParamsKey = searchParams?.toString() ?? "";
	const [prevKey, setPrevKey] = useState(searchParamsKey);
	if (searchParamsKey !== prevKey) {
		setPrevKey(searchParamsKey);
		const rawUrlQuery = searchParams?.get(QUERY_PARAM) ?? "";
		const urlQuery = rawUrlQuery.slice(0, MAX_SEARCH_LENGTH);
		if (urlQuery !== debouncedQuery && urlQuery !== query) {
			setQuery(urlQuery);
		}
	}

	const handleSetQuery = useCallback<
		React.Dispatch<React.SetStateAction<string>>
	>((action) => {
		setQuery((prev) => {
			const next = typeof action === "function" ? action(prev) : action;
			return next.slice(0, MAX_SEARCH_LENGTH);
		});
	}, []);

	const inputValue = useMemo(
		() => ({ query, setQuery: handleSetQuery }),
		[query, handleSetQuery],
	);
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
