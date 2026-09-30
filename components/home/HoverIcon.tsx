"use client";

import { useIconHover } from "@/hooks/useIconHover";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import { Suspense, useCallback, type ComponentType, type Ref } from "react";

type Props = {
	Icon: ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;
	size?: number;
	className?: string;
	iconRef?: (handle: IconHandle | null) => void;
};

const HoverIcon: React.FC<Props> = ({
	Icon,
	size = 32,
	className,
	iconRef,
}) => {
	const { ref, hoverProps } = useIconHover();
	const bind = useCallback(
		(handle: IconHandle | null) => {
			ref.current = handle;
			iconRef?.(handle);
		},
		[ref, iconRef],
	);

	return (
		<div
			{...hoverProps}
			className={cn(
				"text-textSecondary hover:text-primary hover:bg-surface grid shrink-0 place-items-center transition-colors duration-200",
				className,
			)}
		>
			<Suspense fallback={null}>
				<Icon ref={bind} size={size} />
			</Suspense>
		</div>
	);
};

export default HoverIcon;
