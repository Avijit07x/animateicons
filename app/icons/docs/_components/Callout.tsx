import { Alert02Icon } from "@/icons/huge/alert-0-2-icon";
import { InformationCircleIcon } from "@/icons/huge/information-circle-icon";
import { LightbulbIcon } from "@/icons/huge/lightbulb-icon";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CalloutType = "note" | "tip" | "warning";

const styles: Record<
	CalloutType,
	{ icon: typeof InformationCircleIcon; box: string; iconColor: string }
> = {
	note: {
		icon: InformationCircleIcon,
		box: "bg-sky-500/8",
		iconColor: "text-sky-400",
	},
	tip: {
		icon: LightbulbIcon,
		box: "bg-emerald-500/8",
		iconColor: "text-emerald-400",
	},
	warning: {
		icon: Alert02Icon,
		box: "bg-amber-500/8",
		iconColor: "text-amber-400",
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
		<div className={cn("my-6 flex gap-3 rounded-3xl p-4 text-sm", s.box)}>
			<span className={cn("mt-0.5 shrink-0", s.iconColor)}>
				<Icon size={18} />
			</span>
			<div className="text-textSecondary leading-7 [&_p]:my-0! [&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}
