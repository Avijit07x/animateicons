import next from "eslint-config-next";
import iconStructure from "./eslint-rules/icon-structure.mjs";

/** Flat config. `eslint-config-next` bundles the recommended Next/React/TS
 * rules; on top we add ignores, a few baseline codebase rules, and one
 * custom rule that keeps every icon on the same structure + animation flow. */
const config = [
	{
		ignores: [
			".next/**",
			"out/**",
			"**/dist/**",
			"coverage/**",
			"**/*.generated.ts",
			"public/**",
			// Local, gitignored agent tooling - never committed, so not ours to lint.
			".claude/**",
			".claude-flow/**",
			".agents/**",
			".swarm/**",
			".hive-mind/**",
		],
	},
	...next,

	// Baseline rules for the whole codebase.
	{
		rules: {
			eqeqeq: ["error", "smart"],
			"no-var": "error",
			"no-debugger": "error",
			"prefer-const": "error",
		},
	},

	// App/UI code shouldn't ship stray console.log (warn/error are fine).
	// CLI and build scripts legitimately log, so they're excluded.
	{
		files: ["app/**", "components/**", "hooks/**", "icons/**", "lib/**"],
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},

	// Every icon must follow the shared structure + animation flow.
	{
		files: ["icons/**/*.tsx"],
		plugins: { animateicons: { rules: { "icon-structure": iconStructure } } },
		rules: { "animateicons/icon-structure": "error" },
	},
];

export default config;
