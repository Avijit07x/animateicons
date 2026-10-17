import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const NODE_TESTS = "tests/scripts/icon-data.test.ts";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
		dedupe: ["react", "react-dom"],
	},
	test: {
		globals: true,
		projects: [
			{
				extends: true,
				test: {
					name: "dom",
					environment: "jsdom",
					setupFiles: ["./tests/setup.ts"],
					include: ["tests/**/*.{test,spec}.{ts,tsx}"],
					exclude: [NODE_TESTS],
				},
			},
			{
				extends: true,
				test: {
					name: "node",
					environment: "node",
					include: [NODE_TESTS],
				},
			},
		],
		css: false,
		testTimeout: 20_000,
		clearMocks: true,
		restoreMocks: true,
		coverage: {
			provider: "v8",
			reporter: ["text-summary", "html"],
			include: [
				"lib/**",
				"utils/**",
				"scripts/**",
				"hooks/**",
				"components/**/*.{ts,tsx}",
				"app/**/*.{ts,tsx}",
			],
			exclude: ["**/*.d.ts", "**/*.generated.ts"],
			thresholds: {
				statements: 45,
				branches: 44,
				functions: 43,
				lines: 46,
			},
		},
	},
});
