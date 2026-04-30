/**
 * Section
 *
 * SRP: shared shell for AnimateIcons landing-page sections (Features,
 * IconLibraries, etc.). Owns the spacing, max-width, and border-top
 * rhythm that gives the homepage its consistent vertical cadence.
 *
 * FeatureSection and IconLibrariesSection both rendered the same
 * `<section className="border-divider/50 relative border-t py-18 lg:py-24">`
 * shell — extracting it here means new sections inherit the AnimateIcons
 * homepage rhythm by default and don't drift out of sync.
 */

import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement> & {
	/** Drops the top border. Useful for the first section under the AnimateIcons hero. */
	noBorder?: boolean;
};

const Section: React.FC<Props> = ({
	className,
	noBorder = false,
	children,
	...props
}) => {
	return (
		<section
			className={cn(
				"relative py-18 lg:py-24",
				!noBorder && "border-divider/50 border-t",
				className,
			)}
			{...props}
		>
			<div className="mx-auto max-w-6xl px-4">{children}</div>
		</section>
	);
};

export default Section;
