"use client";

/**
 * CommandSearchTrigger
 *
 * The visible "search" affordance in the navbar. Two reasons it exists:
 *   1. Mobile users without a keyboard need a tappable entry point.
 *   2. Desktop users who don't know about Cmd+K get taught the shortcut
 *      via the trailing kbd hint.
 *
 * Clicks open the same palette that Cmd+K opens — single source of
 * truth for search state lives in CommandSearchProvider.
 */

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCommandSearch } from "./CommandSearchProvider";

const CommandSearchTrigger: React.FC = () => {
	const { open } = useCommandSearch();
	const [isMac, setIsMac] = useState(true);

	useEffect(() => {
		// Hint with the right modifier per OS. Default mac so SSR doesn't
		// hydrate-mismatch on the most common visitor.
		setIsMac(
			typeof navigator !== "undefined" &&
				/Mac|iPhone|iPad|iPod/.test(navigator.platform),
		);
	}, []);

	return (
		<button
			type="button"
			onClick={open}
			aria-label="Search icons"
			className={cn(
				"group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
				"border-border/60 from-surface to-surfaceElevated border bg-gradient-to-b",
				"text-textSecondary hover:text-textPrimary hover:border-primary/40",
				"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
			)}
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<span className="hidden sm:inline">Search icons</span>
			<Kbd className="hidden sm:inline-flex">{isMac ? "⌘K" : "Ctrl K"}</Kbd>
		</button>
	);
};

export default CommandSearchTrigger;
