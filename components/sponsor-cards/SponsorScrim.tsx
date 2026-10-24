"use client";

import { AnimatePresence, m } from "motion/react";

type Props = {
	open: boolean;
	onClose: () => void;
};

const SponsorScrim: React.FC<Props> = ({ open, onClose }) => (
	<AnimatePresence>
		{open && (
			<m.div
				key="scrim"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{
					opacity: 0,
					transition: { duration: 0.35, delay: 0.1, ease: "easeOut" },
				}}
				transition={{ duration: 0.3, ease: "easeOut" }}
				onClick={onClose}
				className="fixed inset-0 z-60 bg-black/25 backdrop-blur-sm"
			/>
		)}
	</AnimatePresence>
);

export default SponsorScrim;
