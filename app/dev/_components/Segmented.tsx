import { cn } from "@/lib/utils";

type Option<T extends string> = { id: T; label: string };

type Props<T extends string> = {
	label: string;
	options: readonly Option<T>[];
	value: T;
	onChange: (value: T) => void;
	count?: (value: T) => number;
	digits?: number;
	className?: string;
};

function Segmented<T extends string>({
	label,
	options,
	value,
	onChange,
	count,
	digits = 1,
	className,
}: Props<T>) {
	return (
		<div className={cn("flex min-w-0 flex-col gap-2", className)}>
			<span className="text-textMuted px-1 text-xs">{label}</span>
			<div
				role="radiogroup"
				aria-label={label}
				className="bg-bgDark flex rounded-full p-1"
			>
				{options.map((option) => {
					const active = option.id === value;
					const total = count?.(option.id);
					return (
						<button
							key={option.id}
							type="button"
							role="radio"
							aria-checked={active}
							disabled={!active && total === 0}
							onClick={() => onChange(option.id)}
							className={cn(
								"focus-visible:ring-primary/60 disabled:text-textDisabled flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed lg:flex-none",
								active
									? "bg-surfaceActive text-white"
									: "text-textMuted enabled:hover:text-textPrimary",
							)}
						>
							{option.label}
							{total !== undefined && (
								<span
									style={{ minWidth: `${digits}ch` }}
									className={cn(
										"text-start text-xs tabular-nums",
										active ? "text-textSecondary" : "text-textDisabled",
									)}
								>
									{total}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default Segmented;
