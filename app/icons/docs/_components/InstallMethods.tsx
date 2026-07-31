"use client";

import { BlocksIcon } from "@/icons/lucide/blocks-icon";
import { BoxIcon } from "@/icons/lucide/box-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { TerminalIcon } from "@/icons/lucide/terminal-icon";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";
import { useRef } from "react";

/**
 * Install-method chooser — a card grid at the top of the Installation page
 * that jumps to each method's section (or the MCP guide). Uses AnimateIcons'
 * own animated icons, played on card hover via the shared handleHover helper
 * (attaching a ref makes each icon "controlled", so the card drives it).
 */
const InstallMethods = () => {
	const refs = {
		npm: useRef<IconHandle>(null),
		shadcn: useRef<IconHandle>(null),
		cli: useRef<IconHandle>(null),
		mcp: useRef<IconHandle>(null),
	};

	const methods = [
		{
			title: "npm package",
			desc: "One install, every icon. Best for most apps.",
			href: "#install-npm",
			iconRef: refs.npm,
			icon: <BoxIcon ref={refs.npm} size={18} />,
		},
		{
			title: "shadcn CLI",
			desc: "Copy each icon into your codebase as source.",
			href: "/icons/docs/shadcn",
			iconRef: refs.shadcn,
			icon: <BlocksIcon ref={refs.shadcn} size={18} />,
		},
		{
			title: "animateicons CLI",
			desc: "First-party command to add icons to your project.",
			href: "/icons/docs/cli",
			iconRef: refs.cli,
			icon: <TerminalIcon ref={refs.cli} size={18} />,
		},
		{
			title: "AI agents (MCP)",
			desc: "Let Claude Code or Cursor add icons for you.",
			href: "/icons/docs/mcp",
			iconRef: refs.mcp,
			icon: <SparklesIcon ref={refs.mcp} size={18} />,
		},
	];

	return (
		<div className="my-8 grid gap-3 sm:grid-cols-2">
			{methods.map((m) => (
				<Link
					key={m.title}
					href={m.href}
					onMouseEnter={(e) => handleHover(e, m.iconRef)}
					onMouseLeave={(e) => handleHover(e, m.iconRef)}
					className={cn(
						"group border-border/60 bg-surface/40 hover:border-primary/50 hover:bg-surface",
						"flex items-start gap-3 rounded-xl border p-4 transition-colors",
					)}
				>
					<span className="border-border/60 bg-bgDark text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border">
						{m.icon}
					</span>
					<span className="min-w-0">
						<span className="text-textPrimary group-hover:text-primary block text-sm font-semibold transition-colors">
							{m.title}
						</span>
						<span className="text-textMuted mt-0.5 block text-xs leading-5">
							{m.desc}
						</span>
					</span>
				</Link>
			))}
		</div>
	);
};

export default InstallMethods;
