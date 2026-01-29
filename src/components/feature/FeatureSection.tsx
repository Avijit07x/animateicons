"use client";

import { motion, Variants } from "motion/react";
import { featureList } from "./data";

const containerVariants: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.12,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.45,
			ease: "easeOut",
		},
	},
};

const FeatureSection = () => {
	return (
		<section className="relative border-t border-[var(--color-divider)]/50 py-18 lg:py-24">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<h2 className="text-2xl font-semibold text-[var(--color-textPrimary)] sm:text-3xl">
						Built for motion-first icons
					</h2>
					<p className="mt-3 text-sm text-[var(--color-textSecondary)]">
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
					{featureList.map((feature: FeatureItem) => (
						<motion.div
							key={feature.id}
							variants={itemVariants}
							className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surfaceElevated)] p-6 transition-colors duration-300 hover:bg-[var(--color-surfaceHover)]"
						>
							<div className="text-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface)]">
								<feature.Icon size={22} />
							</div>

							<h3 className="mb-2 text-sm font-semibold text-[var(--color-textPrimary)]">
								{feature.title}
							</h3>

							<p className="text-sm leading-relaxed text-[var(--color-textSecondary)]">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default FeatureSection;
