import { CompassIcon } from "@/icons/lucide/compass-icon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * 404 page — on-brand glass card with the same surface vocabulary as
 * the rest of the site (gradient surface, border-border/60, top-edge
 * shimmer, primary radial glow). The compass icon hints "we'll help
 * you find your way" without saying it.
 */
export default function NotFound() {
	return (
		<div
			className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16"
			style={{
				backgroundImage:
					"radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
				backgroundSize: "20px 20px",
			}}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(circle at center, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 55%)",
				}}
			/>

			<div className="border-border/60 text-textPrimary relative w-full max-w-md overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-8 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur">
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
				/>

				<div className="mb-7 flex flex-col items-center gap-4 text-center">
					<div className="border-border/60 bg-bgDark/60 text-primary inline-flex size-14 items-center justify-center rounded-2xl border">
						<CompassIcon size={28} />
					</div>
					<div className="space-y-1.5">
						<p className="text-textMuted text-[11px] tracking-[0.2em] uppercase">
							404 · Page not found
						</p>
						<h1 className="text-textPrimary text-2xl font-semibold tracking-tight sm:text-3xl">
							Lost the trail
						</h1>
					</div>
					<p className="text-textSecondary max-w-xs text-sm leading-relaxed">
						This page doesn't exist (or never did). Head back home or browse
						the icon gallery.
					</p>
				</div>

				<div className="flex flex-col gap-2.5">
					<Link
						href="/"
						className="group from-primary to-primary/85 ring-primary-foreground/15 relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-b px-5 py-2.5 text-sm font-semibold text-(--cta-text) shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 transition-all duration-200 ring-inset hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_14px_36px_-8px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:brightness-110 active:scale-[0.98]"
					>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-5 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
						/>
						Go home
						<ArrowRight
							className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</Link>
					<Link
						href="/icons/lucide"
						className="border-border/60 hover:border-primary/40 text-textPrimary inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
					>
						Browse icons
					</Link>
				</div>
			</div>
		</div>
	);
}
