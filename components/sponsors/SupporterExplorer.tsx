"use client";

/**
 * SupporterExplorer
 *
 * Client component for the /sponsors page. Owns the source filter
 * (All / Buy me a coffee / GitHub Sponsors) and renders the matching
 * grid of supporters. Data is fetched once on the server and passed
 * in as props — this component just slices it.
 *
 * Implements the WAI-ARIA Tabs pattern:
 *   - Roving tabindex (active tab = 0, others = -1)
 *   - ArrowLeft/ArrowRight cycle focus
 *   - Home/End jump to first/last
 *   - Tabpanel is labelled by the active tab
 */

import { GitHub } from "@/components/icons/Github";
import { cn } from "@/lib/utils";
import type { Supporter, SupporterSource } from "@/lib/supporters/types";
import { Coffee, Users } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import SupporterAvatar from "./SupporterAvatar";

type Filter = "all" | SupporterSource;

type Tab = {
	id: Filter;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
};

const TABS: readonly Tab[] = [
	{ id: "all", label: "All", Icon: Users },
	{ id: "bmc", label: "Buy me a coffee", Icon: Coffee },
	{ id: "github", label: "GitHub Sponsors", Icon: GitHub },
] as const;

const PANEL_ID = "supporters-panel";
const tabId = (id: Filter) => `supporters-tab-${id}`;

type Props = {
	supporters: Supporter[];
};

const SupporterExplorer: React.FC<Props> = ({ supporters }) => {
	const [filter, setFilter] = useState<Filter>("all");
	const tabRefs = useRef<Map<Filter, HTMLButtonElement | null>>(new Map());

	const counts = useMemo(
		() => ({
			all: supporters.length,
			bmc: supporters.filter((s) => s.source === "bmc").length,
			github: supporters.filter((s) => s.source === "github").length,
		}),
		[supporters],
	);

	const filtered = useMemo(
		() =>
			filter === "all"
				? supporters
				: supporters.filter((s) => s.source === filter),
		[filter, supporters],
	);

	const focusTab = useCallback((id: Filter) => {
		tabRefs.current.get(id)?.focus();
	}, []);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			const currentIdx = TABS.findIndex((t) => t.id === filter);
			if (currentIdx === -1) return;

			let nextIdx: number | null = null;
			switch (e.key) {
				case "ArrowRight":
					nextIdx = (currentIdx + 1) % TABS.length;
					break;
				case "ArrowLeft":
					nextIdx = (currentIdx - 1 + TABS.length) % TABS.length;
					break;
				case "Home":
					nextIdx = 0;
					break;
				case "End":
					nextIdx = TABS.length - 1;
					break;
			}

			if (nextIdx === null) return;
			e.preventDefault();
			const next = TABS[nextIdx].id;
			setFilter(next);
			focusTab(next);
		},
		[filter, focusTab],
	);

	return (
		<div className="space-y-6">
			<div
				role="tablist"
				aria-label="Filter supporters by source"
				className="flex flex-wrap gap-2"
			>
				{TABS.map(({ id, label, Icon }) => {
					const active = filter === id;
					return (
						<button
							key={id}
							ref={(el) => {
								tabRefs.current.set(id, el);
							}}
							id={tabId(id)}
							type="button"
							role="tab"
							aria-selected={active}
							aria-controls={PANEL_ID}
							tabIndex={active ? 0 : -1}
							onClick={() => setFilter(id)}
							onKeyDown={onKeyDown}
							className={cn(
								"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
								"focus-visible:ring-primary/40 focus-visible:outline-none focus-visible:ring-2",
								active
									? "border-primary/40 bg-primary/15 text-primary"
									: "border-border/60 hover:border-primary/40 text-textSecondary hover:text-textPrimary",
							)}
						>
							<Icon className="size-4" />
							<span>{label}</span>
							<span
								className={cn(
									"inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
									active
										? "bg-primary/20 text-primary"
										: "text-textMuted bg-white/5",
								)}
							>
								{counts[id]}
							</span>
						</button>
					);
				})}
			</div>

			<div
				id={PANEL_ID}
				role="tabpanel"
				aria-labelledby={tabId(filter)}
				tabIndex={0}
				className="focus-visible:outline-none"
			>
				{filtered.length === 0 ? (
					<EmptyState filter={filter} />
				) : (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((s) => (
							<SupporterAvatar key={s.id} supporter={s} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

const EMPTY_COPY: Record<Filter, { title: string; body: string }> = {
	all: {
		title: "No supporters yet",
		body: "Be the first — your name shows up here as soon as the page revalidates.",
	},
	bmc: {
		title: "No Buy me a coffee supporters yet",
		body: "Once someone tips, they'll appear here within an hour.",
	},
	github: {
		title: "No GitHub Sponsors yet",
		body: "Recurring sponsors will show up here automatically.",
	},
};

const EmptyState: React.FC<{ filter: Filter }> = ({ filter }) => {
	const { title, body } = EMPTY_COPY[filter];
	return (
		<div className="border-border/60 flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-gradient-to-b from-white/[0.02] to-transparent px-6 py-12 text-center">
			<p className="text-textPrimary text-sm font-medium">{title}</p>
			<p className="text-textMuted max-w-sm text-xs">{body}</p>
		</div>
	);
};

export default SupporterExplorer;
