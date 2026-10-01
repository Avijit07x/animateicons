import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import Link from "next/link";
import React from "react";
import IconLink from "./IconLink";
import FooterCta from "./home/FooterCta";

const LINKS = [
	{ label: "Lucide", href: "/icons/lucide" },
	{ label: "Huge", href: "/icons/huge" },
	{ label: "Docs", href: "/icons/docs" },
	{ label: "shadcn", href: "/icons/docs/shadcn" },
	{ label: "CLI", href: "/icons/docs/cli" },
	{ label: "MCP", href: "/icons/docs/mcp" },
	{ label: "Supporters", href: "/sponsors" },
	{
		label: "GitHub",
		href: "https://github.com/Avijit07x/animateicons",
		external: true,
	},
	{
		label: "npm",
		href: "https://www.npmjs.com/package/@animateicons/react",
		external: true,
	},
	{ label: "Twitter", href: "https://twitter.com/avijit07x", external: true },
];

const LINK_CLASS =
	"text-textMuted hover:text-textPrimary inline-flex items-center gap-1 text-sm transition-colors";

const Footer: React.FC = () => {
	return (
		<footer className="relative overflow-hidden">
			<FooterCta />

			<div className="relative mx-auto max-w-7xl px-6 text-center">
				<nav
					aria-label="Footer"
					className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8"
				>
					{LINKS.map((link) =>
						link.external ? (
							<IconLink
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								icon={ArrowUpRight01Icon}
								iconSize={14}
								className={LINK_CLASS}
							>
								{link.label}
							</IconLink>
						) : (
							<Link
								key={link.label}
								href={link.href}
								prefetch={false}
								className={LINK_CLASS}
							>
								{link.label}
							</Link>
						),
					)}
				</nav>

				<p className="text-textMuted mt-6 text-sm text-balance">
					Free and open source under the MIT license. Built by{" "}
					<Link
						href="https://github.com/avijit07x"
						target="_blank"
						rel="noopener noreferrer"
						className="text-textSecondary hover:text-primary whitespace-nowrap transition-colors"
					>
						Avijit Dey
					</Link>
					.
				</p>
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none mt-10 px-2 select-none"
			>
				<span className="from-textPrimary/22 to-textPrimary/2 block bg-linear-to-b bg-clip-text text-center text-[min(14vw,17rem)] leading-[0.78] font-bold tracking-tighter whitespace-nowrap text-transparent">
					AnimateIcons
				</span>
			</div>
		</footer>
	);
};

export default Footer;
