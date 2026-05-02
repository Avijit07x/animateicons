"use client";

/**
 * Route-level error boundary for the AnimateIcons /icons/* gallery.
 *
 * SRP: catch render-time exceptions from any descendant (an
 * AnimateIcons component bug, a motion/react regression, a malformed
 * search-param state) so the failure is isolated to the gallery route
 * instead of crashing the whole AnimateIcons shell.
 *
 * Visual: same on-brand glass-card treatment as the root error and
 * 404 pages — gradient surface, top-edge shimmer, primary-gradient CTA
 * for the recovery action.
 */

import { TriangleAlertIcon } from "@/icons/lucide/triangle-alert-icon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
	error: Error & { digest?: string };
	reset: () => void;
};

const IconsError: React.FC<Props> = ({ error, reset }) => {
	useEffect(() => {
		// Surface to the console (and any wired-up error reporter) so
		// silent UX failures still leave a trail.
		console.error("[icons] route error", {
			message: error.message,
			digest: error.digest,
		});
	}, [error]);

	return (
		<div className="relative flex min-h-[60dvh] w-full items-center justify-center px-4 py-16">
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(circle at center, color-mix(in oklab, var(--color-primary) 10%, transparent), transparent 55%)",
				}}
			/>

			<div className="border-border/60 text-textPrimary relative w-full max-w-md overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-7 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur">
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
				/>

				<div className="mb-6 flex flex-col items-center gap-3 text-center">
					<div className="border-border/60 bg-bgDark/60 text-primary inline-flex size-12 items-center justify-center rounded-2xl border">
						<TriangleAlertIcon size={22} />
					</div>
					<div className="space-y-1">
						<p className="text-textMuted text-[11px] tracking-[0.2em] uppercase">
							Gallery error
						</p>
						<h2 className="text-textPrimary text-xl font-semibold tracking-tight">
							Something broke loading icons
						</h2>
					</div>
					<p className="text-textSecondary max-w-xs text-sm leading-relaxed">
						We logged the error. Try again, and if it keeps happening let us
						know on GitHub.
					</p>
					{error.digest ? (
						<p className="text-textMuted font-mono text-[11px]">
							ref: {error.digest}
						</p>
					) : null}
				</div>

				<div className="flex flex-col gap-2.5">
					<button
						type="button"
						onClick={reset}
						className="group from-primary to-primary/85 ring-primary-foreground/15 relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-b px-5 py-2.5 text-sm font-semibold text-(--cta-text) shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 transition-all duration-200 ring-inset hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_14px_36px_-8px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:brightness-110 active:scale-[0.98]"
					>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-5 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
						/>
						Try again
						<ArrowRight
							className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</button>
					<Link
						href="/"
						className="border-border/60 hover:border-primary/40 text-textPrimary inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
					>
						Go home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default IconsError;
