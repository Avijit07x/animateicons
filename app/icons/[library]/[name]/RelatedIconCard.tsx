"use client";

import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";
import { useRef } from "react";

type Props = {
	href: string;
	name: string;
	Icon: React.ElementType;
};

const RelatedIconCard: React.FC<Props> = ({ href, name, Icon }) => {
	const iconRef = useRef<IconHandle | null>(null);
	const IconComponent = Icon as React.ComponentType<{
		size?: number;
		ref?: React.Ref<IconHandle>;
	}>;

	return (
		<Link
			href={href}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className="group text-textPrimary bg-surface hover:bg-surfaceElevated flex h-32 flex-col items-center justify-center gap-3 rounded-3xl p-3 transition-colors duration-300"
		>
			<span className="group-hover:text-primary inline-flex transition-colors duration-300">
				<IconComponent ref={iconRef} size={32} />
			</span>
			<span className="text-textMuted line-clamp-1 font-mono text-[13px]">
				{name}
			</span>
		</Link>
	);
};

export default RelatedIconCard;
