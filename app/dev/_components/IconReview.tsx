"use client";

import { useCallback, useMemo } from "react";
import { ReviewProvider } from "../_contexts/ReviewContext";
import { useReviewFilters } from "../_hooks/useReviewFilters";
import { groupByFamily } from "../_lib/families";
import { countMatches, matchesFilters } from "../_lib/filters";
import type { CountFilter, IconChange } from "../_lib/types";
import FilterPanel from "./FilterPanel";
import ReviewHeader from "./ReviewHeader";
import ReviewResults from "./ReviewResults";

type Props = {
	changes: IconChange[];
	branch: string;
};

const IconReview: React.FC<Props> = ({ changes, branch }) => {
	const { filters, setFilter, resetFilters, filtered } = useReviewFilters();

	const visible = useMemo(
		() => changes.filter((change) => matchesFilters(change, filters)),
		[changes, filters],
	);

	const groups = useMemo(() => groupByFamily(visible), [visible]);

	const count = useCallback<CountFilter>(
		(key, value) => countMatches(changes, filters, key, value),
		[changes, filters],
	);

	const fresh = changes.filter((change) => change.isNew).length;
	const unstaged = changes.filter((change) => change.unstaged).length;

	return (
		<ReviewProvider>
			<div className="bg-bgDark flex min-h-dvh w-full flex-col">
				<ReviewHeader
					query={filters.query}
					onQueryChange={(query) => setFilter("query", query)}
					total={changes.length}
					visible={visible.length}
				/>

				<main className="mx-auto flex w-full max-w-384 flex-1 flex-col gap-8 px-4 pt-8 pb-16 lg:px-6">
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<h1 className="text-textPrimary text-2xl font-semibold text-balance">
								Changed icons
							</h1>
							<p className="text-textMuted text-sm">
								{changes.length} icons with uncommitted changes on{" "}
								<span className="text-textSecondary font-mono">{branch}</span>:{" "}
								{fresh} new, {changes.length - fresh} changed, {unstaged} not
								staged. Hover a card to play it.
							</p>
						</div>

						<FilterPanel
							filters={filters}
							onChange={setFilter}
							onReset={resetFilters}
							filtered={filtered}
							count={count}
							total={changes.length}
						/>
					</div>

					<ReviewResults total={changes.length} groups={groups} />
				</main>
			</div>
		</ReviewProvider>
	);
};

export default IconReview;
