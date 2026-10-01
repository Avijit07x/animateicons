"use client";

import FloatingIcons from "@/components/FloatingIcons";
import IconLink from "@/components/IconLink";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { LIBRARIES } from "./libraries";

const Libraries: React.FC = () => (
	<section aria-label="Icon libraries" className="home-section">
		<div className="mx-auto max-w-7xl px-6">
			<h2 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
				Two libraries. One motion system
				<span className="text-primary">.</span>
			</h2>

			<div className="mt-11 grid gap-16 lg:grid-cols-2 lg:gap-8">
				{LIBRARIES.map((lib) => (
					<div key={lib.id}>
						<div className="relative h-60">
							<FloatingIcons
								items={lib.icons}
								cols={4}
								rows={3}
								className="[mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
							/>
						</div>

						<p className="text-textPrimary mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
							{lib.title}
						</p>
						<p className="text-textMuted mt-2 text-sm">{lib.count} icons</p>
						<p className="text-textSecondary mx-auto mt-5 max-w-xs leading-relaxed max-sm:text-[15px]">
							{lib.body}
						</p>
						<IconLink
							href={`/icons/${lib.id}`}
							prefetch={false}
							icon={ArrowRight02Icon}
							className="text-primary hover:text-primaryHover mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
						>
							Browse {lib.title}
						</IconLink>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default Libraries;
