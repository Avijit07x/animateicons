"use client";

/**
 * Live recipes for the Examples page: AnimateIcons dropped into real shadcn/ui
 * components, played on interaction via the imperative ref API + handleHover.
 */

import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { BellIcon } from "@/icons/lucide/bell-icon";
import { CircleCheckIcon } from "@/icons/lucide/circle-check-icon";
import { DownloadIcon } from "@/icons/lucide/download-icon";
import { LogOutIcon } from "@/icons/lucide/log-out-icon";
import { SearchIcon } from "@/icons/lucide/search-icon";
import { SettingsIcon } from "@/icons/lucide/settings-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { Trash2Icon } from "@/icons/lucide/trash-2-icon";
import { UserIcon } from "@/icons/lucide/user-icon";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { useRef } from "react";

export function ButtonDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<Button
			onMouseEnter={(e) => handleHover(e, ref)}
			onMouseLeave={(e) => handleHover(e, ref)}
		>
			<DownloadIcon ref={ref} size={16} />
			Download
		</Button>
	);
}

export function InputDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<InputGroup className="border-border bg-bgDark w-full max-w-xs rounded-full">
			<InputGroupAddon>
				<SearchIcon ref={ref} size={16} className="text-textMuted" />
			</InputGroupAddon>
			<InputGroupInput
				placeholder="Search icons..."
				className="text-textPrimary"
				onFocus={() => ref.current?.startAnimation()}
				onBlur={() => ref.current?.stopAnimation()}
			/>
		</InputGroup>
	);
}

export function CardDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<div
			onMouseEnter={(e) => handleHover(e, ref)}
			onMouseLeave={(e) => handleHover(e, ref)}
			className="border-border bg-surface w-full max-w-xs rounded-xl border p-5"
		>
			<div className="bg-primary/10 text-primary mb-3 flex size-10 items-center justify-center rounded-lg">
				<SparklesIcon ref={ref} size={20} />
			</div>
			<p className="text-textPrimary font-semibold">Smart suggestions</p>
			<p className="text-textMuted mt-1 text-sm">
				Get AI-powered icon recommendations as you type.
			</p>
			<Button size="sm" variant="outline" className="mt-4">
				Learn more
			</Button>
		</div>
	);
}

export function TooltipDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						aria-label="Delete"
						onMouseEnter={(e) => handleHover(e, ref)}
						onMouseLeave={(e) => handleHover(e, ref)}
					>
						<Trash2Icon ref={ref} size={16} />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Delete</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export function MenuDemo() {
	const profile = useRef<IconHandle>(null);
	const settings = useRef<IconHandle>(null);
	const logout = useRef<IconHandle>(null);

	const item =
		"text-textSecondary hover:text-textPrimary hover:bg-white/5 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors";

	return (
		<div className="border-border bg-bgDark w-full max-w-56 rounded-xl border p-1.5">
			<button
				type="button"
				className={item}
				onMouseEnter={(e) => handleHover(e, profile)}
				onMouseLeave={(e) => handleHover(e, profile)}
			>
				<UserIcon ref={profile} size={16} />
				Profile
			</button>
			<button
				type="button"
				className={item}
				onMouseEnter={(e) => handleHover(e, settings)}
				onMouseLeave={(e) => handleHover(e, settings)}
			>
				<SettingsIcon ref={settings} size={16} />
				Settings
			</button>
			<button
				type="button"
				className={item}
				onMouseEnter={(e) => handleHover(e, logout)}
				onMouseLeave={(e) => handleHover(e, logout)}
			>
				<LogOutIcon ref={logout} size={16} />
				Log out
			</button>
		</div>
	);
}

export function BannerDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<div
			onMouseEnter={(e) => handleHover(e, ref)}
			onMouseLeave={(e) => handleHover(e, ref)}
			className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
		>
			<CircleCheckIcon
				ref={ref}
				size={18}
				className="shrink-0 text-emerald-400"
			/>
			<p className="text-textPrimary text-sm">Your changes have been saved.</p>
		</div>
	);
}

export function NavbarDemo() {
	const bell = useRef<IconHandle>(null);
	const settings = useRef<IconHandle>(null);
	const user = useRef<IconHandle>(null);

	return (
		<div className="border-border bg-bgDark flex w-full max-w-sm items-center justify-between rounded-xl border px-4 py-2">
			<span className="text-textPrimary text-sm font-semibold">Dashboard</span>
			<div className="flex items-center gap-0.5">
				<Button
					variant="ghost"
					size="icon"
					aria-label="Notifications"
					onMouseEnter={(e) => handleHover(e, bell)}
					onMouseLeave={(e) => handleHover(e, bell)}
				>
					<BellIcon ref={bell} size={18} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Settings"
					onMouseEnter={(e) => handleHover(e, settings)}
					onMouseLeave={(e) => handleHover(e, settings)}
				>
					<SettingsIcon ref={settings} size={18} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Account"
					onMouseEnter={(e) => handleHover(e, user)}
					onMouseLeave={(e) => handleHover(e, user)}
				>
					<UserIcon ref={user} size={18} />
				</Button>
			</div>
		</div>
	);
}
