/**
 * Vitest setup for the AnimateIcons test suite — runs once before
 * tests load.
 *
 *  - Adds @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 *  - Polyfills matchMedia so motion/react's useReducedMotion (used by
 *    every AnimateIcons component) doesn't crash in jsdom.
 *  - Cleans the DOM between tests so AnimateIcons rendered in one test
 *    don't leak into the next.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
	cleanup();
});

if (typeof window !== "undefined" && !window.matchMedia) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}),
	});
}
