"use client";

import { motion, Variants } from "motion/react";
import { featureList } from "./data";
import FeatureCard from "./FeatureCard";

const containerVariants: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.12,
		},
	},
};

const FeatureSection = () => {
	return (
		<section className="border-divider/50 relative border-t py-18 lg:py-24">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<h2 className="text-textPrimary text-2xl font-semibold sm:text-3xl">
						Built for motion-first icons
					</h2>
					<p className="text-textSecondary mt-3 text-sm">
						Every icon is designed as an interactive component, not a static
						SVG.
					</p>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
				>
					{featureList.map((feature) => (
						<FeatureCard key={feature.id} feature={feature} />
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default FeatureSection;
