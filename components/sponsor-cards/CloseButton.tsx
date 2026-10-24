"use client";

import { Button } from "@/components/ui/button";
import { Cancel01Icon } from "@/icons/huge/cancel-0-1-icon";
import { cn } from "@/lib/utils";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { m } from "motion/react";
import type { Ref } from "react";
import { QR_TRANSITION } from "./choreography";
import { closeVariants } from "./variants";

type Props = {
	ref: Ref<HTMLButtonElement>;
	open: boolean;
	bottom: number;
	lift: number;
	onClose: () => void;
};

const CloseButton: React.FC<Props> = ({ ref, open, bottom, lift, onClose }) => {
	const { ref: iconRef, triggerProps } = useIconHover();

	return (
		<m.div
			animate={{ y: -lift }}
			transition={QR_TRANSITION}
			style={{ bottom }}
			className="absolute right-3.5 z-20"
		>
			<m.div
				variants={closeVariants}
				initial="hidden"
				animate={open ? "open" : "rest"}
				inert={!open}
				className={cn(open && "pointer-events-auto")}
			>
				<Button
					ref={ref}
					type="button"
					variant="secondary"
					size="icon-sm"
					onClick={onClose}
					aria-label="Close sponsor options"
					{...triggerProps}
					className="text-textSecondary hover:text-textPrimary size-7 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.8)] ring-1 ring-white/10 [&_svg:not([class*='size-'])]:size-3.5"
				>
					<Cancel01Icon ref={iconRef} />
				</Button>
			</m.div>
		</m.div>
	);
};

export default CloseButton;
