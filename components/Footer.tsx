import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const COLUMNS = [
	{
		heading: "Library",
		links: [
			{ label: "All icons", href: "/icons/lucide" },
			{ label: "Lucide", href: "/icons/lucide" },
			{ label: "Huge", href: "/icons/huge" },
			{ label: "Documentation", href: "/icons/docs" },
		],
	},
	{
		heading: "Project",
		links: [
			{ label: "GitHub", href: "https://github.com/Avijit07x/animateicons" },
			{
				label: "npm",
				href: "https://www.npmjs.com/package/@animateicons/react",
			},
			{ label: "Supporters", href: "/sponsors" },
			{ label: "Twitter", href: "https://twitter.com/avijit07x" },
		],
	},
];

const Footer: React.FC = () => {
	return (
		<footer className="border-border/60 relative overflow-hidden border-t">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0"
			/>

			<div className="relative mx-auto max-w-7xl px-6 pt-20">
				{/* Finale CTA */}
				<div className="flex flex-col gap-8 pb-16 md:flex-row md:items-end md:justify-between">
					<h2 className="text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] font-semibold tracking-tight">
						<span className="text-textPrimary">Make every icon </span>
						<span className="text-primary">move.</span>
					</h2>
					<div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
						<Link
							href="/icons/lucide"
							prefetch={false}
							className="group bg-primary hover:bg-primaryHover inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-(--cta-text) transition-colors"
						>
							Browse {ICON_COUNTS.total} icons
							<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
						</Link>
						<Link
							href="https://www.npmjs.com/package/@animateicons/react"
							target="_blank"
							rel="noopener noreferrer"
							className="border-border text-textSecondary hover:text-textPrimary inline-flex items-center justify-center rounded-full border px-4 py-2 font-mono text-xs transition-colors"
						>
							npm i @animateicons/react
						</Link>
					</div>
				</div>

				<div
					aria-hidden="true"
					className="border-border/60 ml-[calc(50%-50vw)] w-screen border-t"
				/>

				{/* Links */}
				<div className="grid gap-10 pt-14 md:grid-cols-[2fr_1fr_1fr] md:gap-16">
					<div>
						<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
							animateicons
						</p>
						<p className="text-textSecondary mt-4 max-w-sm text-sm leading-relaxed">
							{ICON_COUNTS.total} open-source animated SVG icons for React. One
							motion system, two libraries, built on Motion.
						</p>
					</div>

					{COLUMNS.map((col) => (
						<div key={col.heading}>
							<p className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
								{col.heading}
							</p>
							<ul className="mt-4 space-y-2.5">
								{col.links.map((l) => {
									const external = l.href.startsWith("http");
									return (
										<li key={l.label}>
											<Link
												href={l.href}
												prefetch={external ? undefined : false}
												target={external ? "_blank" : undefined}
												rel={external ? "noopener noreferrer" : undefined}
												className="text-textSecondary hover:text-textPrimary inline-block text-sm transition-all duration-200 hover:translate-x-0.5"
											>
												{l.label}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>

				<div
					aria-hidden="true"
					className="border-border/60 mt-14 ml-[calc(50%-50vw)] w-screen border-t"
				/>
				<div className="text-textMuted flex flex-col items-center justify-between gap-3 py-6 font-mono text-[10px] tracking-widest uppercase md:flex-row">
					<span>Open source · MIT licensed</span>
					<span>
						Created by{" "}
						<Link
							target="_blank"
							href="https://github.com/avijit07x"
							className="text-textSecondary hover:text-textPrimary transition-colors"
						>
							Avijit Dey
						</Link>
					</span>
				</div>
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none relative px-2 pt-4 select-none"
			>
				<span className="from-textPrimary/[0.18] to-textPrimary/[0.02] block bg-gradient-to-b bg-clip-text text-center text-[14vw] leading-[0.78] font-bold tracking-tighter whitespace-nowrap text-transparent">
					AnimateIcons
				</span>
			</div>
		</footer>
	);
};

export default Footer;
