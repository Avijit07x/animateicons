import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse)";

const subscribe = (callback: () => void) => {
	const mql = window.matchMedia(QUERY);
	mql.addEventListener("change", callback);
	return () => mql.removeEventListener("change", callback);
};

export const useCoarsePointer = () =>
	useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false,
	);
