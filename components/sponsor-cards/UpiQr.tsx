"use client";

import { useCopy } from "@/hooks/useCopy";
import { CheckIcon } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { cn } from "@/lib/utils";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import Image from "next/image";
import { UPI_ID } from "./tips";

const EASE = "duration-350 ease-[cubic-bezier(0.23,1,0.32,1)]";

const UpiQr: React.FC<{ open: boolean }> = ({ open }) => {
	const { copied, copy } = useCopy(1500);
	const { ref, triggerProps } = useIconHover();

	return (
		<div
			className={cn(
				"grid transition-[grid-template-rows]",
				EASE,
				open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
			)}
		>
			<div data-reveal-inner inert={!open} className="overflow-hidden">
				<div
					className={cn(
						"flex items-center gap-3.5 pt-3 transition-[opacity,translate]",
						EASE,
						!open && "-translate-y-1 opacity-0",
					)}
				>
					<Image
						src="/qrcode.svg"
						alt={`UPI QR code for ${UPI_ID}`}
						width={96}
						height={96}
						className="shrink-0 rounded-lg"
					/>
					<div className="text-textMuted grid gap-2 text-xs">
						<span>Scan with any UPI app, or copy the ID.</span>
						<button
							type="button"
							onClick={() => copy(UPI_ID)}
							aria-label="Copy UPI ID"
							{...triggerProps}
							className="text-textPrimary inline-flex h-7 items-center gap-1.5 justify-self-start rounded-full bg-white/6 pr-1.5 pl-2.5 text-[12.5px] transition-colors hover:bg-white/10"
						>
							{copied ? "Copied" : UPI_ID}
							{copied ? (
								<CheckIcon size={13} color="var(--color-success)" />
							) : (
								<CopyIcon ref={ref} size={13} />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpiQr;
