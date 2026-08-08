"use client";

/**
 * Root error boundary - the "Motion Specimen" treatment matching the rest of
 * the site: plus-grid ground, mono labels, a specimen-framed alert icon, and
 * the site's pill CTAs. Logs on mount; debug panel only in development.
 */

import SpecimenFrame from "@/components/home/SpecimenFrame";
import { TriangleAlertIcon } from "@/icons/lucide/triangle-alert-icon";
import type { IconHandle } from "@/types/icon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
	error: Error & { digest?: string };
	reset: () => void;
};

const ErrorPage: React.FC<Props> = ({ error, reset }) => {
	const iconRef = useRef<IconHandle | null>(null);

	useEffect(() => {
		console.error("[app] route error", {
			message: error.message,
			digest: error.digest,
		});
		const first = setTimeout(() => iconRef.current?.startAnimation(), 450);
		const loop = setInterval(() => iconRef.current?.startAnimation(), 2800);
		return () => {
			clearTimeout(first);
			clearInterval(loop);
		};
	}, [error]);

	return (
		<div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0"
			/>
			<div
				aria-hidden="true"
				className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-110 w-110 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
			/>

			<div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 text-center">
				<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
					<span className="text-primary">500</span> / Application error
				</p>

				<div className="w-full">
					<SpecimenFrame
						label="Specimen"
						index="err-500"
						footLeft={error.digest ? `ref ${error.digest}` : "runtime"}
						footRight="caught"
						crosshair
						className="w-full select-none"
					>
						<div className="relative flex aspect-6/5 w-full items-center justify-center overflow-hidden">
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[150px] leading-none font-bold text-white/[0.035] select-none"
							>
								500
							</span>
							<div
								aria-hidden="true"
								className="bg-primary/15 absolute size-36 rounded-full blur-3xl"
							/>
							<span className="text-primary relative flex">
								<TriangleAlertIcon ref={iconRef} size={124} />
							</span>
						</div>
					</SpecimenFrame>
				</div>

				<h1 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
					Something went wrong<span className="text-primary">.</span>
				</h1>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						onClick={reset}
						className="group bg-primary hover:bg-primaryHover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-(--cta-text) transition-colors"
					>
						Try again
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
					</button>
					<Link
						href="/"
						className="group border-border text-textPrimary hover:border-primary/50 hover:bg-surface inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
					>
						Go home
					</Link>
				</div>

				{process.env.NODE_ENV === "development" && (
					<div className="border-border/60 bg-surface/40 w-full rounded-lg border px-3 py-2.5 text-left font-mono">
						<div className="flex items-center gap-2">
							<span className="bg-primary size-1.5 rounded-full" />
							<span className="text-textMuted text-[10px] tracking-widest uppercase">
								Debug
							</span>
						</div>
						<p className="text-textSecondary mt-1.5 text-xs break-all">
							{error.message}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ErrorPage;
