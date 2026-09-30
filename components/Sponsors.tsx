"use client";

import { useCopy } from "@/hooks/useCopy";
import { useIconHover } from "@/hooks/useIconHover";
import { Cancel01Icon } from "@/icons/huge/cancel-0-1-icon";
import { CheckIcon } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { CreditCardIcon } from "@/icons/huge/credit-card-icon";
import { HeartIcon } from "@/icons/huge/heart-icon";
import { MoneyBag01Icon } from "@/icons/huge/money-bag-0-1-icon";
import type { IconHandle } from "@/types/icon";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentType, type Ref } from "react";

type SponsorIcon = ComponentType<{
	size?: number;
	color?: string;
	ref?: Ref<IconHandle>;
}>;

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
const UPI_ID = "avijit07x@axl";

const SponsorLink: React.FC<{
	href: string;
	label: string;
	ariaLabel: string;
	icon: SponsorIcon;
	color: string;
}> = ({ href, label, ariaLabel, icon: Icon, color }) => {
	const { ref, hoverProps } = useIconHover();

	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={ariaLabel}
			{...hoverProps}
			className="text-textPrimary flex items-center gap-2.5 rounded-full bg-white/8 px-4 py-2.5 text-sm transition-colors hover:bg-white/12"
		>
			<Icon ref={ref} size={16} color={color} />
			<span>{label}</span>
		</Link>
	);
};

const Sponsors: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { copied, copy } = useCopy(1500);
	const { ref: heartRef, hoverProps: heartHoverProps } = useIconHover();
	const { ref: copyRef, hoverProps: copyHoverProps } = useIconHover();

	const toggle = () => setIsOpen((open) => !open);

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeOut" }}
						onClick={toggle}
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
						height: isOpen ? 440 : 44,
						borderRadius: isOpen ? 22 : 999,
					}}
					transition={{
						y: SPRING,
						width: SPRING,
						height: SPRING,
						borderRadius: { duration: 0.08, ease: "linear" },
					}}
					className="bg-surfaceElevated relative flex flex-col overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
				>
					<button
						type="button"
						onClick={toggle}
						aria-label={isOpen ? "Close sponsor panel" : "Open sponsor options"}
						aria-expanded={isOpen}
						aria-controls="sponsor-panel"
						{...heartHoverProps}
						className={`${
							isOpen ? "m-2 ml-auto size-7" : "size-11"
						} text-textSecondary hover:text-textPrimary flex items-center justify-center rounded-full transition-colors`}
					>
						{isOpen ? (
							<Cancel01Icon size={16} />
						) : (
							<HeartIcon
								ref={heartRef}
								size={18}
								color="var(--color-primary)"
							/>
						)}
					</button>

					<AnimatePresence>
						{isOpen && (
							<motion.div
								id="sponsor-panel"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 6 }}
								transition={{ duration: 0.25, ease: "easeOut" }}
								className="flex w-full flex-col gap-2 px-3 pb-3"
							>
								<SponsorLink
									href="https://buymeacoffee.com/avijit07x"
									label="Buy Me Coffee"
									ariaLabel="Support via Buy Me a Coffee"
									icon={MoneyBag01Icon}
									color="var(--color-warning)"
								/>
								<SponsorLink
									href="https://github.com/sponsors/avijit07x"
									label="GitHub Sponsors"
									ariaLabel="Sponsor on GitHub"
									icon={HeartIcon}
									color="var(--color-primary)"
								/>
								<SponsorLink
									href="https://paypal.me/avijit07x"
									label="PayPal"
									ariaLabel="Donate via PayPal"
									icon={CreditCardIcon}
									color="var(--color-success)"
								/>

								<div className="mt-1 flex flex-col items-center gap-3 rounded-3xl bg-white/6 p-3">
									<div className="flex w-full items-center justify-between">
										<span className="text-textPrimary text-sm font-medium">
											UPI Payment
										</span>
										<button
											type="button"
											onClick={() => copy(UPI_ID)}
											aria-label="Copy UPI ID"
											{...copyHoverProps}
											className="text-textSecondary hover:text-textPrimary flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
										>
											{copied ? (
												<CheckIcon size={14} color="var(--color-success)" />
											) : (
												<CopyIcon ref={copyRef} size={14} />
											)}
										</button>
									</div>
									<Image
										src="qrcode.svg"
										alt={`UPI QR code for ${UPI_ID} payment`}
										width={150}
										height={100}
										className="rounded-xl"
									/>
									<div className="text-textMuted text-center text-xs">
										<p>
											UPI ID:{" "}
											<span className="text-textSecondary">{UPI_ID}</span>
										</p>
										<p className="mt-1">Scan to pay with any UPI app</p>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</>
	);
};

export default Sponsors;
