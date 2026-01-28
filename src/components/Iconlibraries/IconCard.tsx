import { MoveRightIcon } from "@/Icons/lucide/MoveRightIcon";
import { motion, Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";

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
const IconCard: React.FC<IconLibraryCardData> = ({
	icons,
	description,
	img,
	title,
	href,
}) => {
	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true }}
			className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surfaceElevated)] p-3 transition-colors duration-300 hover:bg-[var(--color-surfaceHover)]"
		>
			<div className="space-y-4 rounded-xl bg-[var(--color-surface)] p-6">
				<div className="flex items-center justify-start gap-2">
					<Image
						src={img.href}
						className={img.className}
						width={100}
						height={100}
						alt={title}
					/>
					<h3 className="text-primaryHover text-lg font-semibold lg:text-xl">
						{title}
					</h3>
				</div>

				<p className="text-sm text-[var(--color-textSecondary)]">
					{description}
				</p>

				<motion.div
					variants={iconRowVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="mb-6 flex flex-wrap items-center gap-5"
				>
					{icons.map((Icon, index) => (
						<motion.div key={index} variants={iconVariants}>
							<Icon
								size={28}
								className="hover:text-primary text-textSecondary cursor-pointer transition-colors duration-300"
							/>
						</motion.div>
					))}
				</motion.div>
			</div>

			<Link
				href={href}
				className="flex items-center justify-between bg-[var(--color-surfaceElevated)] px-6 py-4 text-sm text-[var(--color-textPrimary)] transition-colors duration-300 group-hover:bg-[var(--color-surfaceHover)]"
			>
				<span>Explore</span>
				<MoveRightIcon size={18} />
			</Link>
		</motion.div>
	);
};

export default IconCard;
