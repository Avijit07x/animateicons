/**
 * SectionHeader
 *
 * SRP: standardized title + subtitle pair for AnimateIcons landing-page
 * sections. Centered headline block matching the homepage typography.
 *
 * The two existing sections (FeatureSection — "Built for motion-first
 * icons", IconLibrariesSection — "Icon libraries, animated") used near-
 * identical headers with one difference in bottom margin; the `spacing`
 * prop preserves that variant without forking the component.
 */

import { cn } from "@/lib/utils";

type Props = {
	title: string;
	subtitle?: string;
	/** Bottom margin variant. Some AnimateIcons sections want tighter spacing. */
	spacing?: "default" | "tight";
	className?: string;
};

const SPACING_CLASS: Record<NonNullable<Props["spacing"]>, string> = {
	default: "mb-16",
	tight: "mb-14",
};

const SectionHeader: React.FC<Props> = ({
	title,
	subtitle,
	spacing = "default",
	className,
}) => {
	return (
		<div className={cn(SPACING_CLASS[spacing], "text-center", className)}>
			<h2 className="text-textPrimary text-2xl font-semibold sm:text-3xl">
				{title}
			</h2>
			{subtitle ? (
				<p className="text-textSecondary mt-3 text-sm">{subtitle}</p>
			) : null}
		</div>
	);
};

export default SectionHeader;
