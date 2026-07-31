import type { ReactNode } from "react";

/**
 * Small inline pill for MDX (e.g. "Recommended"). Rendered as a component so
 * MDX never re-parses its text into a block <p>. The `[&_p]` guard flattens
 * any <p> the production MDX build still injects, so it stays a tight inline
 * pill in both the Turbopack dev server and the webpack production build.
 */
const Badge: React.FC<{ children: ReactNode }> = ({ children }) => (
	<span className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mr-2 inline-block rounded-full border px-2.5 py-0.5 align-middle text-xs font-semibold [&_p]:m-0! [&_p]:inline [&_p]:text-inherit [&_p]:leading-none">
		{children}
	</span>
);

export default Badge;
