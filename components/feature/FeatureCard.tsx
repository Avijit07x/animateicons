"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import handleHover from "../../utils/handleHover";

type Props = {
	feature: FeatureItem;
};

const FeatureCard: React.FC<Props> = ({ feature }) => {
	const iconRef = useRef<{
		startAnimation: () => void;
		stopAnimation: () => void;
	} | null>(null);

	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 16 },
				show: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.45, ease: "easeOut" },
				},
			}}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className="group hover:bg-surfaceHover bg-surfaceElevated border-border rounded-2xl border p-6 transition-colors duration-300"
		>
			<div className="text-primary bg-surface mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg">
				<feature.Icon ref={iconRef} size={22} />
			</div>

			<h3 className="text-textPrimary mb-2 text-sm font-semibold">
				{feature.title}
			</h3>

			<p className="text-textSecondary text-sm">{feature.description}</p>
		</motion.div>
	);
};

export default FeatureCard;
