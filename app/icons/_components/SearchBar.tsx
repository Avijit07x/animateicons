"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ICON_COUNT as HUGE_ICON_COUNT } from "../../../icons/huge";
import { ICON_COUNT as LUCIDE_ICON_COUNT } from "../../../icons/lucide";
import { useIconSearch } from "../_context/IconSearchContext";

const isMac =
	typeof navigator !== "undefined" &&
	/Mac|iPhone|iPad|iPod/i.test(navigator.platform);

const ICON_LIST_COUNT = {
	lucide: LUCIDE_ICON_COUNT,
	huge: HUGE_ICON_COUNT,
} as const;

type Props = {};

const SearchBar: React.FC<Props> = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [focused, setFocused] = useState(false);
	const { query, setQuery } = useIconSearch();
	const { library } = useIconLibrary();

	const ICON_COUNT = library ? ICON_LIST_COUNT[library] : "";

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "f") {
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
	}, [focused, query, setQuery]);

	const showEsc = focused || query.length > 0;

	return (
		<div className="flex w-full md:w-70">
			<InputGroup className="border-border bg-surfaceElevated rounded-full">
				<InputGroupInput
					ref={inputRef}
					value={query}
					placeholder={`Search ${ICON_COUNT} icons...`}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					className="pr-20 text-white"
				/>
				<InputGroupAddon>
					<SearchIcon className="text-textMuted size-4" />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end" className="gap-1">
					{showEsc ? (
						<Kbd className="bg-surface">ESC</Kbd>
					) : (
						<>
							<Kbd className="bg-surface">{isMac ? "⌘" : "Ctrl"}</Kbd>
							<Kbd className="bg-surface">F</Kbd>
						</>
					)}
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
};

export default SearchBar;
