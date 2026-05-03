/**
 * NpmSection — landing-page section dedicated to the @animateicons/react
 * npm package. Sits between Hero and the icon-libraries gallery to give
 * the npm path equal billing with the shadcn CLI route.
 *
 * Composition:
 *   - SectionHeader: short value prop
 *   - 50/50 grid: feature highlights on the left, install + usage code on the right
 *   - Two CTAs: View on npm, Read the docs
 *
 * Server component: renders shiki-highlighted code at build/request time so
 * we don't pay the cost of shipping shiki to the browser.
 */

import { BoxIcon } from "@/icons/lucide/box-icon";
import { LayersIcon } from "@/icons/lucide/layers-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { ZapIcon } from "@/icons/lucide/zap-icon";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { codeToHtml } from "shiki";
import NpmHighlightCard from "./NpmHighlightCard";
import NpmInstallTabs from "./NpmInstallTabs";
import Section from "./section/Section";
import SectionHeader from "./section/SectionHeader";

const HIGHLIGHTS = [
	{
		Icon: BoxIcon,
		title: "All 281 icons in one install",
		body: "Lucide and Huge libraries on scoped subpaths. No copy-paste, no per-icon registry calls.",
	},
	{
		Icon: LayersIcon,
		title: "Tree-shakeable",
		body: "ESM-first with sideEffects: false. Imported icons land in your bundle, the rest don't.",
	},
	{
		Icon: SparklesIcon,
		title: "RSC-ready",
		body: 'Every icon ships with a "use client" banner so Next.js App Router renders it correctly.',
	},
	{
		Icon: ZapIcon,
		title: "TypeScript-first",
		body: "Per-icon `*Handle` types and a shared `IconHandle` for ergonomic ref typing.",
	},
];

const INSTALL_CMDS = {
	npm: "npm i @animateicons/react",
	pnpm: "pnpm add @animateicons/react",
	bun: "bun add @animateicons/react",
} as const;

const USAGE_CODE = `import { BellRingIcon } from "@animateicons/react/lucide";

export function Notifications() {
  return <BellRingIcon size={24} color="#f45b48" />;
}`;

/** Shiki transparent-bg trick: the highlighted <pre> drops its own bg
 * so our card's surface color shows through. */
const SHIKI_RESET = "[&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-0!";

/** Glass card surface — shared by highlight tiles and code blocks so the
 * NpmSection reads as one cohesive treatment. */
const GLASS_CARD = cn(
	"relative overflow-hidden rounded-2xl",
	"border-border/60 border",
	"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
);

const NpmSection = async () => {
	const [npmHtml, pnpmHtml, bunHtml, usageHtml] = await Promise.all([
		codeToHtml(INSTALL_CMDS.npm, {
			lang: "bash",
			theme: "github-dark-default",
		}),
		codeToHtml(INSTALL_CMDS.pnpm, {
			lang: "bash",
			theme: "github-dark-default",
		}),
		codeToHtml(INSTALL_CMDS.bun, {
			lang: "bash",
			theme: "github-dark-default",
		}),
		codeToHtml(USAGE_CODE, { lang: "tsx", theme: "github-dark-default" }),
	]);

	return (
		<Section id="npm-package" aria-labelledby="npm-package-heading">
			<SectionHeader
				title="Now on npm"
				subtitle="Install the entire library with one command. Tree-shakeable, RSC-ready, TypeScript-first."
				spacing="tight"
			/>

			<div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
				<ul className="grid h-full min-w-0 gap-4 sm:grid-cols-2 sm:gap-5">
					{HIGHLIGHTS.map(({ Icon, title, body }) => (
						<NpmHighlightCard
							key={title}
							Icon={Icon}
							title={title}
							body={body}
						/>
					))}
				</ul>

				<div className="flex min-w-0 flex-col gap-4">
					<NpmInstallTabs
						highlightedByPm={{
							npm: npmHtml,
							pnpm: pnpmHtml,
							bun: bunHtml,
						}}
						commandsByPm={INSTALL_CMDS}
					/>

					<div className={GLASS_CARD}>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
						/>
						<div className="border-border/40 text-textSecondary flex items-center justify-between gap-2 border-b px-3 py-2 text-[10px] tracking-wide uppercase sm:px-4 sm:text-[11px]">
							<span>Usage</span>
							<span className="text-textMuted truncate">Notifications.tsx</span>
						</div>
						<div
							className={`overflow-x-auto px-3 py-3 text-xs leading-relaxed sm:px-4 sm:text-sm ${SHIKI_RESET}`}
							dangerouslySetInnerHTML={{ __html: usageHtml }}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-2 pt-1 sm:gap-3">
						<Link
							href="https://www.npmjs.com/package/@animateicons/react"
							target="_blank"
							rel="noopener noreferrer"
							className="group from-primary to-primary/85 ring-primary-foreground/15 relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-b px-4 py-2 text-sm font-semibold text-(--cta-text) shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 transition-all duration-200 ring-inset hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_14px_36px_-8px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:brightness-110 active:scale-[0.98] sm:px-5"
						>
							{/* Subtle top-edge highlight, like a glass bevel */}
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-5 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
							/>
							View on npm
							<ArrowRight
								className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
								aria-hidden="true"
							/>
						</Link>
						<Link
							href="/icons/docs#install-npm"
							className="text-textPrimary hover:text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4"
						>
							Read the docs
						</Link>
					</div>
				</div>
			</div>
		</Section>
	);
};

export default NpmSection;
