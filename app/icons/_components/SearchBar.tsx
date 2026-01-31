"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { ICON_COUNT } from "@/icons/lucide";
import { SearchIcon } from "lucide-react";
import React, { SetStateAction, useEffect, useRef } from "react";
const isMac =
	typeof navigator !== "undefined" &&
	/Mac|iPhone|iPad|iPod/i.test(navigator.platform);

type Props = {
	query: string;
	setQuery: React.Dispatch<SetStateAction<string>>;
};

const SearchBar: React.FC<Props> = ({ setQuery, query }) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "f") {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="flex w-full max-w-xs">
			<InputGroup className="border-border bg-surfaceElevated rounded-full">
				<InputGroupInput
					ref={inputRef}
					value={query}
					placeholder={`Search ${ICON_COUNT} icons...`}
					onChange={(e) => setQuery(e.target.value)}
					className="pr-20 text-white"
				/>
				<InputGroupAddon>
					<SearchIcon className="text-textMuted size-4" />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end" className="gap-1">
					<Kbd className="bg-surface">⌘</Kbd>
					<Kbd className="bg-surface">F</Kbd>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
};

export default SearchBar;
