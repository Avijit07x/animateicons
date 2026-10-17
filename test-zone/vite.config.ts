import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(ROOT, "..");
const ANGULAR = path.join(REPO, "angular", "dist", "fesm2022");

export default defineConfig({
	plugins: [react()],
	define: {
		__VUE_OPTIONS_API__: "true",
		__VUE_PROD_DEVTOOLS__: "false",
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
	},
	resolve: {
		alias: [
			{ find: /^@\//, replacement: `${REPO}/` },
			{
				find: /^@animateicons\/angular$/,
				replacement: path.join(ANGULAR, "animateicons-angular.mjs"),
			},
			{
				find: /^@animateicons\/angular\/(lucide|huge)$/,
				replacement: path.join(ANGULAR, "animateicons-angular-$1.mjs"),
			},
		],
		dedupe: [
			"react",
			"react-dom",
			"motion",
			"vue",
			"rxjs",
			"@angular/core",
			"@angular/common",
			"@angular/compiler",
			"@angular/platform-browser",
		],
	},
	css: {
		postcss: {},
	},
	build: {
		chunkSizeWarningLimit: 4096,
	},
	server: { port: 5174, strictPort: true },
	preview: { port: 4174, strictPort: true },
});
