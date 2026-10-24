import { useCallback, useReducer } from "react";
import { DEFAULT_FILTERS, isFiltered } from "../_lib/filters";
import type { FilterKey, Filters, SetFilter } from "../_lib/types";

type Action =
	| { [K in FilterKey]: { type: "set"; key: K; value: Filters[K] } }[FilterKey]
	| { type: "reset" };

const reducer = (state: Filters, action: Action): Filters =>
	action.type === "reset"
		? DEFAULT_FILTERS
		: { ...state, [action.key]: action.value };

export const useReviewFilters = () => {
	const [filters, dispatch] = useReducer(reducer, DEFAULT_FILTERS);

	const setFilter = useCallback<SetFilter>(
		(key, value) => dispatch({ type: "set", key, value } as Action),
		[],
	);

	const resetFilters = useCallback(() => dispatch({ type: "reset" }), []);

	return { filters, setFilter, resetFilters, filtered: isFiltered(filters) };
};
