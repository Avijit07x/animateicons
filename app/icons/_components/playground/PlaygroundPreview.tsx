"use client";

import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import type { IconConfig } from "./useIconConfig";

type Props = {
	Icon: React.ElementType;
	componentName: string;
	config: IconConfig;
	iconRef: React.RefObject<IconHandle | null>;
	className?: string;
	hint?: boolean;
};

const PlaygroundPreview: React.FC<Props> = ({
	Icon,
	componentName,
	config,
	iconRef,
	className,
	hint = true,
}) => {
	const IconComponent = Icon as React.ComponentType<{
		size?: number;
		duration?: number;
		color?: string;
		ref?: React.Ref<IconHandle>;
	}>;

	return (
		<div
			role="img"
			aria-label={`${componentName} preview at ${config.size}px`}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className={cn(
				"bg-surface relative flex h-60 cursor-pointer items-center justify-center overflow-hidden rounded-3xl",
				className,
			)}
		>
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0 [--plus-mask:radial-gradient(circle_at_50%_50%,#000_8%,transparent_70%)]"
			/>
			<IconComponent
				ref={iconRef}
				size={config.size}
				duration={config.duration}
				color={config.color}
			/>
			{hint && (
				<span className="bg-surfaceElevated text-textMuted absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs">
					Hover to play
				</span>
			)}
		</div>
	);
};

export default PlaygroundPreview;
