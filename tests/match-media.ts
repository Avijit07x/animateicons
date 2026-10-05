import { vi } from "vitest";

export const mockMediaQuery = (query: string, initial = false) => {
	let matches = initial;
	const listeners = new Set<() => void>();
	const original = window.matchMedia;

	window.matchMedia = vi.fn((media: string) => ({
		matches: media === query ? matches : false,
		media,
		onchange: null,
		addEventListener: (_type: string, listener: () => void) => {
			if (media === query) listeners.add(listener);
		},
		removeEventListener: (_type: string, listener: () => void) => {
			listeners.delete(listener);
		},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	})) as unknown as typeof window.matchMedia;

	return {
		set: (next: boolean) => {
			matches = next;
			listeners.forEach((listener) => listener());
		},
		listenerCount: () => listeners.size,
		restore: () => {
			window.matchMedia = original;
		},
	};
};
