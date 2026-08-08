"use client";

import { useIconInView } from "@/hooks/useIconInView";
import { AlarmClockIcon } from "@/icons/lucide/alarm-clock-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * InstallSection - the closing "system" section: the live animated specimen
 * (the icon dissected) on the left as proof of the motion, and the one-line
 * install with a usage snippet and spec checklist on the right. Merges the
 * old Anatomy + Install into one moment: what makes it move, and how to get it.
 */

const METHODS = [
	{ id: "npm", cmd: "npm i @animateicons/react" },
	{ id: "pnpm", cmd: "pnpm add @animateicons/react" },
	{ id: "bun", cmd: "bun add @animateicons/react" },
	{
		id: "shadcn",
		cmd: "npx shadcn@latest add https://animateicons.in/r/bell-ring",
	},
] as const;

const POINTS = [
	"Animated at the path level, never a flat transform",
	"Tree-shakeable, sideEffects false",
	"RSC-ready with typed, imperative handles",
	"Reduced-motion aware out of the box",
];

const InstallSection: React.FC = () => {
	const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("npm");
	const [copied, setCopied] = useState(false);
	const active = METHODS.find((m) => m.id === method) ?? METHODS[0];
	const { wrapRef, iconRef } = useIconInView<HTMLDivElement>({
		loop: true,
		loopMs: 2200,
	});

	const copy = () => {
		navigator.clipboard?.writeText(active.cmd).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		});
	};

	return (
		<section aria-label="Install" className="border-border/60 border-t">
			<div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
					<span className="text-primary">05</span> / Install
				</p>
				<h2 className="text-textPrimary mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
					One import. The whole system<span className="text-primary">.</span>
				</h2>
				<p className="text-textSecondary mt-4 max-w-xl text-base leading-relaxed">
					Every icon animates at the path level and ships in one tree-shakeable
					package. See what makes it move, then grab it in a line.
				</p>

				<div className="mt-14 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
					{/* Left: the animated specimen + links */}
					<div className="flex h-full min-w-0 flex-col justify-between gap-8">
						<SpecimenFrame
							label="Specimen"
							index="alarm-clock"
							footLeft="path-animated"
							footRight="motion/react"
							crosshair
							className="w-full grow"
							innerClassName="relative h-full"
						>
							<div
								ref={wrapRef}
								className="text-primary flex h-full min-h-72 w-full items-center justify-center"
							>
								<AlarmClockIcon ref={iconRef} size={176} />
							</div>
						</SpecimenFrame>

						<div className="flex items-center gap-6">
							<Link
								href="https://www.npmjs.com/package/@animateicons/react"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-textPrimary inline-flex items-center gap-1 text-sm font-semibold"
							>
								View on npm
								<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
							<Link
								href="/icons/docs"
								className="text-textSecondary hover:text-textPrimary text-sm font-medium transition-colors"
							>
								Read the docs
							</Link>
						</div>
					</div>

					{/* Right: install terminal + spec checklist */}
					<div className="flex h-full min-w-0 flex-col gap-8">
						<div className="border-border bg-surface/60 overflow-hidden rounded-xl border">
							<div className="border-border/60 flex items-center justify-between border-b px-4 py-2.5">
								<div className="flex gap-1.5">
									{METHODS.map((m) => (
										<button
											key={m.id}
											type="button"
											onClick={() => setMethod(m.id)}
											className={
												m.id === method
													? "text-primary bg-surfaceElevated rounded-md px-2.5 py-1 font-mono text-xs"
													: "text-textMuted hover:text-textSecondary rounded-md px-2.5 py-1 font-mono text-xs transition-colors"
											}
										>
											{m.id}
										</button>
									))}
								</div>
								<button
									type="button"
									onClick={copy}
									aria-label="Copy install command"
									className="text-textMuted hover:text-primary transition-colors"
								>
									{copied ? (
										<Check className="text-success size-4" />
									) : (
										<Copy className="size-4" />
									)}
								</button>
							</div>

							<div className="px-5 py-5">
								<code className="text-textPrimary block font-mono text-sm break-all">
									<span className="text-textMuted select-none">$ </span>
									{active.cmd}
								</code>
							</div>

							<div className="border-border/60 border-t px-5 py-5">
								<pre className="font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap sm:text-xs">
									<code className="text-textSecondary">
										<span className="text-primary">import</span> {"{ "}
										<span className="text-textPrimary">BellRingIcon</span>
										{" }"} <span className="text-primary">from</span>{" "}
										<span className="text-success">
											&quot;@animateicons/react/lucide&quot;
										</span>
										{"\n\n"}
										<span className="text-primary">export</span>{" "}
										<span className="text-primary">function</span>{" "}
										<span className="text-textPrimary">Bell</span>() {"{"}
										{"\n  "}
										<span className="text-primary">return</span> {"<"}
										<span className="text-textPrimary">BellRingIcon</span>{" "}
										<span className="text-textSecondary">size</span>={"{28}"}{" "}
										{"/>"}
										{"\n"}
										{"}"}
									</code>
								</pre>
							</div>
						</div>

						<div className="mt-auto">
							<p className="text-textMuted font-mono text-[11px] tracking-[0.2em] uppercase">
								What you get
							</p>
							<ul className="divide-border/60 mt-5 divide-y">
								{POINTS.map((p) => (
									<li
										key={p}
										className="group text-textSecondary flex items-center gap-3 py-3 text-sm first:pt-0"
									>
										<Check className="text-primary/70 group-hover:text-primary size-4 shrink-0 transition-colors" />
										{p}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				<p className="text-textMuted mt-10 font-mono text-[10px] tracking-widest uppercase">
					{ICON_COUNTS.total} icons · {ICON_COUNTS.lucide} lucide ·{" "}
					{ICON_COUNTS.huge} huge
				</p>
			</div>
		</section>
	);
};

export default InstallSection;
