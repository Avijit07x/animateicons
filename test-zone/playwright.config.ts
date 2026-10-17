import { defineConfig, devices } from "@playwright/test";

const PORT = 4174;

export default defineConfig({
	testDir: "e2e",
	timeout: 30 * 60 * 1000,
	reporter: "list",
	use: {
		...devices["Desktop Chrome"],
		baseURL: `http://localhost:${PORT}`,
	},
	webServer: {
		command: "pnpm run build && pnpm run preview",
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 5 * 60 * 1000,
	},
});
