import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest config for the AnimateIcons test suite — kept independent of
 * the Next build pipeline so `pnpm test` doesn't go through Turbopack.
 * `jsdom` env is needed because most tests render real AnimateIcons
 * React components.
 */
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.{test,spec}.{ts,tsx}"],
		css: false,
		clearMocks: true,
		restoreMocks: true,
	},
});
