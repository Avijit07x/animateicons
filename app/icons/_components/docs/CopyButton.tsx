"use client";

import { useCopy } from "@/hooks/useCopy";
import { useIconHover } from "@/hooks/useIconHover";
import { CheckIcon } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { cn } from "@/lib/utils";

type Props = {
	code: string;
	className?: string;
};

const CopyButton: React.FC<Props> = ({ code, className }) => {
	const { copied, copy } = useCopy(1500);
	const { ref, hoverProps } = useIconHover();

	return (
		<button
			type="button"
			onClick={() => copy(code)}
			aria-label="Copy code"
			{...hoverProps}
			className={cn(
				"text-textMuted hover:text-textPrimary flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10",
				className,
			)}
		>
			{copied ? (
				<CheckIcon size={15} color="var(--color-success)" />
			) : (
				<CopyIcon ref={ref} size={15} />
			)}
		</button>
	);
};

export default CopyButton;
