"use client";

import { Kbd } from "@/components/ui/kbd";
import { useIsMac } from "@/hooks/useIsMac";
import { useRef } from "react";
import { SearchIcon, SearchIconHandle } from "../../icons/huge/search-icon";
import handleHover from "../../utils/handleHover";
import { useCommandSearch } from "./CommandSearchProvider";

const CommandSearchTrigger: React.FC = () => {
	const { open } = useCommandSearch();
	const iconRef = useRef<SearchIconHandle>(null);
	const isMac = useIsMac();

	return (
		<button
			type="button"
			onClick={open}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			aria-label="Search icons"
			className="pill-link bg-surfaceElevated hover:bg-surfaceActive px-4 py-2 text-xs"
		>
			<SearchIcon ref={iconRef} className="size-3.5" />
			<span className="hidden sm:inline">Search icons</span>
			<Kbd className="hidden rounded-full bg-white/10 px-2 sm:inline-flex">
				{isMac ? "⌘K" : "Ctrl K"}
			</Kbd>
		</button>
	);
};

export default CommandSearchTrigger;
