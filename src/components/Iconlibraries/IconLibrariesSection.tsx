"use client";

import { motion, Variants } from "motion/react";
import { iconLibraries } from "./data";
import IconCard from "./IconCard";

const containerVariants: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.12,
		},
	},
};

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

const iconRowVariants: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const iconVariants: Variants = {
	hidden: { opacity: 0, y: 8 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
};

const IconLibrariesSection: React.FC = () => {
	return (
		<section className="relative border-t border-[var(--color-divider)]/50 py-18 lg:py-24">
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-14 text-center">
					<h2 className="text-2xl font-semibold text-[var(--color-textPrimary)] sm:text-3xl">
						Icon libraries, animated
					</h2>
					<p className="mt-3 text-sm text-[var(--color-textSecondary)]">
						Popular icon sets rebuilt with smooth motion and interactions.
					</p>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					className="grid gap-6 md:grid-cols-2"
				>
					{iconLibraries.map((data) => (
						<IconCard
							key={data.id}
							icons={data.icons}
							description={data.description}
							img={data.img}
							title={data.title}
							href={data.href}
						/>
					))}
				</motion.div>

				<p className="mt-12 text-center text-xs text-[var(--color-textMuted)]">
					More icon libraries will be added over time.
				</p>
			</div>
		</section>
	);
};

export default IconLibrariesSection;
