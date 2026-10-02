"use client";

import { Button, type buttonVariants } from "@/components/ui/button";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import type { IconHandle } from "@/types/icon";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ComponentType, Ref } from "react";

type Props = Omit<ComponentProps<"button">, "onMouseEnter" | "onMouseLeave"> &
	VariantProps<typeof buttonVariants> & {
		icon: ComponentType<{
			size?: number;
			color?: string;
			ref?: Ref<IconHandle>;
		}>;
		iconSize?: number;
		iconColor?: string;
	};

const IconButton: React.FC<Props> = ({
	icon: Icon,
	iconSize = 16,
	iconColor,
	variant,
	size,
	type = "button",
	children,
	...props
}) => {
	const { ref, triggerProps } = useIconHover();
	const content = (
		<>
			<Icon ref={ref} size={iconSize} color={iconColor} />
			{children}
		</>
	);

	if (!variant) {
		return (
			<button type={type} {...triggerProps} {...props}>
				{content}
			</button>
		);
	}

	return (
		<Button
			type={type}
			variant={variant}
			size={size}
			{...triggerProps}
			{...props}
		>
			{content}
		</Button>
	);
};

export default IconButton;
