"use client";

import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";

type Props = {
	code: string;
	copyText?: string;
	sizer: string;
	className?: string;
};

const CodeSnippet: React.FC<Props> = ({
	code,
	copyText = code,
	sizer,
	className,
}) => (
	<div
		className={cn(
			"bg-surfaceElevated relative flex max-w-full items-center gap-3 rounded-full py-2 pr-2 pl-5",
			className,
		)}
	>
		<span className="text-textSecondary relative min-w-0 flex-1 text-left font-mono text-[13px]">
			<span aria-hidden="true" className="invisible block truncate">
				{sizer}
			</span>
			<code className="absolute inset-0 truncate">{code}</code>
		</span>
		<CopyButton text={copyText} />
	</div>
);

export default CodeSnippet;
