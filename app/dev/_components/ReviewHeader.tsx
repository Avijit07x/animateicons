"use client";

import LogoLink from "@/components/logo/LogoLink";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/icons/lucide/play-icon";
import { RefreshCwIcon } from "@/icons/lucide/refresh-cw-icon";
import type { IconHandle } from "@/types/icon";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useReview } from "../_contexts/ReviewContext";
import SearchField from "./SearchField";

type Props = {
	query: string;
	onQueryChange: (query: string) => void;
	total: number;
	visible: number;
};

const ReviewHeader: React.FC<Props> = ({
	query,
	onQueryChange,
	total,
	visible,
}) => {
	const router = useRouter();
	const { playAll, ready } = useReview();
	const [refreshing, startRefresh] = useTransition();
	const refreshIcon = useRef<IconHandle>(null);

	const refresh = () => {
		if (refreshing) return;
		refreshIcon.current?.startAnimation();
		startRefresh(() => router.refresh());
	};

	return (
		<header className="bg-bgDark/85 border-border/60 sticky top-0 z-50 border-b backdrop-blur-md">
			<div className="mx-auto flex h-14 max-w-384 items-center gap-4 px-4 lg:px-6">
				<div className="flex shrink-0 items-center gap-2.5">
					<LogoLink size={32} className="flex items-center" />
					<span className="text-textPrimary text-sm font-medium">
						Icon review
					</span>
					<span className="bg-primary/12 text-primary rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold">
						dev
					</span>
				</div>

				<SearchField
					value={query}
					onChange={onQueryChange}
					total={total}
					className="mx-auto hidden max-w-72 md:flex"
				/>

				<div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
					<Button
						variant="secondary"
						size="sm"
						aria-busy={refreshing}
						onClick={refresh}
					>
						<RefreshCwIcon ref={refreshIcon} size={14} />
						<span className="hidden sm:inline">Refresh</span>
					</Button>
					<Button size="sm" onClick={playAll} disabled={!ready || !visible}>
						<PlayIcon size={14} />
						Play all
					</Button>
				</div>
			</div>
		</header>
	);
};

export default ReviewHeader;
