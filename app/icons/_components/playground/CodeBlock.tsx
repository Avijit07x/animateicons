"use client";

import { cn } from "@/lib/utils";
import CopyIconButton from "./CopyIconButton";
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
	<div className={cn("flex flex-col", className)}>
		<p className="text-textMuted mb-2 text-sm">{label}</p>
		<div className="bg-surface flex min-h-0 flex-1 flex-col rounded-[22px] p-2">
			<div className="bg-bgDark relative flex min-h-0 flex-1 flex-col rounded-[14px]">
				<HighlightedCode
					code={code}
					lang={lang}
					wrap={false}
					className="my-4 mr-12 ml-4"
				/>
				<CopyIconButton
					text={code}
					label="Copy code"
					className="absolute top-2 right-2"
				/>
			</div>
			{footer && (
				<p className="text-textMuted px-2.5 pt-2.5 pb-1 text-xs">{footer}</p>
			)}
		</div>
	</div>
);

export default CodeBlock;
