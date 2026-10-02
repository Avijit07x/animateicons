"use client";

import { BotIcon } from "@/icons/huge/bot-icon";
import { Layout01Icon } from "@/icons/huge/layout-0-1-icon";
import { PackageDeliveredIcon } from "@/icons/huge/package-delivered-icon";
import { TerminalIcon } from "@/icons/huge/terminal-icon";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import type { IconHandle } from "@/types/icon";
import Link from "next/link";
import type { ComponentType, Ref } from "react";

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
		Icon: PackageDeliveredIcon,
	},
	{
		title: "shadcn CLI",
		desc: "Copy each icon into your codebase as source.",
		href: "/icons/docs/shadcn",
		Icon: Layout01Icon,
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
		Icon: BotIcon,
	},
];

const InstallMethodCard: React.FC<(typeof METHODS)[number]> = ({
	title,
	desc,
	href,
	Icon,
}) => {
	const { ref, triggerProps } = useIconHover();
	return (
		<Link
			href={href}
			{...triggerProps}
			className="group bg-surface hover:bg-surfaceElevated flex items-center gap-4 rounded-3xl p-4 transition-colors"
		>
			<span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
				<Icon ref={ref} size={20} />
			</span>
			<span className="min-w-0">
				<span className="text-textPrimary block text-sm font-semibold">
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
