"use client";

import type { IconSearchEntry } from "@/lib/icon-search";
import type { IconHandle } from "@/types/icon";
import Link from "next/link";
import {
	memo,
	useCallback,
	useEffect,
	useRef,
	type ComponentType,
	type CSSProperties,
	type Ref,
} from "react";
import HoverIcon from "./HoverIcon";

const STAGGER_MS = 60;
const PLAY_DELAY_MS = 260;

type Props = { entry: IconSearchEntry; index: number };

const SearchResult = memo(function SearchResult({ entry, index }: Props) {
	const handleRef = useRef<IconHandle | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const Icon = entry.component as ComponentType<{
		size?: number;
		ref?: Ref<IconHandle>;
	}>;

	useEffect(() => () => clearTimeout(timer.current), []);

	const playOnArrival = useCallback(
		(handle: IconHandle | null) => {
			handleRef.current = handle;
			clearTimeout(timer.current);
			if (!handle) return;
			timer.current = setTimeout(
				() => handleRef.current?.startAnimation(),
				PLAY_DELAY_MS + index * STAGGER_MS,
			);
		},
		[index],
	);

	return (
		<Link
			href={`/icons/${entry.library}/${entry.name}`}
			prefetch={false}
			title={entry.name}
			style={{ animationDelay: `${index * STAGGER_MS}ms` } as CSSProperties}
			className="group animate-in fade-in zoom-in-50 fill-mode-backwards flex w-24 flex-col items-center gap-2.5 duration-500"
		>
			<HoverIcon
				Icon={Icon}
				size={34}
				iconRef={playOnArrival}
				className="bg-surfaceElevated hover:bg-primary size-23 rounded-full hover:text-white"
			/>
			<span className="text-textMuted group-hover:text-textPrimary w-full truncate text-xs transition-colors">
				{entry.name}
			</span>
		</Link>
	);
});

export default SearchResult;
