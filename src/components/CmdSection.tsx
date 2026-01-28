"use client";
import React from "react";
import { CodeBlock } from "./ui/code-block";

const CmdSection: React.FC = () => {
	// const [activeTab, setActiveTab] = useState<"npm" | "pnpm" | "bun">("npm");
	// const [currentCmd, setCurrentCmd] = useState("");
	// const [copied, setCopied] = useState(false);
	// const [isReady, setIsReady] = useState(false);

	// const commands = ["loader.json", "heart.json", "lock.json", "copy.json"];

	// const copyToClipboard = () => {
	// 	if (!currentCmd) return;
	// 	navigator.clipboard
	// 		.writeText(currentCmd)
	// 		.then(() => setCopied(true))
	// 		.catch((err) => console.error("Failed to copy text:", err));
	// };

	// useEffect(() => {
	// 	if (copied) {
	// 		const timeout = setTimeout(() => setCopied(false), 1500);
	// 		return () => clearTimeout(timeout);
	// 	}
	// }, [copied]);

	// useEffect(() => {
	// 	if (typeof window !== "undefined") {
	// 		const tab = localStorage.getItem("tab") as "npm" | "pnpm" | "bun" | null;
	// 		if (tab) {
	// 			setActiveTab(tab);
	// 		}
	// 		setIsReady(true);
	// 	}
	// }, []);

	return (
		<CodeBlock
			className="w-full text-start lg:max-w-170"
			tabs={[
				{
					label: "npm",
					code: "npx shadcn@latest add https://animateicons.in/icons/x.json",
					language: "bash",
				},
				{
					label: "pnpm",
					code: "pnpm dlx shadcn@latest add https://animateicons.in/icons/x.json",
					language: "bash",
				},
				{
					label: "bun",
					code: "bunx shadcn@latest add https://animateicons.in/icons/x.json",
					language: "bash",
				},
			]}
		/>
	);
};

export default CmdSection;
