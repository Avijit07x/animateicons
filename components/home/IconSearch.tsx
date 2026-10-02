"use client";

import { MAX_SEARCH_LENGTH } from "@/app/icons/_contexts/IconSearchContext";
import IconLink from "@/components/IconLink";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { useTypewriter } from "@/hooks/useTypewriter";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { SearchIcon } from "@/icons/huge/search-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { searchIcons } from "@/lib/icon-search";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchResult from "./SearchResult";

const RESULT_COUNT = 6;
const WORDS = ["heart", "cart", "lock", "notification", "camera", "star"];
const SUGGESTIONS = ["heart", "cart", "lock", "camera"];

const IconSearch: React.FC = () => {
	const reduced = useReducedMotion();
	const sectionRef = useRef<HTMLElement | null>(null);
	const inView = useInView(sectionRef, { amount: 0.3 });
	const [typed, setTyped] = useState<string | null>(null);
	const auto = useTypewriter(WORDS, inView && typed === null && !reduced);
	const { ref: searchRef, triggerProps } = useIconHover();

	const query = typed ?? (reduced ? WORDS[0] : auto);
	const results = useMemo(() => searchIcons(query, RESULT_COUNT), [query]);
	const trimmed = query.trim();
	const noMatch = trimmed.length >= 2 && results.length === 0;

	useEffect(() => {
		if (typed === null && auto.length === 1)
			searchRef.current?.startAnimation();
	}, [auto, typed, searchRef]);

	return (
		<section
			ref={sectionRef}
			aria-label="Search icons"
			className="home-section"
		>
			<div className="mx-auto max-w-7xl px-6">
				<h2 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
					{ICON_COUNTS.total} icons.{" "}
					<span className="text-textMuted">
						Find yours in a keystroke
						<span className="text-primary">.</span>
					</span>
				</h2>
				<p className="text-textSecondary mx-auto mt-3.5 max-w-lg max-sm:text-[15px]">
					Every result already moves. Hover one.
				</p>

				<label
					{...triggerProps}
					className="bg-surfaceElevated focus-within:ring-primary/50 mx-auto mt-11 flex h-16 w-full max-w-xl items-center gap-3.5 rounded-full px-6 text-left transition-shadow focus-within:ring-2 max-sm:h-14 max-sm:px-5"
				>
					<SearchIcon ref={searchRef} size={22} color="var(--color-primary)" />
					<input
						type="text"
						value={query}
						onChange={(e) => setTyped(e.target.value)}
						onFocus={() => setTyped((t) => t ?? query)}
						placeholder={`Search ${ICON_COUNTS.total} icons`}
						aria-label="Search icons"
						maxLength={MAX_SEARCH_LENGTH}
						autoComplete="off"
						spellCheck={false}
						className="text-textPrimary placeholder:text-textMuted min-w-0 flex-1 bg-transparent text-lg focus:outline-none max-sm:text-base"
					/>
				</label>

				<div
					aria-live="polite"
					className="mx-auto mt-9 flex min-h-59 max-w-3xl flex-wrap content-start justify-center gap-x-4 gap-y-6 sm:min-h-32"
				>
					{results.map((entry, i) => (
						<SearchResult
							key={`${entry.library}-${entry.name}`}
							entry={entry}
							index={i}
						/>
					))}
					{noMatch && (
						<p className="text-textMuted text-sm">
							No icons match &ldquo;{trimmed}&rdquo;.
						</p>
					)}
				</div>

				<p className="text-textMuted mt-6 text-sm">
					Try
					{SUGGESTIONS.map((word) => (
						<button
							key={word}
							type="button"
							onClick={() => setTyped(word)}
							className="text-textSecondary hover:text-primary mx-1.5 underline underline-offset-4 transition-colors"
						>
							{word}
						</button>
					))}
				</p>

				<div className="mt-10">
					<IconLink
						href="/icons/lucide"
						prefetch={false}
						icon={ArrowRight02Icon}
						variant="secondary"
						size="pill"
					>
						See all {ICON_COUNTS.total}
					</IconLink>
				</div>
			</div>
		</section>
	);
};

export default IconSearch;
