"use client";

import CopyButton from "@/components/home/CopyButton";
import { cn } from "@/lib/utils";
import HighlightedCode from "./HighlightedCode";

type Props = {
	label: string;
	code: string;
	lang: "tsx" | "bash";
	footer?: string;
	className?: string;
};

const CodeBlock: React.FC<Props> = ({
	label,
	code,
	lang,
	footer,
	className,
}) => (
	<div
		className={cn(
			"bg-surfaceElevated flex flex-col overflow-hidden rounded-3xl",
			className,
		)}
	>
		<div className="flex items-center justify-between gap-3 px-4 pt-3">
			<p className="text-textMuted text-sm">{label}</p>
			<CopyButton text={code} className="w-24 py-1 text-xs" />
		</div>
		<HighlightedCode code={code} lang={lang} />
		{footer && (
			<p className="text-textMuted mt-auto px-4 pb-3.5 text-xs">{footer}</p>
		)}
	</div>
);

export default CodeBlock;
