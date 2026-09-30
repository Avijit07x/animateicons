"use client";

import IconButton from "@/components/IconButton";
import { useCopy } from "@/hooks/useCopy";
import { CheckIcon } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { cn } from "@/lib/utils";

type Props = {
	text: string;
	className?: string;
};

const CopyButton: React.FC<Props> = ({ text, className }) => {
	const { copied, copy } = useCopy();

	return (
		<IconButton
			icon={copied ? CheckIcon : CopyIcon}
			iconSize={14}
			iconColor={copied ? "var(--color-success)" : undefined}
			onClick={() => copy(text)}
			aria-label="Copy code"
			className={cn(
				"bg-surfaceActive text-textPrimary inline-flex w-28 shrink-0 items-center justify-center gap-2 rounded-full py-1.5 text-sm font-medium transition-colors hover:bg-white/10",
				className,
			)}
		>
			{copied ? "Copied" : "Copy"}
		</IconButton>
	);
};

export default CopyButton;
