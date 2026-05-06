"use client";

/**
 * SponsorPopup
 *
 * Dismissable modal asking for support to keep the site online while
 * we approach Vercel's free-tier limits. Shows on every fresh page
 * load (no localStorage persistence) so returning visitors see the
 * appeal each time they open the site. Closing the modal during a
 * session keeps it closed until the next reload, internal client-side
 * navigations don't re-trigger it because the component stays mounted.
 *
 * Two views:
 *   - "main"  — pitch + 4 sponsor options
 *   - "upi"   — back-button + QR code (works on desktop, not just mobile)
 */

import { GitHub } from "@/components/icons/Github";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import {
	ArrowLeft,
	ArrowRight,
	Coffee,
	CreditCard,
	Heart,
	Wallet,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SHOW_DELAY_MS = 1200; // wait a bit before opening so it doesn't fight the page mount
const UPI_ID = "avijit07x@ybl"; // shown to the user + used for the deep link

type SponsorOption = {
	label: string;
	href?: string;
	onClick?: () => void;
	Icon: React.ComponentType<{ className?: string; size?: number }>;
	subtitle: string;
};

type View = "main" | "upi";

// Don't pitch donation on pages that already exist *because* of donations.
const SUPPRESSED_PATHS = ["/sponsors"];

const SponsorPopup: React.FC = () => {
	const pathname = usePathname();
	const suppressed = SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p));

	const [open, setOpen] = useState(false);
	const [view, setView] = useState<View>("main");
	const [copied, setCopied] = useState(false);
	const copyTimer = useRef<number | null>(null);

	useEffect(() => {
		if (suppressed) return;
		const id = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
		return () => window.clearTimeout(id);
	}, [suppressed]);

	const dismiss = () => {
		setOpen(false);
		// Reset back to the main view so reopening starts fresh.
		window.setTimeout(() => setView("main"), 200);
	};

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			if (view === "upi") {
				setView("main");
			} else {
				dismiss();
			}
		};
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prevOverflow;
			window.removeEventListener("keydown", onKey);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, view]);

	const copyUpi = async () => {
		try {
			await navigator.clipboard.writeText(UPI_ID);
			setCopied(true);
			if (copyTimer.current) window.clearTimeout(copyTimer.current);
			copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
		} catch {
			// Ignore clipboard errors; the UPI ID is also visible to copy manually.
		}
	};

	const OPTIONS: SponsorOption[] = [
		{
			label: "GitHub Sponsors",
			href: "https://github.com/sponsors/Avijit07x",
			Icon: ({ className }) => <GitHub className={className} />,
			subtitle: "Recurring support",
		},
		{
			label: "Buy me a coffee",
			href: "https://www.buymeacoffee.com/avijit07x",
			Icon: Coffee,
			subtitle: "One-time tip",
		},
		{
			label: "PayPal",
			href: "https://paypal.me/avijit07x",
			Icon: CreditCard,
			subtitle: "International",
		},
		{
			label: "UPI (India)",
			onClick: () => setView("upi"),
			Icon: Wallet,
			subtitle: "Show QR code",
		},
	];

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					key="sponsor-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={dismiss}
					role="dialog"
					aria-modal="true"
					aria-labelledby="sponsor-title"
					className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
				>
					<motion.div
						key="sponsor-panel"
						initial={{ opacity: 0, scale: 0.96, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: 10 }}
						transition={{ type: "spring", stiffness: 380, damping: 32 }}
						onClick={(e) => e.stopPropagation()}
						className={cn(
							"relative w-full max-w-md max-h-[90dvh] overflow-y-auto overflow-x-hidden rounded-2xl",
							"border-border/60 from-surface to-surfaceElevated border bg-gradient-to-b",
							"shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_80px_-30px_rgba(0,0,0,0.85)]",
						)}
					>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
						/>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full"
							style={{
								background:
									"radial-gradient(circle, color-mix(in oklab, var(--color-primary) 26%, transparent), transparent 70%)",
							}}
						/>

						<button
							type="button"
							onClick={dismiss}
							aria-label="Close"
							className="text-textSecondary hover:text-textPrimary absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/[0.06]"
						>
							<X className="size-4" />
						</button>

						{view === "main" ? (
							<div className="relative space-y-5 px-6 py-7 sm:px-8 sm:py-8">
								<div className="space-y-3">
									<div className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
										<Heart className="size-3.5" />A note from the maker
									</div>
									<h2
										id="sponsor-title"
										className="text-textPrimary text-2xl font-semibold tracking-tight"
									>
										AnimateIcons needs your help
									</h2>
									<p className="text-textSecondary text-sm leading-relaxed">
										Hey, I&apos;m Avijit, the solo developer behind
										AnimateIcons. This site is{" "}
										<mark className="bg-primary/15 text-primary rounded px-1 py-0.5 font-medium">
											hitting its free hosting limits this month
										</mark>{" "}
										and may go offline for a few weeks until usage resets.
									</p>
									<p className="text-textSecondary text-sm leading-relaxed">
										I&apos;m not earning anything from this project. No ads, no
										sponsors yet, no paid tiers. Every icon is free and always
										will be. If AnimateIcons saved you time, even a small
										one-time tip would genuinely help me cover hosting and keep
										building.
									</p>
									<p className="text-textPrimary text-sm leading-relaxed">
										Thank you for considering 🙏
									</p>
								</div>

								<div className="grid grid-cols-2 gap-2.5">
									{OPTIONS.map(({ label, href, onClick, Icon, subtitle }) => {
										const cls = cn(
											"group border-border/60 hover:border-primary/40 relative flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors",
											"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
											"hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]",
										);
										const inner = (
											<>
												<div className="flex items-center gap-2">
													<span className="text-primary inline-flex size-7 items-center justify-center">
														<Icon className="size-4" size={16} />
													</span>
													<span className="text-textPrimary text-sm font-semibold">
														{label}
													</span>
												</div>
												<span className="text-textMuted text-[11px]">
													{subtitle}
												</span>
											</>
										);
										if (href) {
											return (
												<a
													key={label}
													href={href}
													target="_blank"
													rel="noopener noreferrer"
													onClick={dismiss}
													className={cls}
												>
													{inner}
												</a>
											);
										}
										return (
											<button
												key={label}
												type="button"
												onClick={onClick}
												className={cls}
											>
												{inner}
											</button>
										);
									})}
								</div>

								<div className="border-border/40 space-y-2.5 border-t pt-4">
									<Link
										href="/sponsors"
										onClick={dismiss}
										className="text-primary group inline-flex items-center gap-1.5 text-sm font-medium decoration-primary/30 underline-offset-4 transition-all hover:decoration-primary/70 hover:underline"
									>
										See everyone supporting AnimateIcons
										<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
									</Link>
									<div className="flex items-center justify-between gap-3">
										<p className="text-textMuted text-[11px]">
											Press <Kbd>Esc</Kbd> to dismiss
										</p>
										<button
											type="button"
											onClick={dismiss}
											className="text-textSecondary hover:text-textPrimary text-xs font-medium transition-colors"
										>
											Maybe later
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="relative space-y-5 px-6 py-7 sm:px-8 sm:py-8">
								<button
									type="button"
									onClick={() => setView("main")}
									className="text-textSecondary hover:text-textPrimary inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
								>
									<ArrowLeft className="size-3.5" /> Back
								</button>

								<div className="space-y-2 text-center">
									<h2 className="text-textPrimary text-xl font-semibold tracking-tight">
										Pay via UPI
									</h2>
									<p className="text-textSecondary text-sm">
										Scan the QR with any UPI app, or copy the ID below.
									</p>
								</div>

								<div className="border-border/60 mx-auto flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border bg-white p-4">
									<Image
										src="/qrcode.svg"
										alt="UPI QR code"
										width={240}
										height={240}
										className="size-full"
										priority
									/>
								</div>

								<div className="border-border/60 flex items-center justify-between gap-3 rounded-xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01] px-3 py-2">
									<code className="text-textPrimary truncate font-mono text-sm">
										{UPI_ID}
									</code>
									<button
										type="button"
										onClick={copyUpi}
										className="border-border/60 hover:border-primary/40 text-textSecondary hover:text-textPrimary inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors"
									>
										{copied ? "Copied" : "Copy ID"}
									</button>
								</div>

								<p className="text-textMuted text-center text-[11px]">
									Works with PhonePe, Google Pay, Paytm, BHIM, and any UPI app.
								</p>
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SponsorPopup;
