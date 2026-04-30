"use client";

import Section from "@/components/section/Section";
import SectionHeader from "@/components/section/SectionHeader";
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

const IconLibrariesSection: React.FC = () => {
	return (
		<Section>
			<SectionHeader
				title="Icon libraries, animated"
				subtitle="Popular icon sets rebuilt with smooth motion and interactions."
				spacing="tight"
			/>

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

			<p className="text-textMuted mt-12 text-center text-xs">
				The library is updated regularly with new icon sets.
			</p>
		</Section>
	);
};

export default IconLibrariesSection;
