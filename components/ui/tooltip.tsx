"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Tooltip — glass treatment matching the rest of the AnimateIcons site.
 *
 * - Gradient surface (from-surface → to-surfaceElevated) with a soft
 *   border + backdrop blur, instead of plain white-on-dark.
 * - Top-edge shimmer for the premium glass-card look used elsewhere.
 * - Arrow inherits the surface color so it reads as a continuation of
 *   the panel, not a separate floating shape.
 * - Default delay 200ms — feels intentional, not jumpy. Default
 *   sideOffset 6 — floats clear of the trigger.
 */
function TooltipProvider({
	delayDuration = 200,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 8,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(
					"relative z-50 w-fit origin-(--radix-tooltip-content-transform-origin) overflow-hidden",
					"rounded-full px-3 py-1 text-[11px] font-medium tracking-wide whitespace-nowrap text-balance",
					// Same recipe as the navbar pill toggles + Hero install picker.
					"border-border/80 text-primary from-surface to-surfaceElevated border bg-gradient-to-b",
					"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]",
					"backdrop-blur",
					"animate-in fade-in-0 zoom-in-95",
					"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					"data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
					"data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
					className,
				)}
				{...props}
			>
				{/* Top-edge shimmer — same line every glass surface uses. */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-3 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
				/>
				{children}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
