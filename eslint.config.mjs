import next from "eslint-config-next";
import iconStructure from "./eslint-rules/icon-structure.mjs";

const config = [
	{
		ignores: [
			".next/**",
			"out/**",
			"**/dist/**",
			"coverage/**",
			"**/*.generated.ts",
			"**/src/generated/**",
			"angular/.angular/**",
			"test-zone/test-results/**",
			"test-zone/playwright-report/**",
			"public/**",
			".claude/**",
			".claude-flow/**",
			".agents/**",
			".swarm/**",
			".hive-mind/**",
		],
	},
	...next,

	{
		rules: {
			eqeqeq: ["error", "smart"],
			"no-var": "error",
			"no-debugger": "error",
			"prefer-const": "error",
		},
	},

	{
		files: ["app/**", "components/**", "hooks/**", "icons/**", "lib/**"],
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
		},
	},

	{
		files: ["vanilla/**", "vue/**", "angular/**"],
		rules: { "react-hooks/rules-of-hooks": "off" },
	},

	{
		files: ["icons/**/*.tsx"],
		plugins: { animateicons: { rules: { "icon-structure": iconStructure } } },
		rules: { "animateicons/icon-structure": "error" },
	},
];

export default config;
