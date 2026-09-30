"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import CopyButton from "./CopyButton";

type CommandItem = { manager: string; code: string; html: string };

/**
 * Client half of the package-manager command block: renders npm/pnpm/yarn/bun
 * tabs over pre-highlighted Shiki html (from CommandBlock) and copies the
 * active command. Styling mirrors CodeBlock so the two read as one family.
 */
const CommandTabs: React.FC<{ title: string; items: CommandItem[] }> = ({
	title,
	items,
}) => {
	const [active, setActive] = useState(items[0]?.manager);
	const current = items.find((i) => i.manager === active) ?? items[0];

	return (
		<div className="group/code bg-surfaceElevated relative my-6 overflow-hidden rounded-3xl">
			<div className="flex items-center justify-between border-b border-white/8 py-2 pr-2 pl-5">
				<div className="flex items-center gap-1">
					<span className="text-textMuted mr-2 font-mono text-xs">{title}</span>
					{items.map((i) => (
						<button
							key={i.manager}
							type="button"
							onClick={() => setActive(i.manager)}
							className={cn(
								"rounded-full px-3 py-1 font-mono text-xs transition-colors",
								active === i.manager
									? "bg-white/12 text-white"
									: "text-textMuted hover:text-textSecondary",
							)}
						>
							{i.manager}
						</button>
					))}
				</div>
				<CopyButton code={current.code} />
			</div>

			<div
				className="text-[0.8125rem] max-sm:overflow-x-auto [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-5 [&_pre]:leading-[1.7]"
				dangerouslySetInnerHTML={{ __html: current.html }}
			/>
		</div>
	);
};

export default CommandTabs;
