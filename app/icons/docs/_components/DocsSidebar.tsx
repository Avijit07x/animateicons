"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "../_lib/nav";

type Props = {
	onNavigate?: () => void;
};

const DocsSidebar: React.FC<Props> = ({ onNavigate }) => {
	const pathname = usePathname();

	return (
		<nav className="space-y-6">
			{docsNav.map((group) => (
				<div key={group.title}>
					<p className="text-textMuted mb-1.5 px-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
						{group.title}
					</p>
					<ul className="space-y-0.5">
						{group.items.map((item) => {
							const active = pathname === item.href;
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={onNavigate}
										className={cn(
											"flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
											active
												? "bg-surfaceElevated text-textPrimary"
												: "text-textSecondary hover:bg-surfaceElevated hover:text-textPrimary",
										)}
									>
										{item.title}
										{item.label && (
											<span className="bg-primary/12 text-primary rounded-full px-2 py-0.5 text-[10px] leading-none font-semibold">
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
