import type { ReactNode } from "react";

/**
 * SpecimenFrame - the page-wide visual device lifted from the hero plate:
 * registration crop-marks, an inner hairline frame, an optional crosshair,
 * and monospace corner labels around whatever it wraps. Every section uses
 * it so the page reads as one "specimen sheet".
 */

type Props = {
	children: ReactNode;
	label?: string;
	index?: string;
	footLeft?: string;
	footRight?: string;
	crosshair?: boolean;
	className?: string;
	innerClassName?: string;
};

const Corner: React.FC<{ className: string }> = ({ className }) => (
	<span
		aria-hidden="true"
		className={`border-primary/70 absolute h-3.5 w-3.5 ${className}`}
	/>
);

const SpecimenFrame: React.FC<Props> = ({
	children,
	label,
	index,
	footLeft,
	footRight,
	crosshair = false,
	className,
	innerClassName,
}) => {
	return (
		<div className={`relative flex flex-col p-3.5 ${className ?? ""}`}>
			<Corner className="top-0 left-0 border-t border-l" />
			<Corner className="top-0 right-0 border-t border-r" />
			<Corner className="bottom-0 left-0 border-b border-l" />
			<Corner className="right-0 bottom-0 border-r border-b" />

			<div className="border-border/70 relative grow border">
				{crosshair && (
					<>
						<div
							aria-hidden="true"
							className="bg-border/40 absolute top-1/2 right-6 left-6 h-px -translate-y-1/2"
						/>
						<div
							aria-hidden="true"
							className="bg-border/40 absolute top-6 bottom-6 left-1/2 w-px -translate-x-1/2"
						/>
					</>
				)}

				{label && (
					<span className="text-textMuted absolute top-4 left-4 z-10 font-mono text-[10px] tracking-widest uppercase">
						{label}
					</span>
				)}
				{index && (
					<span className="text-textMuted absolute top-4 right-4 z-10 font-mono text-[10px] tracking-widest tabular-nums">
						{index}
					</span>
				)}
				{footLeft && (
					<span className="text-primary absolute bottom-4 left-4 z-10 font-mono text-[10px] tracking-widest">
						{footLeft}
					</span>
				)}
				{footRight && (
					<span className="text-textMuted absolute right-4 bottom-4 z-10 font-mono text-[10px] tracking-widest uppercase">
						{footRight}
					</span>
				)}

				<div className={innerClassName ?? "relative"}>{children}</div>
			</div>
		</div>
	);
};

export default SpecimenFrame;
