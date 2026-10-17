import { FRAMEWORK_GUIDES } from "@/app/icons/docs/_lib/frameworks";
import { FrameworkLogo } from "@/components/icons/FrameworkLogos";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import IconLink from "./IconLink";

const NEW_FRAMEWORKS = FRAMEWORK_GUIDES.filter(
	({ framework }) => framework !== "react",
);

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
			<span className="bg-primary/12 text-primary flex h-5.5 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium">
				<span className="relative flex size-1.5">
					<span className="bg-primary/60 absolute inset-0 animate-ping rounded-full motion-reduce:hidden" />
					<span className="bg-primary relative size-1.5 rounded-full" />
				</span>
				New
			</span>
			<span className="text-textMuted">Now for</span>
			<ul className="flex items-center gap-1.5">
				{NEW_FRAMEWORKS.map(({ framework, name, href }) => (
					<li key={framework}>
						<Link
							href={href}
							aria-label={`${name} guide`}
							className="bg-surfaceHover text-textPrimary flex h-6 items-center gap-1.5 rounded-full inset-ring inset-ring-white/6 max-sm:w-6 max-sm:justify-center sm:pr-2.5 sm:pl-2 [&_svg]:size-3"
						>
							<FrameworkLogo framework={framework} />
							<span className="text-[12.5px] font-medium max-sm:hidden">
								{name}
							</span>
						</Link>
					</li>
				))}
			</ul>
			<IconLink
				href="/icons/docs"
				icon={ArrowRight02Icon}
				iconSize={14}
				aria-label="Read the framework guides"
				className="text-textSecondary hover:text-textPrimary ml-auto flex items-center gap-1.5 font-medium transition-colors"
			>
				<span className="max-sm:hidden">Read the guides</span>
			</IconLink>
		</div>
	</div>
);

export default LaunchBanner;
