import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
		dedupe: ["react", "react-dom"],
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.{test,spec}.{ts,tsx}"],
		css: false,
		clearMocks: true,
		restoreMocks: true,
		coverage: {
			provider: "v8",
			reporter: ["text-summary", "html"],
			include: ["lib/**", "utils/**", "scripts/**"],
			exclude: ["**/*.d.ts", "**/*.generated.ts"],
		},
	},
});
