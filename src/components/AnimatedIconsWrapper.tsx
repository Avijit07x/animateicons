import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import { HTMLMotionProps } from "motion/react";

import React, { useImperativeHandle, useRef } from "react";

interface Props extends AnimatedIconProps, HTMLMotionProps<"div"> {
	Icon: React.ElementType;
	startAnimationDelay?: number;
	stopAnimationDelay?: number;
}

export const AnimatedIconWrapper = React.forwardRef<AnimatedIconRef, Props>(
	(
		{ Icon, startAnimationDelay = 0, stopAnimationDelay = 0, ...props },
		ref,
	) => {
		const timeoutRef = useRef<NodeJS.Timeout | null>(null);
		const iconRef = useRef<AnimatedIconRef>(null);
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (startAnimationDelay) {
						if (timeoutRef.current) clearTimeout(timeoutRef.current);

						timeoutRef.current = setTimeout(() => {
							iconRef.current?.startAnimation?.();
							timeoutRef.current = null;
						}, startAnimationDelay);
					} else {
						iconRef.current?.startAnimation?.();
					}
				},
				stopAnimation: () => {
					if (stopAnimationDelay) {
						if (timeoutRef.current) clearTimeout(timeoutRef.current);

						timeoutRef.current = setTimeout(() => {
							iconRef.current?.stopAnimation?.();
							timeoutRef.current = null;
						}, stopAnimationDelay);
					} else {
						iconRef.current?.stopAnimation?.();
					}
				},
			};
		}, [startAnimationDelay, stopAnimationDelay]);

		return (
			<Icon
				{...props}
				ref={iconRef}
				onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
					props.onMouseEnter?.(e);

					if (isControlled.current) return;
					iconRef.current?.startAnimation?.();
				}}
				onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
					props.onMouseLeave?.(e);

					if (isControlled.current) return;
					iconRef.current?.stopAnimation?.();
				}}
			/>
		);
	},
);

export function withAnimatedIconWrapper(Icon: React.ElementType) {
	return React.forwardRef<AnimatedIconRef, Omit<Props, "Icon">>(
		(props, ref) => <AnimatedIconWrapper {...props} Icon={Icon} ref={ref} />,
	);
}
