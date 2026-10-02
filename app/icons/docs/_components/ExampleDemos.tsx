"use client";

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
import { CheckmarkCircle01Icon } from "@/icons/huge/checkmark-circle-0-1-icon";
import { Delete02Icon } from "@/icons/huge/delete-0-2-icon";
import { DownloadIcon } from "@/icons/huge/download-icon";
import { Logout01Icon } from "@/icons/huge/logout-0-1-icon";
import { NotificationIcon } from "@/icons/huge/notification-icon";
import { SearchIcon } from "@/icons/huge/search-icon";
import { Settings01Icon } from "@/icons/huge/settings-0-1-icon";
import { SparklesIcon } from "@/icons/huge/sparkles-icon";
import { UserIcon } from "@/icons/huge/user-icon";
import type { IconHandle } from "@/types/icon";
import { useRef } from "react";

export function ButtonDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<Button
			onMouseEnter={() => ref.current?.startAnimation()}
			onMouseLeave={() => ref.current?.stopAnimation()}
		>
			<DownloadIcon ref={ref} size={16} />
			Download
		</Button>
	);
}

export function InputDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<InputGroup className="bg-surfaceElevated w-full max-w-xs rounded-full border-0 shadow-none">
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
			onMouseEnter={() => ref.current?.startAnimation()}
			onMouseLeave={() => ref.current?.stopAnimation()}
			className="bg-surface w-full max-w-xs rounded-3xl p-5"
		>
			<div className="bg-primary/10 text-primary mb-3 flex size-11 items-center justify-center rounded-full">
				<SparklesIcon ref={ref} size={20} />
			</div>
			<p className="text-textPrimary font-semibold">Smart suggestions</p>
			<p className="text-textMuted mt-1 text-sm">
				Get AI-powered icon recommendations as you type.
			</p>
			<Button size="sm" variant="secondary" className="mt-4">
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
						variant="secondary"
						size="icon"
						aria-label="Delete"
						onMouseEnter={() => ref.current?.startAnimation()}
						onMouseLeave={() => ref.current?.stopAnimation()}
					>
						<Delete02Icon ref={ref} size={16} />
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
		"text-textSecondary hover:text-textPrimary hover:bg-white/8 flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-colors";

	return (
		<div className="bg-surfaceElevated w-full max-w-56 rounded-3xl p-1.5">
			<button
				type="button"
				className={item}
				onMouseEnter={() => profile.current?.startAnimation()}
				onMouseLeave={() => profile.current?.stopAnimation()}
			>
				<UserIcon ref={profile} size={16} />
				Profile
			</button>
			<button
				type="button"
				className={item}
				onMouseEnter={() => settings.current?.startAnimation()}
				onMouseLeave={() => settings.current?.stopAnimation()}
			>
				<Settings01Icon ref={settings} size={16} />
				Settings
			</button>
			<button
				type="button"
				className={item}
				onMouseEnter={() => logout.current?.startAnimation()}
				onMouseLeave={() => logout.current?.stopAnimation()}
			>
				<Logout01Icon ref={logout} size={16} />
				Log out
			</button>
		</div>
	);
}

export function BannerDemo() {
	const ref = useRef<IconHandle>(null);
	return (
		<div
			onMouseEnter={() => ref.current?.startAnimation()}
			onMouseLeave={() => ref.current?.stopAnimation()}
			className="flex w-full max-w-sm items-center gap-3 rounded-3xl bg-emerald-500/10 px-4 py-3"
		>
			<CheckmarkCircle01Icon
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
		<div className="bg-surfaceElevated flex w-full max-w-sm items-center justify-between rounded-full py-1.5 pr-2 pl-5">
			<span className="text-textPrimary text-sm font-semibold">Dashboard</span>
			<div className="flex items-center gap-0.5">
				<Button
					variant="ghost"
					size="icon"
					aria-label="Notifications"
					onMouseEnter={() => bell.current?.startAnimation()}
					onMouseLeave={() => bell.current?.stopAnimation()}
				>
					<NotificationIcon ref={bell} size={18} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Settings"
					onMouseEnter={() => settings.current?.startAnimation()}
					onMouseLeave={() => settings.current?.stopAnimation()}
				>
					<Settings01Icon ref={settings} size={18} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Account"
					onMouseEnter={() => user.current?.startAnimation()}
					onMouseLeave={() => user.current?.stopAnimation()}
				>
					<UserIcon ref={user} size={18} />
				</Button>
			</div>
		</div>
	);
}
