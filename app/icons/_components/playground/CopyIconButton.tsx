"use client";

import IconButton from "@/components/IconButton";
import { useCopy } from "@/hooks/useCopy";
import { CheckIcon } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { cn } from "@/lib/utils";

type Props = {
	text: string;
	label: string;
	className?: string;
};

const CopyIconButton: React.FC<Props> = ({ text, label, className }) => {
	const { copied, copy } = useCopy();

	return (
		<IconButton
			icon={copied ? CheckIcon : CopyIcon}
			iconSize={14}
			iconColor={copied ? "var(--color-success)" : undefined}
			onClick={() => copy(text)}
			aria-label={copied ? "Copied" : label}
			title={copied ? "Copied" : label}
			className={cn(
				"text-textMuted hover:text-textPrimary flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/8",
				className,
			)}
		/>
	);
};

export default CopyIconButton;
