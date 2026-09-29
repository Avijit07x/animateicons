const config = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"perf",
				"chore",
				"docs",
				"refactor",
				"test",
				"ci",
				"build",
				"revert",
			],
		],
		"subject-case": [0],
		"body-max-line-length": [0],
		"footer-max-line-length": [0],
	},
};

export default config;
