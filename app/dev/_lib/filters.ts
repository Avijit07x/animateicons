import type { FilterKey, Filters, IconChange, PreviewSize } from "./types";

export const DEFAULT_FILTERS: Filters = {
	status: "all",
	library: "all",
	kind: "all",
	query: "",
};

export const STATUS_OPTIONS = [
	{ id: "all", label: "All" },
	{ id: "staged", label: "Staged" },
	{ id: "unstaged", label: "Not staged" },
] as const;

export const LIBRARY_OPTIONS = [
	{ id: "all", label: "All" },
	{ id: "lucide", label: "Lucide" },
	{ id: "huge", label: "Huge" },
] as const;

export const KIND_OPTIONS = [
	{ id: "all", label: "All" },
	{ id: "new", label: "New" },
	{ id: "changed", label: "Changed" },
] as const;

export const SIZE_OPTIONS = [
	{ id: "24", label: "24" },
	{ id: "32", label: "32" },
	{ id: "48", label: "48" },
] as const;

export const isPreviewSize = (value: string | null): value is PreviewSize =>
	SIZE_OPTIONS.some((option) => option.id === value);

export const matchesFilters = (change: IconChange, filters: Filters) =>
	(filters.status === "all" ||
		(filters.status === "staged" ? change.staged : change.unstaged)) &&
	(filters.library === "all" || change.library === filters.library) &&
	(filters.kind === "all" || change.isNew === (filters.kind === "new")) &&
	change.name.includes(filters.query.trim().toLowerCase());

export const countMatches = <K extends FilterKey>(
	changes: IconChange[],
	filters: Filters,
	key: K,
	value: Filters[K],
) =>
	changes.filter((change) =>
		matchesFilters(change, { ...filters, [key]: value }),
	).length;

export const isFiltered = (filters: Filters) =>
	(Object.keys(DEFAULT_FILTERS) as FilterKey[]).some(
		(key) => filters[key] !== DEFAULT_FILTERS[key],
	);
