"use client";

import FloatingIcons from "@/components/FloatingIcons";
import IconLink from "@/components/IconLink";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { SHOWCASE } from "./showcase-icons";

const FOOTER_ICONS = [...SHOWCASE].reverse().slice(0, 12);

const FooterCta: React.FC = () => (
	<section aria-label="Get started" className="relative">
		<div className="absolute inset-y-0 left-1/2 w-full max-w-480 -translate-x-1/2">
			<FloatingIcons
				items={FOOTER_ICONS}
				cols={6}
				rows={2}
				className="[mask-image:radial-gradient(ellipse_48%_60%_at_50%_50%,transparent_60%,black_100%)] max-sm:hidden"
			/>
		</div>

		<div className="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center max-sm:min-h-0 lg:py-24">
			<h2 className="text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				<span className="text-textPrimary">Make every icon </span>
				<span className="text-primary">move.</span>
			</h2>
			<p className="text-textSecondary mt-4 max-w-md text-sm leading-relaxed max-sm:text-[15px] sm:text-base">
				{ICON_COUNTS.total} open-source animated SVG icons for React. One motion
				system, two libraries.
			</p>

			<div className="mt-9 flex flex-wrap items-center justify-center gap-3 max-sm:w-full max-sm:max-w-74 max-sm:flex-col">
				<IconLink
					href="/icons/lucide"
					prefetch={false}
					icon={ArrowRight02Icon}
					variant="default"
					size="pill"
					className="max-sm:w-full"
				>
					Browse {ICON_COUNTS.total} icons
				</IconLink>
				<IconLink
					href="https://github.com/Avijit07x/animateicons"
					target="_blank"
					rel="noopener noreferrer"
					icon={ArrowUpRight01Icon}
					variant="secondary"
					size="pill"
					className="max-sm:w-full"
				>
					Star on GitHub
				</IconLink>
			</div>
		</div>
	</section>
);

export default FooterCta;
