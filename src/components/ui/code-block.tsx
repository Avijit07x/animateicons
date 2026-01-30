"use client";

import { CopyIcon, CopyIconHandle } from "@/Icons/lucide/CopyIcon";
import { cn } from "@/lib/utils";
import handleHover from "@/utils/handleHover";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { WordRotate } from "../magicui/word-rotate";

interface CodeTab {
	label: string;
	code: string;
	language?: string;
}

interface CodeBlockProps {
	tabs?: CodeTab[];
	code?: string;
	language?: string;
	className?: string;
}

export function CodeBlock({
	tabs,
	code,
	language = "bash",
	className,
}: CodeBlockProps) {
	const [activeTab, setActiveTab] = useState(0);
	const [copied, setCopied] = useState(false);
	const [direction, setDirection] = useState(0);
	const preRef = useRef<HTMLPreElement>(null);
	const copyRef = useRef<CopyIconHandle>(null);
	const [hasOverflow, setHasOverflow] = useState(false);

	const commands = ["loader.json", "heart.json", "lock.json", "copy.json"];

	const codeContent = useMemo(() => {
		if (tabs && tabs.length > 0) return tabs;
		if (code) return [{ label: language, code, language }];
		return [];
	}, [tabs, code, language]);

	const currentCode = codeContent[activeTab]?.code || "";

	useLayoutEffect(() => {
		const checkOverflow = () => {
			if (!preRef.current) return;
			setHasOverflow(preRef.current.scrollWidth > preRef.current.clientWidth);
		};

		checkOverflow();
		const resizeObserver = new ResizeObserver(checkOverflow);
		if (preRef.current) resizeObserver.observe(preRef.current);

		return () => resizeObserver.disconnect();
	}, [activeTab]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(currentCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleTabChange = (index: number) => {
		setDirection(index > activeTab ? 1 : -1);
		setActiveTab(index);
	};

	if (codeContent.length === 0) return null;

	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-2xl border p-0.5",
				"border-border",
				"bg-surface",
				"text-textPrimary",
				className,
			)}
		>
			{codeContent.length > 1 && (
				<div className="relative flex items-center pr-2.5">
					<div
						role="tablist"
						className="flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-tl-xl text-xs leading-6"
					>
						<div className="relative flex gap-1">
							{codeContent.map((tab, index) => (
								<button
									key={`${tab.label}-${index}`}
									type="button"
									role="tab"
									aria-selected={activeTab === index}
									onClick={() => handleTabChange(index)}
									className={cn(
										"relative my-1 mb-1.5 flex items-center gap-1.5 rounded-lg px-2 font-medium transition-colors",
										"first:ml-2.5",
										"hover:bg-surfaceHover",
										activeTab === index
											? "text-textPrimary"
											: "text-textMuted",
									)}
								>
									{tab.label}
									{activeTab === index && (
										<motion.div
											layoutId="activeTabIndicator"
											className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-textPrimary"
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 35,
											}}
										/>
									)}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			<div className="relative overflow-hidden">
				<motion.button
					onClick={handleCopy}
					whileTap={{ scale: 0.95 }}
					className={cn(
						"absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium",
						"border-border border",
						"bg-surfaceElevated/80 backdrop-blur",
						"text-textSecondary",
						"opacity-70 group-hover:opacity-100",
						"hover:text-textPrimary hover:bg-surfaceHover",
						"transition-all",
					)}
					aria-label="Copy code"
					onMouseEnter={(e) => handleHover(e, copyRef)}
					onMouseLeave={(e) => handleHover(e, copyRef)}
				>
					<span className="relative size-3.5">
						<motion.div
							initial={false}
							animate={{
								scale: copied ? 0 : 1,
								opacity: copied ? 0 : 1,
								rotate: copied ? 90 : 0,
							}}
							transition={{ duration: 0.2 }}
							className="absolute inset-0"
						>
							<CopyIcon ref={copyRef} className="size-full" />
						</motion.div>
						<motion.div
							initial={false}
							animate={{
								scale: copied ? 1 : 0,
								opacity: copied ? 1 : 0,
								rotate: copied ? 0 : -90,
							}}
							transition={{ duration: 0.2 }}
							className="absolute inset-0"
						>
							<Check className="size-full" />
						</motion.div>
					</span>
					<span>{copied ? "Copied" : "Copy"}</span>
				</motion.button>

				<pre
					ref={preRef}
					className={cn(
						"m-0 p-4 text-sm leading-relaxed",
						"bg-surfaceElevated",
						codeContent.length > 1 ? "rounded-b-2xl" : "rounded-2xl",
						hasOverflow ? "overflow-x-auto" : "overflow-x-hidden",
					)}
				>
					<AnimatePresence mode="wait" initial={false} custom={direction}>
						<motion.code
							key={activeTab}
							custom={direction}
							initial={{
								opacity: 0,
								x: direction > 0 ? 20 : -20,
								filter: "blur(4px)",
							}}
							animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
							exit={{
								opacity: 0,
								x: direction > 0 ? -20 : 20,
								filter: "blur(4px)",
							}}
							transition={{ duration: 0.15, ease: "easeOut" }}
							className="text-textPrimary flex items-center font-mono whitespace-pre"
						>
							{currentCode}
							<WordRotate words={commands} />
						</motion.code>
					</AnimatePresence>
				</pre>
			</div>
		</div>
	);
}
