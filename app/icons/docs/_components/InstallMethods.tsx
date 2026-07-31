"use client";

import { BlocksIcon } from "@/icons/lucide/blocks-icon";
import { BoxIcon } from "@/icons/lucide/box-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { TerminalIcon } from "@/icons/lucide/terminal-icon";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";
import type { ComponentType, Ref } from "react";
import { useRef } from "react";

/**
 * Install-method chooser — a card grid at the top of the Installation page
 * that jumps to each method's section (or the MCP guide). Uses AnimateIcons'
 * own animated icons, played on card hover via the shared handleHover helper
 * (attaching a ref makes each icon "controlled", so the card drives it).
 */

type AnimatedIcon = ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;

const METHODS: {
	title: string;
	desc: string;
	href: string;
	Icon: AnimatedIcon;
}[] = [
	{
		title: "npm package",
		desc: "One install, every icon. Best for most apps.",
		href: "#install-npm",
		Icon: BoxIcon,
	},
	{
		title: "shadcn CLI",
		desc: "Copy each icon into your codebase as source.",
		href: "/icons/docs/shadcn",
		Icon: BlocksIcon,
	},
	{
		title: "animateicons CLI",
		desc: "First-party command to add icons to your project.",
		href: "/icons/docs/cli",
		Icon: TerminalIcon,
	},
	{
		title: "AI agents (MCP)",
		desc: "Let Claude Code or Cursor add icons for you.",
		href: "/icons/docs/mcp",
		Icon: SparklesIcon,
	},
];

const InstallMethodCard: React.FC<(typeof METHODS)[number]> = ({
	title,
	desc,
	href,
	Icon,
}) => {
	const ref = useRef<IconHandle>(null);
	return (
		<Link
			href={href}
			onMouseEnter={(e) => handleHover(e, ref)}
			onMouseLeave={(e) => handleHover(e, ref)}
			className={cn(
				"group border-border/60 bg-surface/40 hover:border-primary/50 hover:bg-surface",
				"flex items-start gap-3 rounded-xl border p-4 transition-colors",
			)}
		>
			<span className="border-border/60 bg-bgDark text-primary flex size-9 shrink-0 items-center justify-center rounded-lg border">
				<Icon ref={ref} size={18} />
			</span>
			<span className="min-w-0">
				<span className="text-textPrimary group-hover:text-primary block text-sm font-semibold transition-colors">
					{title}
				</span>
				<span className="text-textMuted mt-0.5 block text-xs leading-5">
					{desc}
				</span>
			</span>
		</Link>
	);
};

const InstallMethods = () => (
	<div className="my-8 grid gap-3 sm:grid-cols-2">
		{METHODS.map((m) => (
			<InstallMethodCard key={m.title} {...m} />
		))}
	</div>
);

export default InstallMethods;
