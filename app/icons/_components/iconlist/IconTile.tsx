"use client";

/**
 * IconTile
 *
 * SRP: render one AnimateIcons tile in the gallery grid - the animated
 * icon, its name, and the action row. Clicking the cell opens the
 * playground sheet via PlaygroundContext, so users explore without
 * leaving the gallery. Per-icon detail pages still exist at
 * `/icons/<library>/<name>` for SEO / direct shares / OG images, but
 * the gallery itself doesn't link to them - they're crawler-only.
 */

import type { IconFilteredItem } from "@/hooks/useIconFilter";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import {
	iconNameToComponent,
	usePlayground,
} from "../../_contexts/PlaygroundContext";
import IconTileActions from "./IconTileActions";

type Props = {
	item: IconFilteredItem;
	getIcon: (name: string) => React.ElementType;
};

const IconTile: React.FC<Props> = ({ item, getIcon }) => {
	const { library, prefix } = useIconLibrary();
	const { openPlayground } = usePlayground();
	const iconRef = React.useRef<IconHandle>(null);
	const tileRef = React.useRef<HTMLDivElement>(null);
	const [inView, setInView] = React.useState(false);

	React.useEffect(() => {
		const el = tileRef.current;
		if (!el || inView) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setInView(true);
					io.disconnect();
				}
			},
			{ rootMargin: "800px 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [inView]);

	if (!library || !prefix) {
		throw new Error("useIconLibrary used outside /icons route");
	}

	const tileId = `${library}-${item.name}`;
	// getIcon returns a module-cached React.lazy component (stable per name),
	// so this dynamic reference is safe.
	const IconComponent = getIcon(item.name) as React.ComponentType<{
		size?: number;
		ref?: React.Ref<IconHandle>;
	}>;

	const handleOpen = () =>
		openPlayground({
			name: item.name,
			library,
			prefix,
			Component: IconComponent,
			componentName: iconNameToComponent(item.name),
		});

	return (
		<div
			ref={tileRef}
			onClick={handleOpen}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className="group border-border/60 text-textPrimary hover:bg-surface/60 relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-r border-b p-4 text-sm transition-colors"
		>
			{(item.isNew || item.isUpdated) && (
				<span
					className={cn(
						"pointer-events-none absolute top-3 -left-9 w-28 -rotate-45 border-y py-0.5 text-center font-mono text-[9px] tracking-widest uppercase",
						item.isNew
							? "border-primary/30 bg-primary/10 text-primary"
							: "border-info/30 bg-info/10 text-info",
					)}
				>
					{item.isNew ? "New" : "Update"}
				</span>
			)}

			<button
				type="button"
				aria-label={`Open ${item.name} in playground`}
				onClick={(e) => {
					e.stopPropagation();
					handleOpen();
				}}
				className="border-border/70 text-textMuted hover:border-primary/50 hover:text-primary focus-visible:border-primary/50 focus-visible:text-primary absolute top-0 right-0 inline-flex size-7 items-center justify-center border-b border-l opacity-0 transition-[opacity,color,border-color] group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
			>
				<ArrowUpRight className="size-3.5" />
			</button>

			<div className="group-hover:text-primary inline-flex size-12 items-center justify-center rounded-md p-3 transition-colors">
				{inView ? (
					<React.Suspense fallback={null}>
						<IconComponent ref={iconRef} size={23} />
					</React.Suspense>
				) : null}
			</div>
			<p className="text-textSecondary line-clamp-1 font-mono text-xs">
				{item.name}
			</p>

			<IconTileActions
				tileId={tileId}
				library={library}
				prefix={prefix}
				name={item.name}
			/>
		</div>
	);
};

export default React.memo(IconTile);
