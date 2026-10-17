import { Button } from "@/components/ui/button";
import { toIconSlug } from "@/lib/request";
import { motion } from "motion/react";
import React from "react";
import { useRequest } from "../../_contexts/RequestContext";

type Props = {
	query: string;
};

const IconsNotFound: React.FC<Props> = ({ query }) => {
	const { openRequest } = useRequest();

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center"
		>
			<h2 className="text-textPrimary text-xl font-semibold tracking-tight">
				No icons found<span className="text-primary">.</span>
			</h2>
			<p className="text-textSecondary mt-2 max-w-xs text-sm leading-relaxed">
				Nothing matches your search. Try a different or simpler keyword.
			</p>

			<div className="bg-surface mt-7 flex w-full max-w-sm items-center gap-3 rounded-[22px] bg-[radial-gradient(90%_140%_at_100%_0%,rgb(244_91_72/0.14),transparent_65%)] py-2 pr-2 pl-5 text-left">
				<div className="min-w-0 flex-1">
					<p className="text-textPrimary text-sm font-medium">
						Can&apos;t find it? I&apos;ll make it.
					</p>
					<p className="text-textSecondary text-xs">
						Custom animated icons, in the same style.
					</p>
				</div>
				<Button
					size="sm"
					className="shrink-0"
					onClick={() => openRequest({ type: "icon", icon: toIconSlug(query) })}
				>
					Request it
				</Button>
			</div>
		</motion.div>
	);
};

export default IconsNotFound;
