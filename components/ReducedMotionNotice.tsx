"use client";

import { XIcon } from "@/icons/lucide/x-icon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const STORAGE_KEY = "reduced-motion-dismissed";

const ReducedMotionWarning: React.FC = () => {
	const reduced = useReducedMotion();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!reduced) return;

		const dismissed = localStorage.getItem(STORAGE_KEY);
		if (!dismissed) {
			setVisible(true);
		}
	}, [reduced]);

	const handleDismiss = () => {
		localStorage.setItem(STORAGE_KEY, "true");
		setVisible(false);
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0, y: 40, scale: 0.96 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="fixed right-5 bottom-5 z-50"
				>
					<div className="border-warning/40 bg-surfaceElevated relative w-90 overflow-hidden rounded-xl border shadow-xl">
						<div className="bg-warning absolute top-0 left-0 h-full w-1" />

						<div className="border-warning/40 bg-surfaceElevated relative w-90 overflow-hidden rounded-xl border shadow-xl">
							<div className="bg-warning absolute top-0 left-0 h-full w-1" />

							<Button
								size="icon"
								variant="ghost"
								onClick={handleDismiss}
								className="text-textMuted hover:text-textPrimary absolute top-2 right-2 hover:bg-transparent"
							>
								<XIcon className="size-4" />
							</Button>

							<div className="flex items-start gap-3 p-4 pr-10">
								<div className="bg-warning/10 text-warning flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold">
									!
								</div>

								<div className="flex-1 space-y-1">
									<p className="text-textPrimary text-sm font-semibold">
										Animations are turned off
									</p>

									<p className="text-textSecondary text-xs leading-relaxed">
										Your system has Reduce Motion enabled, so icon animations
										are disabled. Turn off “Reduce Motion” in your system
										settings to experience full animations.
									</p>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ReducedMotionWarning;
