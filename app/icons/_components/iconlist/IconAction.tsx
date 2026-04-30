"use client";

/**
 * IconAction
 *
 * SRP: render one of the three tooltip-wrapped, hover-animated 24×24
 * action buttons that sit under every AnimateIcons tile (Copy CLI
 * command / Copy JSX code / Open in v0.dev) — either as a real button
 * (in-page action) or an anchor (external link).
 *
 * Replaces three near-identical inline blocks in the original
 * IconTile.tsx. Polymorphic via discriminated union on `as` so
 * TypeScript narrows the prop set correctly: button variant requires
 * `onClick`, link variant requires `href`.
 *
 * The AnimateIcons icon used as the visual is passed as children;
 * supply its ref so this component can drive its hover animation.
 */

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";

type BaseProps = {
	tooltip: string;
	ariaLabel: string;
	/** Ref to the animated icon's imperative handle. */
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

const TRIGGER_CLASS = "flex size-6 items-center justify-center";
const TOOLTIP_CLASS = "text-primary px-3! py-1.5! font-medium!";

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
		<Tooltip>
			<TooltipTrigger asChild>{trigger}</TooltipTrigger>
			<TooltipContent side="bottom" className={TOOLTIP_CLASS}>
				{tooltip}
			</TooltipContent>
		</Tooltip>
	);
};

export default IconAction;
