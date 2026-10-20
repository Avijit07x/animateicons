"use client";

import { getLibraryIcon } from "@/lib/library-icons";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import type { IconHandle } from "@/types/icon";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	library: IconLibrary;
	name: string;
};

const RelatedIconCard: React.FC<Props> = ({ library, name }) => {
	const { ref, triggerProps } = useIconHover();
	const IconComponent = getLibraryIcon(library, name) as React.ComponentType<{
		size?: number;
		ref?: React.Ref<IconHandle>;
	}>;

	return (
		<Link
			href={`/icons/${library}/${name}`}
			{...triggerProps}
			className="group text-textPrimary bg-surface hover:bg-surfaceElevated flex h-32 flex-col items-center justify-center gap-3 rounded-3xl p-3 transition-colors duration-300"
		>
			<span className="group-hover:text-primary inline-flex transition-colors duration-300">
				<Suspense fallback={<span className="size-8" />}>
					<IconComponent ref={ref} size={32} />
				</Suspense>
			</span>
			<span className="text-textMuted line-clamp-1 font-mono text-[13px]">
				{name}
			</span>
		</Link>
	);
};

export default RelatedIconCard;
