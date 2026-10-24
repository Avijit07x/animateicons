"use client";

import { Button } from "@/components/ui/button";
import { FunnelXIcon } from "@/icons/lucide/funnel-x-icon";
import { useReview } from "../_contexts/ReviewContext";
import {
	KIND_OPTIONS,
	LIBRARY_OPTIONS,
	SIZE_OPTIONS,
	STATUS_OPTIONS,
} from "../_lib/filters";
import type { CountFilter, Filters, SetFilter } from "../_lib/types";
import SearchField from "./SearchField";
import Segmented from "./Segmented";

type Props = {
	filters: Filters;
	onChange: SetFilter;
	onReset: () => void;
	filtered: boolean;
	count: CountFilter;
	total: number;
};

const Divider = () => (
	<span
		aria-hidden="true"
		className="bg-divider/70 mx-6 hidden w-px self-stretch lg:block"
	/>
);

const FilterPanel: React.FC<Props> = ({
	filters,
	onChange,
	onReset,
	filtered,
	count,
	total,
}) => {
	const { size, setSize } = useReview();
	const digits = String(total).length;

	return (
		<div className="bg-surface flex flex-col gap-4 rounded-3xl p-4 lg:flex-row lg:items-end lg:gap-0 lg:p-5">
			<SearchField
				value={filters.query}
				onChange={(query) => onChange("query", query)}
				total={total}
				className="flex md:hidden"
			/>
			<Segmented
				label="Status"
				options={STATUS_OPTIONS}
				value={filters.status}
				onChange={(status) => onChange("status", status)}
				count={(status) => count("status", status)}
				digits={digits}
			/>
			<Divider />
			<Segmented
				label="Library"
				options={LIBRARY_OPTIONS}
				value={filters.library}
				onChange={(library) => onChange("library", library)}
				count={(library) => count("library", library)}
				digits={digits}
			/>
			<Divider />
			<Segmented
				label="Type"
				options={KIND_OPTIONS}
				value={filters.kind}
				onChange={(kind) => onChange("kind", kind)}
				count={(kind) => count("kind", kind)}
				digits={digits}
			/>
			<Segmented
				label="Preview size"
				options={SIZE_OPTIONS}
				value={size}
				onChange={setSize}
				className="lg:ml-auto"
			/>
			<Divider />
			<Button
				variant="secondary"
				onClick={onReset}
				disabled={!filtered}
				className="h-10 self-stretch lg:self-end"
			>
				<FunnelXIcon size={16} />
				Reset filters
			</Button>
		</div>
	);
};

export default FilterPanel;
