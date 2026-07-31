"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import CopyButton from "./CopyButton";

export type CommandItem = { manager: string; code: string; html: string };

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
		<div className="group/code bg-surface relative my-6 overflow-hidden rounded-xl shadow-lg shadow-black/20 ring-1 ring-white/10">
			<div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-2">
				<div className="flex items-center">
					<span className="text-textMuted mr-1 px-2 font-mono text-xs">
						{title}
					</span>
					{items.map((i) => (
						<button
							key={i.manager}
							type="button"
							onClick={() => setActive(i.manager)}
							className={cn(
								"relative px-2.5 py-2.5 font-mono text-xs transition-colors",
								active === i.manager
									? "text-textPrimary"
									: "text-textMuted hover:text-textSecondary",
							)}
						>
							{i.manager}
							{active === i.manager && (
								<span className="bg-primary absolute inset-x-2 bottom-0 h-0.5 rounded-full" />
							)}
						</button>
					))}
				</div>
				<CopyButton code={current.code} />
			</div>

			<div
				className="text-[0.8125rem] max-sm:overflow-x-auto [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:leading-[1.7]"
				dangerouslySetInnerHTML={{ __html: current.html }}
			/>
		</div>
	);
};

export default CommandTabs;
