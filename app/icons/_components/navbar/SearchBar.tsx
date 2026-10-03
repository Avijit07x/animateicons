"use client";

import { Kbd } from "@/components/ui/kbd";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useIsMac } from "@/hooks/useIsMac";
import { SearchIcon, type SearchIconHandle } from "@/icons/huge/search-icon";
import { ICON_COUNT as HUGE_ICON_COUNT } from "@/icons/huge/meta";
import { ICON_COUNT as LUCIDE_ICON_COUNT } from "@/icons/lucide/meta";
import { MotionConfig, motion } from "motion/react";
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

const MotionKbd = motion.create(Kbd);

const HintKey: React.FC<{
	visible: boolean;
	index?: number;
	children: React.ReactNode;
}> = ({ visible, index = 0, children }) => (
	<MotionKbd
		className={KBD}
		initial={false}
		animate={
			visible
				? {
						opacity: 1,
						scale: 1,
						transition: {
							duration: 0.2,
							ease: "easeOut",
							delay: 0.08 + index * 0.03,
						},
					}
				: {
						opacity: 0,
						scale: 0.85,
						transition: {
							duration: 0.15,
							ease: "easeIn",
							delay: index * 0.03,
						},
					}
		}
	>
		{children}
	</MotionKbd>
);

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
				e.stopPropagation();
				inputRef.current?.focus();
			}

			if (e.key === "Escape" && (focused || query)) {
				setQuery("");
				inputRef.current?.blur();
				setFocused(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown, true);
		return () => window.removeEventListener("keydown", handleKeyDown, true);
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
			<MotionConfig reducedMotion="user">
				<span className="grid shrink-0 items-center">
					<span
						aria-hidden={showEsc}
						className="col-start-1 row-start-1 flex items-center gap-1"
					>
						<HintKey visible={!showEsc}>{isMac ? "⌘" : "Ctrl"}</HintKey>
						<HintKey visible={!showEsc} index={1}>
							K
						</HintKey>
					</span>
					<span
						aria-hidden={!showEsc}
						className="col-start-1 row-start-1 flex items-center justify-self-end"
					>
						<HintKey visible={showEsc}>ESC</HintKey>
					</span>
				</span>
			</MotionConfig>
		</label>
	);
};

export default SearchBar;
