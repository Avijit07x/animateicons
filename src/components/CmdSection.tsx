"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import CmdCopy from "./CmdCopy";
import { WordRotate } from "./magicui/word-rotate";

const CmdSection: React.FC = () => {
	const [activeTab, setActiveTab] = useState<"npm" | "pnpm" | "bun">("npm");
	const [currentCmd, setCurrentCmd] = useState("");
	const [copied, setCopied] = useState(false);
	const [isReady, setIsReady] = useState(false);

	const commands = ["loader.json", "heart.json", "lock.json", "copy.json"];

	const copyToClipboard = () => {
		if (!currentCmd) return;
		navigator.clipboard
			.writeText(currentCmd)
			.then(() => setCopied(true))
			.catch((err) => console.error("Failed to copy text:", err));
	};

	useEffect(() => {
		if (copied) {
			const timeout = setTimeout(() => setCopied(false), 1500);
			return () => clearTimeout(timeout);
		}
	}, [copied]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const tab = localStorage.getItem("tab") as "npm" | "pnpm" | "bun" | null;
			if (tab) {
				setActiveTab(tab);
			}
			setIsReady(true);
		}
	}, []);

	if (!isReady) return null;

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => {
				setActiveTab(value as "npm" | "pnpm" | "bun");
				localStorage.setItem("tab", value);
			}}
			className="bg-primary/10 border-primary/20 lg:w-200 relative mt-5 w-full gap-0 rounded-md border shadow-lg"
		>
			<TabsList className="h-12 space-x-1.5 bg-transparent px-2 py-2.5">
				<TabsTrigger
					value="npm"
					className="data-[state=active]:bg-primary/30 rounded-sm text-white data-[state=active]:shadow-sm"
				>
					npm
				</TabsTrigger>
				<TabsTrigger
					value="pnpm"
					className="data-[state=active]:bg-primary/30 rounded-sm text-white data-[state=active]:shadow-sm"
				>
					pnpm
				</TabsTrigger>
				<TabsTrigger
					value="bun"
					className="data-[state=active]:bg-primary/30 rounded-sm text-white data-[state=active]:shadow-sm"
				>
					bun
				</TabsTrigger>
			</TabsList>

			<TabsContent
				value="npm"
				className="bg-primary/5 flex items-center justify-between px-4 py-2 text-sm text-zinc-300 max-md:line-clamp-1 max-sm:overflow-x-auto"
			>
				<div className="flex w-full items-center justify-between gap-2 whitespace-nowrap">
					<code className="line-clamp-1 flex flex-nowrap items-center">
						npx shadcn@latest add "https://animateicons.in/icons/
						<WordRotate
							words={commands}
							onWordChange={(word) =>
								setCurrentCmd(
									`npx shadcn@latest add "https://animateicons.in/icons/${word}"`,
								)
							}
						/>
					</code>
					<CmdCopy copied={copied} copyToClipboard={copyToClipboard} />
				</div>
			</TabsContent>
			<TabsContent
				value="pnpm"
				className="bg-primary/5 flex items-center justify-between px-4 py-2 text-sm text-zinc-300 max-md:line-clamp-1 max-sm:overflow-x-auto"
			>
				<div className="flex w-full items-center justify-between gap-2 whitespace-nowrap">
					<code className="line-clamp-1 flex flex-nowrap items-center">
						pnpm dlx shadcn@latest add "https://animateicons.in/icons/
						<WordRotate
							words={commands}
							onWordChange={(word) =>
								setCurrentCmd(
									`pnpm dlx shadcn@latest add "https://animateicons.in/icons/${word}"`,
								)
							}
						/>
					</code>
					<CmdCopy copied={copied} copyToClipboard={copyToClipboard} />
				</div>
			</TabsContent>

			<TabsContent
				value="bun"
				className="bg-primary/5 flex items-center justify-between px-4 py-2 text-sm text-zinc-300 max-md:line-clamp-1 max-sm:overflow-x-auto"
			>
				<div className="flex w-full items-center justify-between gap-2 whitespace-nowrap">
					<code className="line-clamp-1 flex items-center">
						bunx shadcn@latest add "https://animateicons.in/icons/
						<WordRotate
							words={commands}
							onWordChange={(word) =>
								setCurrentCmd(
									`bunx shadcn@latest add "https://animateicons.in/icons/${word}"`,
								)
							}
							className="inline-block"
						/>
					</code>
					<CmdCopy copied={copied} copyToClipboard={copyToClipboard} />
				</div>
			</TabsContent>
		</Tabs>
	);
};

export default CmdSection;
