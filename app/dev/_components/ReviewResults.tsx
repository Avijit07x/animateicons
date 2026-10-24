"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useReview } from "../_contexts/ReviewContext";
import { LIBRARY_NAMES } from "../_lib/families";
import type { LibraryGroup } from "../_lib/types";
import EmptyState from "./EmptyState";
import FamilyNav from "./FamilyNav";
import FamilySection, { CARD_GRID_CLASS } from "./FamilySection";

type Props = {
	total: number;
	groups: LibraryGroup[];
};

const ReviewResults: React.FC<Props> = ({ total, groups }) => {
	const { ready } = useReview();

	if (total === 0) {
		return (
			<EmptyState
				title="Nothing to review"
				text="Every icon is committed. New or edited icons show up here as soon as you save them."
			/>
		);
	}

	if (groups.length === 0) {
		return (
			<EmptyState
				title="No icons match these filters"
				text="Try another status, library or type, or reset the filters."
			/>
		);
	}

	if (!ready) {
		return (
			<div className={CARD_GRID_CLASS}>
				{Array.from({ length: 18 }, (_, i) => (
					<Skeleton key={i} className="bg-surface h-45 rounded-3xl" />
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
			<FamilyNav groups={groups} />
			<div className="flex min-w-0 flex-col gap-12">
				{groups.map(({ library, families }) => (
					<div key={library} className="flex flex-col gap-8">
						{groups.length > 1 && (
							<h2 className="text-textPrimary px-1 text-lg font-semibold">
								{LIBRARY_NAMES[library]}
							</h2>
						)}
						{families.map((family) => (
							<FamilySection key={family.id} group={family} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewResults;
