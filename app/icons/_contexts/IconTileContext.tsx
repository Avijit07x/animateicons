"use client";

/**
 * IconTileContext
 *
 * Holds the three tile-action UI states (code-copied, CLI-copied,
 * loading) for the AnimateIcons gallery grid. Architecture choices are
 * all aimed at perf — the Lucide AnimateIcons page renders 248+ tiles
 * simultaneously and a naive context implementation re-rendered every
 * tile on every copy click:
 *
 *  - useReducer, not three useStates — one render per logical update,
 *    not three (e.g. loading → fetched → copied is one transition).
 *  - State and dispatch live in separate contexts. AnimateIcons tiles
 *    that only dispatch don't re-render when state changes.
 *  - Provider value objects are memoized to prevent identity churn.
 *  - Selector hooks (`useIsCopiedCode(id)`) collapse the full state
 *    object to a single boolean at the consumer, keeping render diffs
 *    cheap. Components reading these hooks still re-render on context
 *    changes (React limitation without `use-context-selector`), so the
 *    AnimateIcons pattern is to keep these reads OUT of the heavy
 *    IconTile parent and INSIDE the small IconTileActions child that
 *    React.memo can shield from copy/load updates.
 */

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";

type State = {
	copiedCodeId: string | null;
	copiedCliId: string | null;
	loadingId: string | null;
};

type Action =
	| { type: "SET_COPIED_CODE"; id: string | null }
	| { type: "SET_COPIED_CLI"; id: string | null }
	| { type: "SET_LOADING"; id: string | null };

const INITIAL: State = {
	copiedCodeId: null,
	copiedCliId: null,
	loadingId: null,
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "SET_COPIED_CODE":
			return state.copiedCodeId === action.id
				? state
				: { ...state, copiedCodeId: action.id };
		case "SET_COPIED_CLI":
			return state.copiedCliId === action.id
				? state
				: { ...state, copiedCliId: action.id };
		case "SET_LOADING":
			return state.loadingId === action.id
				? state
				: { ...state, loadingId: action.id };
		default:
			return state;
	}
}

/** Stable handlers exposed via the dispatch context. */
type Dispatchers = {
	setCopiedCodeId: (id: string | null) => void;
	setCopiedCliId: (id: string | null) => void;
	setLoadingId: (id: string | null) => void;
};

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatchers | undefined>(undefined);

export const IconTileProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(reducer, INITIAL);

	// Stable function references — never re-created, so consumers that
	// only need dispatch never see the value object change identity.
	const setCopiedCodeId = useCallback(
		(id: string | null) => dispatch({ type: "SET_COPIED_CODE", id }),
		[],
	);
	const setCopiedCliId = useCallback(
		(id: string | null) => dispatch({ type: "SET_COPIED_CLI", id }),
		[],
	);
	const setLoadingId = useCallback(
		(id: string | null) => dispatch({ type: "SET_LOADING", id }),
		[],
	);

	const dispatchers = useMemo<Dispatchers>(
		() => ({ setCopiedCodeId, setCopiedCliId, setLoadingId }),
		[setCopiedCodeId, setCopiedCliId, setLoadingId],
	);

	return (
		<DispatchContext.Provider value={dispatchers}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</DispatchContext.Provider>
	);
};

const useTileState = (): State => {
	const ctx = useContext(StateContext);
	if (!ctx) {
		throw new Error(
			"useTileState/useIs* must be used within an IconTileProvider",
		);
	}
	return ctx;
};

export const useIconTileDispatch = (): Dispatchers => {
	const ctx = useContext(DispatchContext);
	if (!ctx) {
		throw new Error(
			"useIconTileDispatch must be used within an IconTileProvider",
		);
	}
	return ctx;
};

/** Selector hooks — narrow the read to a single boolean per consumer. */
export const useIsCopiedCode = (tileId: string): boolean =>
	useTileState().copiedCodeId === tileId;

export const useIsCopiedCli = (tileId: string): boolean =>
	useTileState().copiedCliId === tileId;

export const useIsLoading = (tileId: string): boolean =>
	useTileState().loadingId === tileId;

/**
 * Backwards-compatible aggregate hook. Prefer the selector hooks above
 * — this one re-renders on any field change.
 */
export const useIconTileState = () => {
	const state = useTileState();
	const dispatch = useIconTileDispatch();
	return { ...state, ...dispatch };
};
