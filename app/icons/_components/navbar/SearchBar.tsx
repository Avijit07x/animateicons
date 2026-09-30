"use client";

import { Kbd } from "@/components/ui/kbd";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useIsMac } from "@/hooks/useIsMac";
import { SearchIcon, type SearchIconHandle } from "@/icons/huge/search-icon";
import { ICON_COUNT as HUGE_ICON_COUNT } from "@/icons/huge/meta";
import { ICON_COUNT as LUCIDE_ICON_COUNT } from "@/icons/lucide/meta";
import React, { useEffect, useRef, useState } from "react";
import {
	MAX_SEARCH_LENGTH,
	useIconSearch,
} from "../../_contexts/IconSearchContext";

const ICON_LIST_COUNT = {
	lucide: LUCIDE_ICON_COUNT,
	huge: HUGE_ICON_COUNT,
} as const;

const KBD = "h-5 rounded-full bg-white/10 px-2 text-[0.6rem]";

const SearchBar: React.FC = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const iconRef = useRef<SearchIconHandle>(null);
	const [focused, setFocused] = useState(false);
	const { query, setQuery } = useIconSearch();
	const { library } = useIconLibrary();
	const isMac = useIsMac();

	const iconCount = library ? ICON_LIST_COUNT[library] : "";

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}

			if (e.key === "Escape" && (focused || query)) {
				setQuery("");
				inputRef.current?.blur();
				setFocused(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [focused, isMac, query, setQuery]);

	const showEsc = focused || query.length > 0;

	return (
		<label className="bg-surfaceElevated focus-within:bg-surfaceActive flex h-9 w-full items-center gap-2 rounded-full pr-2.5 pl-3.5 transition-colors">
			<SearchIcon ref={iconRef} size={16} className="text-textMuted shrink-0" />
			<input
				ref={inputRef}
				value={query}
				maxLength={MAX_SEARCH_LENGTH}
				placeholder={`Search ${iconCount} icons...`}
				onChange={(e) => setQuery(e.target.value)}
				onFocus={() => {
					setFocused(true);
					iconRef.current?.startAnimation();
				}}
				onBlur={() => setFocused(false)}
				className="placeholder:text-textMuted caret-primary min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none"
			/>
			<span className="flex shrink-0 items-center gap-1">
				{showEsc ? (
					<Kbd className={KBD}>ESC</Kbd>
				) : (
					<>
						<Kbd className={KBD}>{isMac ? "⌘" : "Ctrl"}</Kbd>
						<Kbd className={KBD}>K</Kbd>
					</>
				)}
			</span>
		</label>
	);
};

export default SearchBar;
