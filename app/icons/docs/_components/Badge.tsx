import type { ReactNode } from "react";

const Badge: React.FC<{ children: ReactNode }> = ({ children }) => (
	<span className="mr-2 inline-block rounded-full bg-emerald-500/12 px-2.5 py-0.5 align-middle text-xs font-semibold text-emerald-400 [&_p]:m-0! [&_p]:inline [&_p]:leading-none [&_p]:text-inherit">
		{children}
	</span>
);

export default Badge;
