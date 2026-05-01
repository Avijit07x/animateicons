"use client";

/**
 * CmdSection — install command surface in Hero.
 *
 * Two distribution methods supported:
 *   - shadcn CLI: copies an icon's source into the consumer's project
 *   - npm package: installs @animateicons/react via the package manager
 *
 * The user picks the method via the toggle row above the CodeBlock;
 * the tabs[] swap to match. Default: npm.
 *
 * Pill styling matches IconLibrariesSection — glass surface, primary
 * text on the active option, soft inner ring instead of a solid fill.
 */

import { motion } from "motion/react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./ui/code-block";

type Method = "shadcn" | "npm";

const SHADCN_TABS = [
	{
		label: "npm",
		code: "npx shadcn@latest add https://animateicons.in/r/",
		language: "bash" as const,
	},
	{
		label: "pnpm",
		code: "pnpm dlx shadcn@latest add https://animateicons.in/r/",
		language: "bash" as const,
	},
	{
		label: "bun",
		code: "bunx --bun shadcn@latest add https://animateicons.in/r/",
		language: "bash" as const,
	},
];

const NPM_TABS = [
	{
		label: "npm",
		code: "npm i @animateicons/react",
		language: "bash" as const,
	},
	{
		label: "pnpm",
		code: "pnpm add @animateicons/react",
		language: "bash" as const,
	},
	{
		label: "bun",
		code: "bun add @animateicons/react",
		language: "bash" as const,
	},
];

const METHOD_OPTIONS: { value: Method; label: string; hint: string }[] = [
	{ value: "npm", label: "npm package", hint: "Install all 281 at once" },
	{ value: "shadcn", label: "shadcn CLI", hint: "Per-icon, owns the source" },
];

const CmdSection: React.FC = () => {
	const [method, setMethod] = useState<Method>("npm");
	const tabs = method === "shadcn" ? SHADCN_TABS : NPM_TABS;

	return (
		<div className="flex w-full flex-col items-stretch gap-3 lg:max-w-170">
			<div
				role="tablist"
				aria-label="Install method"
				className={cn(
					"inline-flex self-center rounded-full p-1 text-xs",
					"border-border/80 from-surface to-surfaceElevated border bg-gradient-to-b",
					"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]",
					"backdrop-blur",
				)}
			>
				{METHOD_OPTIONS.map((opt) => {
					const active = method === opt.value;
					return (
						<button
							key={opt.value}
							role="tab"
							type="button"
							aria-selected={active}
							onClick={() => setMethod(opt.value)}
							className={cn(
								"relative inline-flex items-center rounded-full px-4 py-1.5 font-medium transition-colors",
								active
									? "text-primary"
									: "text-textSecondary hover:text-textPrimary",
							)}
							title={opt.hint}
						>
							{active && (
								<motion.span
									layoutId="cmd-method-pill"
									className="ring-primary/30 absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-inset"
									transition={{
										type: "spring",
										stiffness: 380,
										damping: 32,
									}}
								/>
							)}
							{opt.label}
						</button>
					);
				})}
			</div>

			<CodeBlock
				className="w-full text-start"
				tabs={tabs}
				withRotatingIcon={method === "shadcn"}
			/>
		</div>
	);
};

export default CmdSection;
