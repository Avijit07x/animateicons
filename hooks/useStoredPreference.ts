import { useCallback, useSyncExternalStore } from "react";

/**
 * Read/write a single localStorage-backed preference with an SSR-safe
 * default. Backed by useSyncExternalStore so the persisted value hydrates
 * without a setState-in-effect, and stays in sync across tabs.
 *
 * `isValid` narrows the raw string to the allowed union; anything else
 * (missing, corrupt, unavailable storage) falls back to `fallback`.
 */
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
			} catch {
				// ignore write failures (private mode, quota)
			}
			// The `storage` event only fires in other tabs; notify this one too.
			window.dispatchEvent(new StorageEvent("storage", { key }));
		},
		[key],
	);

	return [value, setValue];
}
