"use client";

/**
 * Left docs navigation. Reads the shared nav tree and highlights the
 * active page against the current pathname. Rendered in the docs layout
 * (sticky column on lg+); the same component backs the mobile drawer.
 */

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "../_lib/nav";

type Props = {
	/** Called after a link is tapped, so the mobile drawer can close. */
	onNavigate?: () => void;
};

const DocsSidebar: React.FC<Props> = ({ onNavigate }) => {
	const pathname = usePathname();

	return (
		<nav className="space-y-7">
			{docsNav.map((group) => (
				<div key={group.title}>
					<p className="text-textPrimary mb-2 text-sm font-semibold">
						{group.title}
					</p>
					<ul className="border-border/50 space-y-0.5 border-l">
						{group.items.map((item) => {
							const active = pathname === item.href;
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={onNavigate}
										className={cn(
											"-ml-px flex items-center gap-2 border-l py-1.5 pl-4 text-sm transition-colors",
											active
												? "border-primary text-primary font-medium"
												: "text-textSecondary hover:text-textPrimary border-transparent hover:border-white/20",
										)}
									>
										{item.title}
										{item.label && (
											<span className="border-primary/40 text-primary rounded border px-1.5 py-0.5 text-[10px] leading-none font-semibold">
												{item.label}
											</span>
										)}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</nav>
	);
};

export default DocsSidebar;
