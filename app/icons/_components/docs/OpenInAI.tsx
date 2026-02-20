"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type Provider = "chatgpt" | "claude" | "v0" | "scira";

const providers: Record<
	Provider,
	{ label: string; url: (q: string) => string }
> = {
	chatgpt: {
		label: "Open in ChatGPT",
		url: (q) => `https://chat.openai.com/?prompt=${q}`,
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
	title?: string;
}

export default function OpenInAI({ pageUrl, title }: Props) {
	const buildPrompt = () => {
		const text = `
Analyze this documentation page:
${pageUrl}

${title ? `Title: ${title}` : ""}

Explain usage, examples, and integration clearly.
`;
		return encodeURIComponent(text.trim());
	};

	const handleOpen = (provider: Provider) => {
		const prompt = buildPrompt();
		const url = providers[provider].url(prompt);
		window.open(url, "_blank");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"outline"}
					className="border-border hover:bg-surfaceElevated text-textPrimary! bg-bgDark focus-visible:border-border flex items-center justify-center rounded-md border outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					<span>Open in AI</span>
					<ChevronDown className="size-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="bg-surfaceElevated text-textPrimary w-48"
			>
				{Object.entries(providers).map(([key, p]) => (
					<DropdownMenuItem
						key={key}
						onClick={() => handleOpen(key as Provider)}
						className="hover:bg-surfaceHover! text-textPrimary! cursor-pointer"
					>
						{p.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
