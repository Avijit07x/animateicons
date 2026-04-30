"use client";

import Section from "@/components/section/Section";
import SectionHeader from "@/components/section/SectionHeader";
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
		<Section>
			<SectionHeader
				title="Built for motion-first icons"
				subtitle="Every icon is designed as an interactive component, not a static SVG."
			/>

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
		</Section>
	);
};

export default FeatureSection;
