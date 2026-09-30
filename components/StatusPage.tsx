"use client";

import { useIconLoop } from "@/hooks/useIconLoop";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import type { ComponentType, ReactNode, Ref } from "react";

type Props = {
	icon: ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;
	code: string;
	title: string;
	description: string;
	actions: ReactNode;
	fullScreen?: boolean;
	children?: ReactNode;
};

const LOOP_MS = 2800;

const StatusPage: React.FC<Props> = ({
	icon: Icon,
	code,
	title,
	description,
	actions,
	fullScreen = true,
	children,
}) => {
	const iconRef = useIconLoop(LOOP_MS);

	return (
		<div
			className={cn(
				"relative flex items-center justify-center overflow-hidden px-6 py-16",
				fullScreen ? "min-h-dvh" : "min-h-[70dvh]",
			)}
		>
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0"
			/>

			<div className="animate-in fade-in slide-in-from-bottom-3 relative z-10 flex w-full max-w-md flex-col items-center gap-5 text-center duration-500">
				<span className="bg-primary/10 text-primary ring-primary/5 grid size-32 place-items-center rounded-full ring-8">
					<Icon ref={iconRef} size={60} />
				</span>

				<span className="bg-surfaceElevated text-textSecondary rounded-full px-3 py-1 text-xs font-medium">
					{code}
				</span>

				<h1 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
					{title}
					<span className="text-primary">.</span>
				</h1>

				<p className="text-textSecondary max-w-sm text-sm leading-relaxed sm:text-base">
					{description}
				</p>

				<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
					{actions}
				</div>

				{children}
			</div>
		</div>
	);
};

export default StatusPage;
