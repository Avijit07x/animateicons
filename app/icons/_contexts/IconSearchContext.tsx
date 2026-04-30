"use client";

/**
 * IconSearchContext
 *
 * SRP: owns the AnimateIcons gallery search query state, exposes a
 * debounced version to consumers, and keeps the browser URL `?q=` in
 * sync — so:
 *   - users land on /icons/lucide?q=bell with the AnimateIcons search
 *     field pre-filled and results filtered
 *   - the URL updates while typing (debounced, history-safe via replace)
 *   - back/forward buttons restore the AnimateIcons filter
 *   - the SearchAction JSON-LD in app/layout.tsx actually deep-links
 *     into the AnimateIcons gallery for sitelinks search
 *
 * Two-way binding rules (avoid loops):
 *   state → URL fires only when debounced value differs from the
 *           current ?q=
 *   URL → state fires only when the URL drifts from the debounced
 *         value (i.e. only on real navigation, not on our own
 *         router.replace)
 */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
	createContext,
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

export const IconSearchProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Hydrate from `?q=` on first render. Lazy init so we don't read
	// searchParams on every render — and so SSR/CSR start matches.
	const [query, setQuery] = useState(
		() => searchParams?.get(QUERY_PARAM) ?? "",
	);
	const [debouncedQuery] = useDebounce(query, 300);

	// state → URL: replace (not push) so we don't pollute history.
	useEffect(() => {
		if (!searchParams) return;
		const current = searchParams.get(QUERY_PARAM) ?? "";
		if (debouncedQuery === current) return;

		const params = new URLSearchParams(searchParams.toString());
		if (debouncedQuery) {
			params.set(QUERY_PARAM, debouncedQuery);
		} else {
			params.delete(QUERY_PARAM);
		}

		const qs = params.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	}, [debouncedQuery, searchParams, pathname, router]);

	// URL → state: handles back/forward and external links. Only writes
	// when the URL drifts from the debounced value (i.e. someone else
	// changed it), preventing a feedback loop with the effect above.
	const searchParamsKey = searchParams?.toString() ?? "";
	useEffect(() => {
		if (!searchParams) return;
		const urlQuery = searchParams.get(QUERY_PARAM) ?? "";
		if (urlQuery !== debouncedQuery && urlQuery !== query) {
			setQuery(urlQuery);
		}
		// Depend on the serialized URL, not `query` — `query` would re-trigger
		// on every keystroke and cause a flicker.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParamsKey]);

	const inputValue = useMemo(() => ({ query, setQuery }), [query]);
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
