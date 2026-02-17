import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="border-divider/50 border-t">
			<div className="mx-auto max-w-6xl px-4 py-10">
				<div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
					<div className="space-y-2">
						<h3 className="text-textPrimary text-sm font-semibold">
							AnimateIcons
						</h3>
						<p className="text-textMuted max-w-xs text-xs">
							An open-source animated SVG icon library for modern React
							interfaces. Built for performance and smooth micro-interactions.
						</p>
					</div>

					<div className="flex flex-wrap gap-6 text-sm">
						<Link
							href="/icons/lucide"
							className="text-textSecondary hover:text-textPrimary"
						>
							Icons
						</Link>

						<Link
							href="https://github.com/Avijit07x/animateicons"
							target="_blank"
							className="text-textSecondary hover:text-textPrimary"
						>
							GitHub
						</Link>
						<Link
							href="https://twitter.com/avijit07x"
							target="_blank"
							className="text-textSecondary hover:text-textPrimary"
						>
							Twitter
						</Link>
					</div>
				</div>

				<div className="border-divider/50 text-textMuted mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs md:flex-row">
					<span>Open source · MIT licensed</span>
					<span>
						Created by{" "}
						<Link
							target="_blank"
							href={"https://github.com/avijit07x"}
							className="hover:underline"
						>
							Avijit Dey
						</Link>
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
