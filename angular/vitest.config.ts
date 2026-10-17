import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FESM = path.join(ROOT, "dist", "fesm2022");

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^@animateicons\/angular$/,
				replacement: path.join(FESM, "animateicons-angular.mjs"),
			},
			{
				find: /^@animateicons\/angular\/(lucide|huge)$/,
				replacement: path.join(FESM, "animateicons-angular-$1.mjs"),
			},
		],
	},
	test: {
		environment: "jsdom",
		include: ["__tests__/**/*.test.ts"],
	},
});
