"use client";
import React from "react";
import { CodeBlock } from "./ui/code-block";

const CmdSection: React.FC = () => {
	return (
		<CodeBlock
			className="w-full text-start lg:max-w-170"
			tabs={[
				{
					label: "npm",
					code: "npx shadcn@latest add https://animateicons.in/r/",
					language: "bash",
				},
				{
					label: "pnpm",
					code: "pnpm dlx shadcn@latest add https://animateicons.in/r/",
					language: "bash",
				},
				{
					label: "bun",
					code: "bunx --bun shadcn@latest add https://animateicons.in/r/",
					language: "bash",
				},
			]}
		/>
	);
};

export default CmdSection;
