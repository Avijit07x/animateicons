"use client";

import { getIconCode } from "@/actions/getIconCode";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { V0Icon, V0IconHandle } from "@/components/icons/V0Icon";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IconFilteredItem } from "@/hooks/useIconFilter";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { CopyIcon, CopyIconHandle } from "@/icons/lucide/copy-icon";
import { TerminalIcon, TerminalIconHandle } from "@/icons/lucide/terminal-icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
	item: IconFilteredItem;
};

const codeCache = new Map<string, string>();

const IconTile: React.FC<Props> = ({ item }) => {
	const [copied, setCopied] = useState(false);
	const [copiedCli, setCopiedCli] = useState(false);
	const cliRef = React.useRef<TerminalIconHandle>(null);
	const codeRef = React.useRef<CopyIconHandle>(null);
	const v0Ref = React.useRef<V0IconHandle>(null);
	const { library, prefix } = useIconLibrary();

	if (!library) {
		throw new Error("useIconLibrary used outside /icons route");
	}

	const IconComponent = item.icon;

	const copyToClipboard = async () => {
		const cacheKey = `${library}-${item.name}`;
		let code = codeCache.get(cacheKey);

		if (!code) {
			const fetchedCode = await getIconCode(item.name, library);
			if (fetchedCode) {
				code = fetchedCode;
				codeCache.set(cacheKey, code);
			}
		}

		if (code) {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	};

	const cliToolPref = React.useSyncExternalStore(
		(callback) => {
			if (typeof window === "undefined") return () => {};
			window.addEventListener("storage", callback);
			return () => window.removeEventListener("storage", callback);
		},
		() => (typeof window !== "undefined" ? localStorage.getItem("tab") : null),
		() => null,
	);

	const copyCliCommand = async () => {
		let cliTool = "npx";
		if (cliToolPref === "bun") {
			cliTool = "bunx --bun";
		} else if (cliToolPref === "pnpm") {
			cliTool = "pnpm dlx";
		}

		const command = `${cliTool} shadcn@latest add https://animateicons.in/r/${prefix}-${item.name}.json`;
		await navigator.clipboard.writeText(command);
		setCopiedCli(true);
		setTimeout(() => setCopiedCli(false), 1500);
	};

	return (
		<div className="bg-surfaceElevated border-border hover:bg-surfaceHover relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md border p-4 text-sm text-white shadow-lg transition-all hover:scale-102">
			{item.isNew && (
				<span className="bg-surface text-textSecondary absolute top-0 right-0 rounded-bl-md px-2 py-1 text-xs font-medium">
					New
				</span>
			)}

			<IconComponent
				className="hover:bg-surface inline-block cursor-pointer rounded-xl p-3"
				size={23}
			/>
			<p className="line-clamp-1 text-gray-300">{item.name}</p>

			<div className="mt-2 flex items-center justify-center gap-6">
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							className="flex size-6 items-center justify-center"
							onClick={copyCliCommand}
							aria-label={copiedCli ? "CLI Copied" : "Copy CLI Command"}
							onMouseEnter={(e) => handleHover(e, cliRef)}
							onMouseLeave={(e) => handleHover(e, cliRef)}
						>
							{copiedCli ? (
								<CheckIcon />
							) : (
								<TerminalIcon size={18} ref={cliRef} />
							)}
						</button>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						className="text-primary px-3! py-1.5! font-medium!"
					>
						copy shadcn/cli command
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<button
							className="flex size-6 items-center justify-center"
							onClick={copyToClipboard}
							aria-label={copied ? "Code Copied" : "Copy JSX Code"}
							onMouseEnter={(e) => handleHover(e, codeRef)}
							onMouseLeave={(e) => handleHover(e, codeRef)}
						>
							{copied ? <CheckIcon /> : <CopyIcon size={17} ref={codeRef} />}
						</button>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						className="text-primary px-3! py-1.5! font-medium!"
					>
						copy code
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href={`https://v0.dev/chat/api/open?url=https://animateicons.in/r/${prefix}-${item.name}.json`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-6 items-center justify-center"
							aria-label="Open in v0.dev"
							onMouseEnter={(e) => handleHover(e, v0Ref)}
							onMouseLeave={(e) => handleHover(e, v0Ref)}
						>
							<V0Icon size={22} ref={v0Ref} />
						</Link>
					</TooltipTrigger>
					<TooltipContent
						side="bottom"
						className="text-primary px-3! py-1.5! font-medium!"
					>
						open in v0.dev
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default React.memo(IconTile);
