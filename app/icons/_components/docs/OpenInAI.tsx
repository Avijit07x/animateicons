"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@/icons/huge/chevron-down-icon";

type Provider = "chatgpt" | "claude" | "v0" | "scira";

const providers: Record<
	Provider,
	{ label: string; url: (q: string) => string }
> = {
	chatgpt: {
		label: "Open in ChatGPT",
		url: (q) => `https://chatgpt.com/?hints=search&q=${q}`,
	},
	claude: {
		label: "Open in Claude",
		url: (q) => `https://claude.ai/new?q=${q}`,
	},
	v0: {
		label: "Open in v0",
		url: (q) => `https://v0.dev/chat?q=${q}`,
	},
	scira: {
		label: "Open in Scira",
		url: (q) => `https://scira.ai/?q=${q}`,
	},
};

interface Props {
	pageUrl: string;
	markdownUrl: string;
	title: string;
}

export default function OpenInAI({ pageUrl, markdownUrl, title }: Props) {
	const buildPrompt = () =>
		encodeURIComponent(
			[
				`Read ${markdownUrl}`,
				`It is the "${title}" page of the AnimateIcons docs as plain markdown. The same page on the web: ${pageUrl}`,
				"Answer my questions using only that page and the pages it links to. Use the exact package names, imports and props it shows, and tell me when something is not covered instead of guessing.",
			].join("\n\n"),
		);

	const handleOpen = (provider: Provider) => {
		const prompt = buildPrompt();
		const url = providers[provider].url(prompt);
		window.open(url, "_blank");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="secondary"
					className="h-9 gap-2 rounded-full px-4 text-xs outline-none focus-visible:ring-0 focus-visible:outline-none"
				>
					<span>Open in AI</span>
					<ChevronDownIcon size={14} className="text-textMuted" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className="bg-surfaceElevated text-textPrimary w-48 rounded-[14px] border-0 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
			>
				{Object.entries(providers).map(([key, p]) => (
					<DropdownMenuItem
						key={key}
						onClick={() => handleOpen(key as Provider)}
						className="text-textSecondary focus:text-textPrimary cursor-pointer rounded-full px-3 py-2 text-[13px] focus:bg-white/8"
					>
						{p.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
