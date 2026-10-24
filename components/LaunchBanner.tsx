"use client";

import {
	FRAMEWORK_LABELS,
	FRAMEWORKS,
} from "@/app/icons/_contexts/DistributionContext";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import IconLink from "./IconLink";
import { FrameworkLogo } from "./icons/FrameworkLogos";

type Props = {
	className?: string;
};

const LaunchBanner: React.FC<Props> = ({ className }) => (
	<div className="bg-bgDark border-b border-white/7">
		<div
			className={cn(
				"mx-auto flex h-10 items-center gap-2.5 text-[13px] whitespace-nowrap",
				className,
			)}
		>
			<span className="bg-primary flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-medium text-(--cta-text)">
				New
			</span>
			<span className="text-textSecondary shrink-0">Now for</span>
			<ul className="flex min-w-0 items-center gap-1.5">
				{FRAMEWORKS.map((framework) => (
					<li key={framework}>
						<Link
							href={`/icons/docs/${framework}`}
							prefetch={false}
							className="bg-surface text-textSecondary hover:bg-surfaceElevated hover:text-textPrimary focus-visible:ring-primary/60 flex h-6.5 items-center gap-1.5 rounded-full px-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:w-6.5 max-sm:justify-center max-sm:px-0"
						>
							<FrameworkLogo framework={framework} className="size-3.25" />
							<span className="max-sm:sr-only">
								{FRAMEWORK_LABELS[framework]}
							</span>
						</Link>
					</li>
				))}
			</ul>
			<IconLink
				href="/icons/docs"
				icon={ArrowRight02Icon}
				iconSize={14}
				aria-label="Read the docs"
				className="text-textPrimary ml-auto flex shrink-0 items-center gap-1.5 font-medium"
			>
				<span className="max-sm:hidden">Read the docs</span>
			</IconLink>
		</div>
	</div>
);

export default LaunchBanner;
