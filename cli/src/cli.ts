import fs from "node:fs";
import path from "node:path";

import { MINIMAL_CN_SOURCE, type IconLibrary } from "@animateicons/core";
import { cac } from "cac";
import pc from "picocolors";

import { runAdd } from "./commands/add";
import { runInfo, runList, runSearch } from "./commands/query";
import {
	detectPackageManager,
	hasMotionDependency,
	installCommand,
	resolveUtilsImport,
} from "./util/project";

// Kept in sync with package.json by the release scripts.
const VERSION = "0.1.0";

interface GlobalOptions {
	registry?: string;
	cwd?: string;
	json?: boolean;
}

function resolveLibrary(value: unknown): IconLibrary | undefined {
	if (value === "lucide" || value === "huge") return value;
	if (value != null) {
		console.error(
			pc.red(`Unknown library "${String(value)}". Use lucide or huge.`),
		);
		process.exit(1);
	}
	return undefined;
}

function getCwd(opts: GlobalOptions): string {
	return opts.cwd ? path.resolve(opts.cwd) : process.cwd();
}

const cli = cac("animateicons");

cli
	.option("--registry <url>", "Registry base URL or local directory")
	.option("--cwd <dir>", "Run as if in this directory")
	.option("--json", "Output machine-readable JSON");

cli
	.command("add <...names>", "Add one or more icons to your project")
	.option("-d, --dir <dir>", "Target directory", {
		default: "components/icons",
	})
	.option("--overwrite", "Overwrite files that already exist")
	.option("--with-utils", "Scaffold a minimal lib/utils.ts `cn` if missing")
	.action(
		async (
			names: string[],
			options: GlobalOptions & {
				dir: string;
				overwrite?: boolean;
				withUtils?: boolean;
			},
		) => {
			const cwd = getCwd(options);
			const { utilsImport, hasUtils } = resolveUtilsImport(cwd);

			const outcome = await runAdd(names, {
				cwd,
				dir: options.dir,
				registryBase: options.registry,
				overwrite: options.overwrite,
				utilsImport,
			});

			if (options.json) {
				console.log(JSON.stringify(outcome, null, 2));
			} else {
				for (const a of outcome.added) {
					if (a.skipped) {
						console.log(
							pc.yellow(`• skipped ${a.registryName} `) +
								pc.dim(
									`(${path.relative(cwd, a.file)} exists - use --overwrite)`,
								),
						);
					} else {
						console.log(
							pc.green("✓ added ") +
								a.registryName +
								pc.dim(` → ${path.relative(cwd, a.file)}`),
						);
					}
				}
				for (const am of outcome.ambiguous) {
					console.log(
						pc.red(`✗ "${am.input}" is ambiguous.`) +
							` Use one of: ${am.options.join(", ")}`,
					);
				}
				for (const nf of outcome.notFound) {
					const hint = nf.suggestions.length
						? ` Did you mean: ${nf.suggestions.join(", ")}?`
						: "";
					console.log(pc.red(`✗ "${nf.input}" not found.`) + pc.dim(hint));
				}
			}

			const wroteSomething = outcome.added.some((a) => !a.skipped);

			// `cn` dependency notice (we only warn - never mutate an unknown setup).
			if (wroteSomething && !hasUtils) {
				if ((options as { withUtils?: boolean }).withUtils) {
					const utilsPath = path.join(cwd, "lib", "utils.ts");
					if (!fs.existsSync(utilsPath)) {
						fs.mkdirSync(path.dirname(utilsPath), { recursive: true });
						fs.writeFileSync(utilsPath, MINIMAL_CN_SOURCE, "utf8");
						console.log(
							pc.green("✓ created ") + pc.dim(path.relative(cwd, utilsPath)),
						);
					}
				} else {
					console.log(
						pc.dim(
							`\nIcons import \`cn\` from "${utilsImport}". If that doesn't exist, run with --with-utils or add a shadcn-style cn helper.`,
						),
					);
				}
			}

			// motion dependency notice.
			if (wroteSomething && !hasMotionDependency(cwd)) {
				const pm = detectPackageManager(cwd);
				console.log(
					pc.dim(`\nThese icons require motion. Install it with:\n  `) +
						installCommand(pm, "motion"),
				);
			}

			const failed = outcome.ambiguous.length + outcome.notFound.length;
			if (failed > 0) process.exit(1);
		},
	);

cli
	.command("search <query>", "Fuzzy-search icons by name, keyword, or category")
	.option("-l, --library <library>", "Filter by library (lucide | huge)")
	.option("--limit <n>", "Max results", { default: 20 })
	.action(
		async (
			query: string,
			options: GlobalOptions & { library?: string; limit?: number },
		) => {
			const results = await runSearch(query, {
				registryBase: options.registry,
				library: resolveLibrary(options.library),
				limit: Number(options.limit),
			});
			if (options.json) {
				console.log(JSON.stringify(results, null, 2));
				return;
			}
			if (results.length === 0) {
				console.log(pc.yellow(`No icons match "${query}".`));
				return;
			}
			for (const icon of results) {
				console.log(
					`${pc.cyan(icon.registryName.padEnd(28))} ${pc.dim(icon.category.join(", ") || "-")}`,
				);
			}
			console.log(
				pc.dim(
					`\n${results.length} result(s). Add one with: animateicons add <name>`,
				),
			);
		},
	);

cli
	.command("list", "List all icons")
	.option("-l, --library <library>", "Filter by library (lucide | huge)")
	.option("--limit <n>", "Max results")
	.action(
		async (options: GlobalOptions & { library?: string; limit?: number }) => {
			const results = await runList({
				registryBase: options.registry,
				library: resolveLibrary(options.library),
				limit: options.limit != null ? Number(options.limit) : undefined,
			});
			if (options.json) {
				console.log(JSON.stringify(results, null, 2));
				return;
			}
			for (const icon of results) console.log(icon.registryName);
			console.log(pc.dim(`\n${results.length} icon(s).`));
		},
	);

cli
	.command("info <name>", "Show metadata for a single icon")
	.action(async (name: string, options: GlobalOptions) => {
		const { icon, candidates } = await runInfo(name, {
			registryBase: options.registry,
		});
		if (options.json) {
			console.log(JSON.stringify({ icon, candidates }, null, 2));
			return;
		}
		if (!icon) {
			const hint = candidates.length
				? ` Did you mean: ${candidates.join(", ")}?`
				: "";
			console.log(pc.red(`"${name}" not found.`) + pc.dim(hint));
			process.exit(1);
		}
		console.log(pc.bold(icon.registryName));
		console.log(`  library   ${icon.library}`);
		console.log(`  name      ${icon.name}`);
		console.log(`  category  ${icon.category.join(", ") || "-"}`);
		console.log(`  keywords  ${icon.keywords.join(", ") || "-"}`);
		if (icon.addedAt) console.log(`  added     ${icon.addedAt}`);
		console.log(`  registry  ${icon.url}`);
		console.log(pc.dim(`\nAdd it with: animateicons add ${icon.name}`));
	});

cli.help();
cli.version(VERSION);

async function main() {
	try {
		cli.parse(process.argv, { run: false });
		await cli.runMatchedCommand();
	} catch (err) {
		console.error(pc.red(err instanceof Error ? err.message : String(err)));
		process.exit(1);
	}
}

main();
