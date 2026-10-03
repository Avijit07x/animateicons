"use client";

import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import Link from "next/link";
import Logo from "./Logo";

type Props = {
	size: number;
	className?: string;
	logoClassName?: string;
	children?: React.ReactNode;
};

const LogoLink: React.FC<Props> = ({
	size,
	className,
	logoClassName,
	children,
}) => {
	const { ref, triggerProps } = useIconHover();

	return (
		<Link
			href="/"
			aria-label="AnimateIcons"
			className={className}
			{...triggerProps}
		>
			<Logo ref={ref} size={size} className={logoClassName} />
			{children}
		</Link>
	);
};

export default LogoLink;
