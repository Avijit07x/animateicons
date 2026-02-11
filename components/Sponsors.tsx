"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { HeartIcon, HeartIconHandle } from "../icons/huge/heart-icon";
import { CoffeeIcon, CoffeeIconHandle } from "../icons/lucide/coffee-icon";
import { CopyIcon, CopyIconHandle } from "../icons/lucide/copy-icon";
import {
	DollarSignIcon,
	DollarSignIconHandle,
} from "../icons/lucide/dollar-sign-icon";
import { XIcon } from "../icons/lucide/x-icon";
import handleHover from "../utils/handleHover";
import { CheckIcon } from "./icons/CheckIcon";

type Props = {};

const Sponsors: React.FC<Props> = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);
	const hoverEnabledRef = useRef(false);
	const dollarRef = useRef<DollarSignIconHandle>(null);
	const heartRef = useRef<HeartIconHandle>(null);
	const heRef = useRef<HeartIconHandle>(null);
	const coffeeRef = useRef<CoffeeIconHandle>(null);
	const copyRef = useRef<CopyIconHandle>(null);

	const toggleSponsors = () => {
		setIsOpen(!isOpen);
		hoverEnabledRef.current = false;
	};

	const handleCopyUpi = async () => {
		try {
			await navigator.clipboard.writeText("avijit07x@axl");
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeOut" }}
						onClick={toggleSponsors}
						className="fixed inset-0 z-150 bg-black/25 backdrop-blur-sm"
					/>
				)}
			</AnimatePresence>

			<div className="fixed right-7 bottom-5 z-200">
				<motion.div
					initial={{ y: 80 }}
					animate={{
						y: 0,
						width: isOpen ? 280 : 44,
						height: isOpen ? 450 : 44,
						borderRadius: isOpen ? 20 : 999,
					}}
					transition={{
						y: {
							type: "spring",
							stiffness: 260,
							damping: 28,
						},
						width: {
							type: "spring",
							stiffness: 260,
							damping: 28,
						},
						height: {
							type: "spring",
							stiffness: 260,
							damping: 28,
						},
						borderRadius: {
							duration: 0.08,
							ease: "linear",
						},
					}}
					onAnimationComplete={() => {
						if (isOpen) hoverEnabledRef.current = true;
					}}
					className="from-bgDark to-bgDark border-primary/25 relative flex flex-col overflow-hidden border bg-linear-to-br via-zinc-900"
				>
					<button
						onClick={toggleSponsors}
						className={`${
							isOpen ? "m-2 ml-auto size-6" : "size-11"
						} group flex items-center justify-center`}
						aria-label={isOpen ? "Close sponsor panel" : "Open sponsor options"}
						aria-expanded={isOpen}
						aria-controls="sponsor-panel"
						onMouseEnter={(e) => handleHover(e, heRef)}
						onMouseLeave={(e) => handleHover(e, heRef)}
					>
						{isOpen ? (
							<XIcon className="size-4 text-red-500 transition-transform duration-300 group-hover:scale-110" />
						) : (
							<HeartIcon ref={heRef} className="size-4.5 text-pink-500" />
						)}
					</button>

					<AnimatePresence>
						{isOpen && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 6 }}
								transition={{
									duration: 0.25,
									ease: "easeOut",
								}}
								className="text-textPrimary flex w-full flex-col gap-3 px-4 pb-4"
							>
								<Link
									href="https://buymeacoffee.com/avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Support via Buy Me a Coffee"
									className="bg-primary/20 hover:bg-primary/25 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-300"
									onMouseEnter={(e) => handleHover(e, coffeeRef)}
									onMouseLeave={(e) => handleHover(e, coffeeRef)}
								>
									<CoffeeIcon
										ref={coffeeRef}
										className="size-4.5 text-yellow-400"
									/>
									<span>Buy Me Coffee</span>
								</Link>

								<Link
									href="https://github.com/sponsors/avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Sponsor on GitHub"
									className="bg-primary/20 hover:bg-primary/25 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-300"
									onMouseEnter={(e) => handleHover(e, heartRef)}
									onMouseLeave={(e) => handleHover(e, heartRef)}
								>
									<HeartIcon ref={heartRef} className="size-4 text-pink-500" />
									<span>GitHub Sponsors</span>
								</Link>

								<Link
									href="https://paypal.me/avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Donate via PayPal"
									className="bg-primary/20 hover:bg-primary/25 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-300"
									onMouseEnter={(e) => handleHover(e, dollarRef)}
									onMouseLeave={(e) => handleHover(e, dollarRef)}
								>
									<DollarSignIcon
										ref={dollarRef}
										className="size-4 text-green-500"
										duration={0.7}
									/>
									<span>PayPal</span>
								</Link>

								<button
									onClick={handleCopyUpi}
									onMouseEnter={(e) => handleHover(e, copyRef)}
									onMouseLeave={(e) => handleHover(e, copyRef)}
									aria-label="Copy UPI ID and view QR code for payment"
									aria-live="polite"
									className="bg-primary/20 hover:bg-primary/25 flex flex-col items-center gap-2 rounded-md px-3 py-3 text-sm transition-colors duration-300"
								>
									<div className="flex w-full items-center justify-between">
										<span className="font-medium">UPI Payment</span>
										<span className="size-4">
											{copied ? (
												<CheckIcon className="size-4 text-green-500" />
											) : (
												<CopyIcon
													ref={copyRef}
													className="size-3.5 text-gray-400"
												/>
											)}
										</span>
									</div>
									<div className="flex justify-center pt-2">
										<Image
											src="qrcode.svg"
											alt="UPI QR code for avijit07x@axl payment"
											width={150}
											height={100}
											className="rounded-xs"
										/>
									</div>
									<div className="text-textSecondary flex items-center gap-2 text-xs">
										<span>UPI ID:</span>
										<span>avijit07x@axl</span>
									</div>

									<span className="text-xs">Scan to pay with any UPI app</span>
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</>
	);
};

export default Sponsors;
