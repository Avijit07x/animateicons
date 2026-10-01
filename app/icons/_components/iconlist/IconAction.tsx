"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import Link from "next/link";

type BaseProps = {
	tooltip: string;
	ariaLabel: string;
	iconRef: React.RefObject<IconHandle | null>;
	children: React.ReactNode;
};

type ButtonVariantProps = BaseProps & {
	as?: "button";
	onClick: () => void;
};

type LinkVariantProps = BaseProps & {
	as: "link";
	href: string;
};

type Props = ButtonVariantProps | LinkVariantProps;

const TRIGGER_CLASS =
	"text-textSecondary grid size-7 place-items-center rounded-full transition-colors hover:bg-white/15 hover:text-white pointer-coarse:size-10 pointer-coarse:[&>*]:scale-[1.3]";

const actionItemVariants: Variants = {
	hidden: { opacity: 0, y: 12, scale: 0.5, transition: { duration: 0.12 } },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: "spring", stiffness: 520, damping: 26 },
	},
};

const IconAction: React.FC<Props> = (props) => {
	const { tooltip, ariaLabel, iconRef, children } = props;

	const hoverHandlers = {
		onMouseEnter: (e: React.MouseEvent) => handleHover(e, iconRef),
		onMouseLeave: (e: React.MouseEvent) => handleHover(e, iconRef),
	};

	const trigger =
		props.as === "link" ? (
			<Link
				href={props.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={ariaLabel}
				className={TRIGGER_CLASS}
				{...hoverHandlers}
			>
				{children}
			</Link>
		) : (
			<button
				type="button"
				onClick={props.onClick}
				aria-label={ariaLabel}
				className={TRIGGER_CLASS}
				{...hoverHandlers}
			>
				{children}
			</button>
		);

	return (
		<motion.span variants={actionItemVariants} className="grid">
			<Tooltip>
				<TooltipTrigger asChild>{trigger}</TooltipTrigger>
				<TooltipContent side="bottom">{tooltip}</TooltipContent>
			</Tooltip>
		</motion.span>
	);
};

export default IconAction;
