"use client";

/**
 * CommandSearch
 *
 * The Cmd+K palette modal. Centered glass panel, fuzzy-searches across
 * every icon in both libraries (Lucide + Huge), supports full keyboard
 * navigation:
 *
 *   - Type to filter (debounced via useMemo, no extra state machine)
 *   - ↑ / ↓ — move selection
 *   - Enter — open the selected icon's detail page
 *   - Esc — close the palette
 *
 * Results are capped at MAX_RESULTS for performance — 281 icons is
 * fine to filter, but rendering 281 motion components with hover
 * handlers is not. Limit is generous enough that any real query
 * narrows long before hitting it.
 */

import { Kbd } from "@/components/ui/kbd";
import { ICON_LIST as HUGE_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_LIST } from "@/icons/lucide";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CommandSearchItem, { type CommandSearchIcon } from "./CommandSearchItem";

const MAX_RESULTS = 40;

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

/** Build a single flat icon catalog the first time the module loads.
 *  Both libraries combined; library tag preserved for the badge column
 *  and the navigation target. */
const ALL_ICONS: CommandSearchIcon[] = [
	...LUCIDE_LIST.map((i) => ({
		name: i.name,
		library: "lucide" as const,
		component: i.icon,
		keywords: i.keywords,
	})),
	...HUGE_LIST.map((i) => ({
		name: i.name,
		library: "huge" as const,
		component: i.icon,
		keywords: i.keywords,
	})),
];

/** Fuse instance is module-level so it doesn't rebuild on every modal
 *  open. ~286 items, indexed once, reused across opens. */
const FUSE = new Fuse(ALL_ICONS, {
	keys: [
		{ name: "name", weight: 0.85 },
		{ name: "keywords", weight: 0.15 },
	],
	threshold: 0.3,
	ignoreLocation: true,
	minMatchCharLength: 2,
	includeScore: true,
});

const CommandSearch: React.FC<Props> = ({ isOpen, onClose }) => {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const router = useRouter();

	// Filter + rank. Empty query → first MAX_RESULTS icons (alphabetical
	// from the source). Otherwise: prefix matches first, then fuse.
	const results = useMemo<CommandSearchIcon[]>(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return ALL_ICONS.slice(0, MAX_RESULTS);

		const exact: CommandSearchIcon[] = [];
		const startsWith: CommandSearchIcon[] = [];
		const contains: CommandSearchIcon[] = [];

		for (const icon of ALL_ICONS) {
			const name = icon.name.toLowerCase();
			if (name === q) exact.push(icon);
			else if (name.startsWith(q)) startsWith.push(icon);
			else if (name.includes(q)) contains.push(icon);
		}

		const fuseHits = FUSE.search(q)
			.filter((r) => (r.score ?? 1) < 0.4)
			.map((r) => r.item);

		const seen = new Set<string>();
		const merged: CommandSearchIcon[] = [];
		for (const list of [exact, startsWith, contains, fuseHits]) {
			for (const icon of list) {
				const key = `${icon.library}-${icon.name}`;
				if (!seen.has(key)) {
					seen.add(key);
					merged.push(icon);
					if (merged.length >= MAX_RESULTS) return merged;
				}
			}
		}
		return merged;
	}, [query]);

	// Reset selection when the result list changes so the highlight
	// always points at the top match instead of an out-of-bounds index.
	useEffect(() => {
		setSelected(0);
	}, [query]);

	// Reset state and refocus when the palette opens.
	useEffect(() => {
		if (!isOpen) return;
		setQuery("");
		setSelected(0);
		// Microtask so the input exists in the DOM before we focus it.
		const id = requestAnimationFrame(() => inputRef.current?.focus());
		return () => cancelAnimationFrame(id);
	}, [isOpen]);

	// Lock body scroll while open.
	useEffect(() => {
		if (!isOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [isOpen]);

	const navigateTo = (icon: CommandSearchIcon) => {
		router.push(`/icons/${icon.library}/${icon.name}`);
		onClose();
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			e.preventDefault();
			onClose();
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelected((s) => Math.min(s + 1, results.length - 1));
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelected((s) => Math.max(s - 1, 0));
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			const target = results[selected];
			if (target) navigateTo(target);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="cmdk-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					onClick={onClose}
					onKeyDown={onKeyDown}
					role="dialog"
					aria-modal="true"
					aria-label="Search icons"
					className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-sm"
				>
					<motion.div
						key="cmdk-panel"
						initial={{ opacity: 0, scale: 0.96, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: -8 }}
						transition={{ type: "spring", stiffness: 480, damping: 36 }}
						onClick={(e) => e.stopPropagation()}
						className={cn(
							"relative w-full max-w-xl overflow-hidden rounded-2xl",
							"border-border/60 from-surface to-surfaceElevated border bg-gradient-to-b",
							"shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_80px_-30px_rgba(0,0,0,0.85)]",
						)}
					>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
						/>

						<div className="border-border/40 flex items-center gap-3 border-b px-4 py-3">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-textMuted shrink-0"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.3-4.3" />
							</svg>
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search icons by name or keyword…"
								className="text-textPrimary placeholder:text-textMuted flex-1 bg-transparent text-sm outline-none"
								autoComplete="off"
								spellCheck={false}
							/>
							<Kbd className="hidden sm:inline-flex">Esc</Kbd>
						</div>

						<div
							role="listbox"
							aria-label="Icon results"
							className="max-h-[50vh] space-y-0.5 overflow-y-auto p-2"
						>
							{results.length === 0 ? (
								<div className="text-textSecondary px-3 py-8 text-center text-sm">
									No icons match{" "}
									<span className="text-textPrimary font-mono">"{query}"</span>
								</div>
							) : (
								results.map((icon, i) => (
									<CommandSearchItem
										key={`${icon.library}-${icon.name}`}
										item={icon}
										isSelected={i === selected}
										onSelect={() => navigateTo(icon)}
										onHover={() => setSelected(i)}
									/>
								))
							)}
						</div>

						<div className="border-border/40 text-textMuted flex items-center justify-between gap-3 border-t px-4 py-2 text-[11px]">
							<div className="flex items-center gap-3">
								<span className="inline-flex items-center gap-1.5">
									<Kbd>↑↓</Kbd> navigate
								</span>
								<span className="inline-flex items-center gap-1.5">
									<Kbd>↵</Kbd> open
								</span>
							</div>
							<span>
								{results.length} of {ALL_ICONS.length}
							</span>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CommandSearch;
