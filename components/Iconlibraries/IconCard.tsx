import { motion, Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { MoveRightIcon } from "@/icons/lucide/move-right-icon";

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
			className="group hover:bg-surfaceHover bg-surfaceElevated border-border overflow-hidden rounded-2xl border p-3 transition-colors duration-300"
		>
			<div className="bg-surface space-y-4 rounded-xl p-6">
				<div className="flex items-center justify-start gap-2">
					<Image
						src={img.href}
						className={img.className}
						width={100}
						height={100}
						alt={title}
					/>
					<h3 className="text-primary text-lg font-semibold lg:text-xl">
						{title}
					</h3>
				</div>

				<p className="text-textSecondary text-sm">{description}</p>

				<motion.div
					variants={iconRowVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="my-6 flex flex-wrap items-center gap-5"
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
				className="text-textPrimary group-hover:bg-surfaceHover bg-surfaceElevated flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors duration-300"
			>
				<span>Explore</span>
				<MoveRightIcon size={20} />
			</Link>
		</motion.div>
	);
};

export default IconCard;
