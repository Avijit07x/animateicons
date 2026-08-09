"use client";

/**
 * Route-level error boundary for the /icons/* gallery - isolates a gallery
 * failure from the rest of the shell. Same "Motion Specimen" treatment as the
 * root error + 404: plus-grid ground, mono labels, specimen-framed alert icon,
 * pill CTA for recovery.
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

const IconsError: React.FC<Props> = ({ error, reset }) => {
	const iconRef = useRef<IconHandle | null>(null);

	useEffect(() => {
		console.error("[icons] route error", {
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
		<div className="relative flex min-h-[70dvh] w-full items-center justify-center overflow-hidden px-6 py-16">
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
					<span className="text-primary">Err</span> / Gallery error
				</p>

				<div className="w-full">
					<SpecimenFrame
						label="Specimen"
						index="err"
						footLeft={error.digest ? `ref ${error.digest}` : "runtime"}
						footRight="caught"
						crosshair
						className="w-full select-none"
					>
						<div className="relative flex aspect-6/5 w-full items-center justify-center overflow-hidden">
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[110px] leading-none font-bold text-white/[0.035] select-none"
							>
								ERR
							</span>
							<div
								aria-hidden="true"
								className="bg-primary/15 absolute size-36 rounded-full blur-3xl"
							/>
							<span className="text-primary relative flex">
								<TriangleAlertIcon ref={iconRef} size={116} />
							</span>
						</div>
					</SpecimenFrame>
				</div>

				<h2 className="text-textPrimary text-2xl font-semibold tracking-tight sm:text-3xl">
					Could not load icons<span className="text-primary">.</span>
				</h2>

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
			</div>
		</div>
	);
};

export default IconsError;
