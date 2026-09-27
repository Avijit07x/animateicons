"use client";

import { BlocksIcon } from "@/icons/lucide/blocks-icon";
import { BotIcon } from "@/icons/lucide/bot-icon";
import { PackageIcon } from "@/icons/lucide/package-icon";
import { TerminalIcon } from "@/icons/lucide/terminal-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * InstallSection - the closing section: every way to get the icons, side by
 * side in the page's hairline lattice. Package, shadcn, the CLI and the MCP
 * server each get a tile with a one-line pitch, the exact command to copy,
 * and a link to its docs. A facts strip closes the plate.
 */

type TileIcon = React.ComponentType<{
	size?: number;
	ref?: React.Ref<IconHandle>;
}>;

type Manager = "npm" | "pnpm" | "bun";

const MANAGERS: Record<Manager, string> = {
	npm: "npm i @animateicons/react",
	pnpm: "pnpm add @animateicons/react",
	bun: "bun add @animateicons/react",
};

const NPM_URL = "https://www.npmjs.com/package/@animateicons/react";

type Channel = {
	id: string;
	title: string;
	tag: string;
	blurb: string;
	command?: string;
	docs: string;
	Icon: TileIcon;
};

const CHANNELS = [
	{
		id: "package",
		title: "Package",
		tag: "Recommended",
		blurb: "One install, every icon. Tree-shakeable and fully typed.",
		docs: "/icons/docs#install-npm",
		Icon: PackageIcon,
	},
	{
		id: "shadcn",
		title: "shadcn",
		tag: "Own the source",
		blurb: "Copy a component into your repo and edit it like your own.",
		command:
			"npx shadcn@latest add https://animateicons.in/r/lu-bell-ring.json",
		docs: "/icons/docs/shadcn",
		Icon: BlocksIcon,
	},
	{
		id: "cli",
		title: "CLI",
		tag: "Browse & add",
		blurb: "Search the set in your terminal and drop in the source.",
		command: "npx animateicons browse",
		docs: "/icons/docs/cli",
		Icon: TerminalIcon,
	},
	{
		id: "mcp",
		title: "MCP",
		tag: "For AI agents",
		blurb: "Let Claude Code, Cursor and other agents add icons for you.",
		command: "claude mcp add animateicons -- npx -y @animateicons/mcp",
		docs: "/icons/docs/mcp",
		Icon: BotIcon,
	},
] as unknown as Channel[];

const FACTS = ["2 libraries", "motion bundled", "MIT licensed"];

const WAVE_STEP_MS = 120;
const TINT_MS = 600;

const InstallSection: React.FC = () => {
	const reduced = useReducedMotion();
	const [manager, setManager] = useState<Manager>("npm");
	const [copied, setCopied] = useState<string | null>(null);
	const gridRef = useRef<HTMLDivElement | null>(null);
	const iconWrapRefs = useRef<(HTMLSpanElement | null)[]>([]);
	const iconRefs = useRef<(IconHandle | null)[]>([]);

	// One pass across the tile icons when the section first scrolls in.
	useEffect(() => {
		if (reduced) return;
		const el = gridRef.current;
		if (!el) return;
		let timers: ReturnType<typeof setTimeout>[] = [];
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				io.disconnect();
				timers = CHANNELS.flatMap((_, i) => [
					setTimeout(() => {
						iconWrapRefs.current[i]?.setAttribute("data-active", "");
						iconRefs.current[i]?.startAnimation();
					}, i * WAVE_STEP_MS),
					setTimeout(
						() => iconWrapRefs.current[i]?.removeAttribute("data-active"),
						i * WAVE_STEP_MS + TINT_MS,
					),
				]);
			},
			{ threshold: 0.3 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			timers.forEach(clearTimeout);
		};
	}, [reduced]);

	const copy = (id: string, command: string) => {
		navigator.clipboard?.writeText(command).then(() => {
			setCopied(id);
			setTimeout(() => setCopied((cur) => (cur === id ? null : cur)), 1600);
		});
	};

	return (
		<section aria-label="Install" className="border-border/60 border-t">
			<div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
					<span className="text-primary">05</span> / Install
				</p>
				<h2 className="text-textPrimary mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
					Install it your way<span className="text-primary">.</span>
				</h2>
				<p className="text-textSecondary mt-4 max-w-xl text-base leading-relaxed">
					Same icons, same API. Take the package, own the source, or let your AI
					agent add them for you.
				</p>

				<SpecimenFrame className="mt-12">
					<div className="border-border/60 text-textMuted flex items-center justify-between border-b px-4 py-3 font-mono text-[10px] tracking-widest">
						<span className="uppercase">Channels</span>
						<span>{CHANNELS.length} ways to install</span>
					</div>

					<div
						ref={gridRef}
						className="bg-border/50 grid gap-px sm:grid-cols-2 lg:grid-cols-4"
					>
						{CHANNELS.map((c, i) => {
							const command = c.command ?? MANAGERS[manager];
							const isCopied = copied === c.id;

							return (
								<div
									key={c.id}
									onMouseEnter={() => iconRefs.current[i]?.startAnimation()}
									onMouseLeave={() => iconRefs.current[i]?.stopAnimation()}
									className="group bg-bgDark flex min-w-0 flex-col gap-4 p-5"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-center gap-3">
											<span
												ref={(el) => {
													iconWrapRefs.current[i] = el;
												}}
												className="text-textSecondary group-hover:text-primary data-active:text-primary flex size-9 shrink-0 items-center justify-center transition-colors duration-500"
											>
												<c.Icon
													ref={(el: IconHandle | null) => {
														iconRefs.current[i] = el;
													}}
													size={22}
												/>
											</span>
											<div>
												<p className="text-textPrimary text-sm font-semibold">
													{c.title}
												</p>
												<p className="text-textMuted font-mono text-[9px] tracking-widest uppercase">
													{c.tag}
												</p>
											</div>
										</div>

										{!c.command && (
											<div
												role="radiogroup"
												aria-label="Package manager"
												className="flex items-center gap-2 pt-1 font-mono text-[10px]"
											>
												{(Object.keys(MANAGERS) as Manager[]).map((m) => (
													<button
														key={m}
														type="button"
														role="radio"
														aria-checked={manager === m}
														onClick={() => setManager(m)}
														className={cn(
															"transition-colors",
															manager === m
																? "text-primary"
																: "text-textMuted hover:text-textPrimary",
														)}
													>
														{m}
													</button>
												))}
											</div>
										)}
									</div>

									<p className="text-textSecondary min-h-12 text-sm leading-relaxed">
										{c.blurb}
									</p>

									<div className="border-border/60 bg-surface/40 flex items-center gap-2 border px-3 py-2.5">
										<code className="text-textPrimary min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto font-mono text-xs leading-relaxed whitespace-nowrap [&::-webkit-scrollbar]:hidden">
											<span className="text-textMuted select-none">$ </span>
											{command}
										</code>
										<button
											type="button"
											onClick={() => copy(c.id, command)}
											aria-label={`Copy ${c.title} command`}
											className="text-textMuted hover:text-primary shrink-0 transition-colors"
										>
											{isCopied ? (
												<Check className="text-success size-3.5" />
											) : (
												<Copy className="size-3.5" />
											)}
										</button>
									</div>

									<div className="mt-auto flex items-center gap-5 font-mono text-[10px] tracking-widest uppercase">
										<Link
											href={c.docs}
											prefetch={false}
											className="text-textMuted hover:text-primary group/link inline-flex items-center gap-1 transition-colors"
										>
											Docs
											<ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
										</Link>
										{!c.command && (
											<Link
												href={NPM_URL}
												target="_blank"
												rel="noopener noreferrer"
												className="text-textMuted hover:text-primary group/link inline-flex items-center gap-1 transition-colors"
											>
												npm
												<ArrowUpRight className="size-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
											</Link>
										)}
									</div>
								</div>
							);
						})}
					</div>

					<div className="border-border/60 text-textMuted flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t px-4 py-3 font-mono text-[10px] tracking-widest uppercase">
						<span>
							<span className="text-primary">{ICON_COUNTS.total}</span> icons
						</span>
						{FACTS.map((f) => (
							<span key={f}>{f}</span>
						))}
					</div>
				</SpecimenFrame>
			</div>
		</section>
	);
};

export default InstallSection;
