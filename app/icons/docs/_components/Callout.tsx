import { cn } from "@/lib/utils";
import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Docs callout — a colored info box (note / tip / warning) for MDX. Import
 * it into a page and wrap a short block: <Callout type="tip">…</Callout>.
 */
type CalloutType = "note" | "tip" | "warning";

const styles: Record<
	CalloutType,
	{ icon: typeof InfoIcon; box: string; icon_: string }
> = {
	note: {
		icon: InfoIcon,
		box: "border-sky-500/25 bg-sky-500/[0.06]",
		icon_: "text-sky-400",
	},
	tip: {
		icon: LightbulbIcon,
		box: "border-emerald-500/25 bg-emerald-500/[0.06]",
		icon_: "text-emerald-400",
	},
	warning: {
		icon: TriangleAlertIcon,
		box: "border-amber-500/25 bg-amber-500/[0.06]",
		icon_: "text-amber-400",
	},
};

export function Callout({
	type = "note",
	children,
}: {
	type?: CalloutType;
	children: ReactNode;
}) {
	const s = styles[type];
	const Icon = s.icon;
	return (
		<div
			className={cn(
				"my-6 flex gap-3 rounded-lg border p-4 text-sm",
				s.box,
			)}
		>
			<Icon className={cn("mt-0.5 size-4.5 shrink-0", s.icon_)} />
			<div className="text-textSecondary leading-7 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:my-0">
				{children}
			</div>
		</div>
	);
}
