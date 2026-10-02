"use client";

import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { Cancel01Icon } from "@/icons/huge/cancel-0-1-icon";
import { CheckIcon } from "@/icons/huge/check-icon";
import { Coffee02Icon } from "@/icons/huge/coffee-0-2-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { CreditCardIcon } from "@/icons/huge/credit-card-icon";
import { HeartIcon } from "@/icons/huge/heart-icon";
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

const MotionButton = motion.create(Button);

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
const UPI_ID = "avijit07x@axl";

const triggerConfig = [
	{ icon: "heart", trigger: "hover" },
	{ icon: "close", trigger: "hover" },
	{ icon: "copyUpi", trigger: "hover" },
] as const;

const SponsorLink: React.FC<{
	href: string;
	label: string;
	ariaLabel: string;
	icon: SponsorIcon;
	color: string;
}> = ({ href, label, ariaLabel, icon: Icon, color }) => {
	const { ref, triggerProps } = useIconHover();

	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={ariaLabel}
			{...triggerProps}
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
	const {
		icon: { heart, close, copyUpi },
		trigger,
	} = useIconHover({ trigger: triggerConfig });

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
						height: isOpen ? "auto" : 44,
						borderRadius: isOpen ? 22 : 999,
					}}
					transition={{
						y: SPRING,
						width: SPRING,
						height: SPRING,
						borderRadius: { duration: 0.08, ease: "linear" },
					}}
					className="bg-surfaceElevated relative flex max-h-[calc(100dvh-2.5rem)] flex-col overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
				>
					<AnimatePresence initial={false}>
						{!isOpen && (
							<MotionButton
								key="open"
								type="button"
								variant="ghost"
								onClick={toggle}
								aria-label="Open sponsor options"
								aria-expanded={false}
								aria-controls="sponsor-panel"
								{...trigger}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, transition: { duration: 0.1 } }}
								className="text-textSecondary hover:text-textPrimary absolute inset-0 size-full rounded-full hover:bg-transparent dark:hover:bg-transparent [&_svg:not([class*='size-'])]:size-[18px]"
							>
								<HeartIcon {...heart} color="var(--color-primary)" />
							</MotionButton>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{isOpen && (
							<motion.div
								id="sponsor-panel"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 6 }}
								transition={{ duration: 0.25, ease: "easeOut" }}
								className="flex min-h-0 w-[280px] [scrollbar-width:none] flex-col gap-2 overflow-y-auto overscroll-contain p-3 [&::-webkit-scrollbar]:hidden [&>*]:shrink-0"
							>
								<SponsorLink
									href="https://buymeacoffee.com/avijit07x"
									label="Buy Me Coffee"
									ariaLabel="Support via Buy Me a Coffee"
									icon={Coffee02Icon}
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
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={() => copy(UPI_ID)}
											aria-label="Copy UPI ID"
											{...trigger}
											className="text-textSecondary hover:text-textPrimary size-7 hover:bg-white/10 dark:hover:bg-white/10 [&_svg:not([class*='size-'])]:size-3.5"
										>
											{copied ? (
												<CheckIcon color="var(--color-success)" />
											) : (
												<CopyIcon {...copyUpi} />
											)}
										</Button>
									</div>
									<Image
										src="/qrcode.svg"
										alt={`UPI QR code for ${UPI_ID} payment`}
										width={150}
										height={150}
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

				<AnimatePresence>
					{isOpen && (
						<MotionButton
							key="close"
							type="button"
							variant="secondary"
							size="icon-sm"
							onClick={toggle}
							aria-label="Close sponsor panel"
							aria-expanded
							aria-controls="sponsor-panel"
							{...trigger}
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{
								opacity: 1,
								scale: 1,
								transition: { duration: 0.2, ease: "easeOut", delay: 0.12 },
							}}
							exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
							className="text-textSecondary hover:text-textPrimary absolute -top-3 -right-3 z-10 size-7 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.8)] ring-1 ring-white/10 [&_svg:not([class*='size-'])]:size-3.5"
						>
							<Cancel01Icon {...close} />
						</MotionButton>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};

export default Sponsors;
