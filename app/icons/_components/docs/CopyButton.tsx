"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Props = {
	code: string;
	className?: string;
};

const CopyButton: React.FC<Props> = ({ code, className }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			aria-label="Copy code"
			className={cn(
				"text-textMuted hover:text-textPrimary flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/10",
				className,
			)}
		>
			{copied ? (
				<Check className="size-3.5 text-emerald-400" />
			) : (
				<Copy className="size-3.5" />
			)}
		</button>
	);
};

export default CopyButton;
