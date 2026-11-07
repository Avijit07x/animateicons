import { useCallback, useSyncExternalStore } from "react";

export function useStoredPreference<T extends string>(
	key: string,
	fallback: T,
	isValid: (v: string | null) => v is T,
): [T, (value: T) => void] {
	const subscribe = useCallback(
		(cb: () => void) => {
			const onStorage = (e: StorageEvent) => {
				if (e.key === key) cb();
			};
			window.addEventListener("storage", onStorage);
			return () => window.removeEventListener("storage", onStorage);
		},
		[key],
	);

	const value = useSyncExternalStore(
		subscribe,
		() => {
			try {
				const v = localStorage.getItem(key);
				return isValid(v) ? v : fallback;
			} catch {
				return fallback;
			}
		},
		() => fallback,
	);

	const setValue = useCallback(
		(next: T) => {
			try {
				localStorage.setItem(key, next);
			} catch {}
			window.dispatchEvent(new StorageEvent("storage", { key }));
		},
		[key],
	);

	return [value, setValue];
}
