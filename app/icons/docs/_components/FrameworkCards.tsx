import { FrameworkLogo } from "@/components/icons/FrameworkLogos";
import Link from "next/link";
import { FRAMEWORK_GUIDES } from "../_lib/frameworks";

const FrameworkCards = () => (
	<div className="my-8 grid gap-3 sm:grid-cols-2">
		{FRAMEWORK_GUIDES.map(({ framework, name, pkg, href, summary }) => (
			<Link
				key={framework}
				href={href}
				className="group bg-surface hover:bg-surfaceElevated flex items-start gap-4 rounded-3xl p-4 transition-colors"
			>
				<span className="bg-bgDark text-textPrimary flex size-11 shrink-0 items-center justify-center rounded-full">
					<FrameworkLogo framework={framework} className="size-5" />
				</span>
				<span className="min-w-0">
					<span className="text-textPrimary group-hover:text-primary block text-sm font-semibold transition-colors">
						{name}
					</span>
					<code className="text-textSecondary mt-0.5 block truncate font-mono text-xs">
						{pkg}
					</code>
					<span className="text-textMuted mt-1.5 block text-xs leading-5">
						{summary}
					</span>
				</span>
			</Link>
		))}
	</div>
);

export default FrameworkCards;
