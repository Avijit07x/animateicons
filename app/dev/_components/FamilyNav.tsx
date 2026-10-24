"use client";

import { cn } from "@/lib/utils";
import { useActiveSection } from "../_hooks/useActiveSection";
import { LIBRARY_NAMES } from "../_lib/families";
import type { LibraryGroup } from "../_lib/types";

const FamilyNav: React.FC<{ groups: LibraryGroup[] }> = ({ groups }) => {
	const active = useActiveSection(
		groups.flatMap((group) => group.families.map((family) => family.id)),
	);

	return (
		<nav
			aria-label="Families"
			className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] flex-col gap-5 self-start overflow-y-auto pr-2 lg:flex"
		>
			{groups.map(({ library, families }) => (
				<div key={library} className="flex flex-col gap-1">
					<p className="text-textMuted px-3 pb-1 text-xs">
						{LIBRARY_NAMES[library]}
					</p>
					{families.map((family) => (
						<a
							key={family.id}
							href={`#${family.id}`}
							aria-current={active === family.id ? "true" : undefined}
							className={cn(
								"flex items-center justify-between rounded-full px-3 py-1.5 text-[13px] capitalize transition-colors",
								active === family.id
									? "bg-surfaceElevated text-white"
									: "text-textSecondary hover:bg-surface hover:text-textPrimary",
							)}
						>
							{family.family}
							<span className="text-textMuted text-xs tabular-nums">
								{family.items.length}
							</span>
						</a>
					))}
				</div>
			))}
		</nav>
	);
};

export default FamilyNav;
