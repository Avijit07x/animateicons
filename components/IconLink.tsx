"use client";

import { Button, type buttonVariants } from "@/components/ui/button";
import { useIconHover } from "@/hooks/useIconHover";
import type { IconHandle } from "@/types/icon";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps, ComponentType, Ref } from "react";

type Props = Omit<
	ComponentProps<typeof Link>,
	"onMouseEnter" | "onMouseLeave"
> &
	VariantProps<typeof buttonVariants> & {
		icon: ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;
		iconSize?: number;
	};

const IconLink: React.FC<Props> = ({
	icon: Icon,
	iconSize = 16,
	variant,
	size,
	className,
	children,
	...props
}) => {
	const { ref, hoverProps } = useIconHover();
	const content = (
		<>
			{children}
			<Icon ref={ref} size={iconSize} />
		</>
	);

	if (!variant) {
		return (
			<Link {...hoverProps} className={className} {...props}>
				{content}
			</Link>
		);
	}

	return (
		<Button asChild variant={variant} size={size} className={className}>
			<Link {...hoverProps} {...props}>
				{content}
			</Link>
		</Button>
	);
};

export default IconLink;
