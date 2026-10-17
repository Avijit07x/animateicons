import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { cn } from "@/lib/utils";
import IconLink from "./IconLink";

type Props = {
	className?: string;
};

const LaunchBanner: React.FC<Props> = ({ className }) => (
	<div className="bg-bgDark border-b border-white/7 bg-[radial-gradient(420px_60px_at_0%_50%,rgb(244_91_72/0.09),transparent_70%)]">
		<div
			className={cn(
				"mx-auto flex h-10 items-center gap-2.5 text-[13px] whitespace-nowrap",
				className,
			)}
		>
			<span className="relative flex size-1.5 shrink-0">
				<span className="bg-primary/60 absolute inset-0 animate-ping rounded-full motion-reduce:hidden" />
				<span className="bg-primary relative size-1.5 rounded-full" />
			</span>
			<span className="text-textPrimary shrink-0 font-medium">
				Just launched
			</span>
			<span aria-hidden="true" className="text-white/20 max-sm:hidden">
				·
			</span>
			<span className="text-textMuted min-w-0 truncate">
				<span className="max-sm:hidden">
					AnimateIcons now works with Vue, Angular and plain JavaScript.
				</span>
				<span className="sm:hidden">Vue, Angular and plain JS</span>
			</span>
			<IconLink
				href="/icons/docs"
				icon={ArrowRight02Icon}
				iconSize={14}
				aria-label="Get started with Vue, Angular or plain JavaScript"
				className="text-primary ml-auto flex shrink-0 items-center gap-1.5 font-medium"
			>
				<span className="max-sm:hidden">Get started</span>
			</IconLink>
		</div>
	</div>
);

export default LaunchBanner;
