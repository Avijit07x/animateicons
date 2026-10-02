import { readFileSync } from "node:fs";
import path from "node:path";

const hookSource = readFileSync(
	path.join(process.cwd(), "npm/src/lib/use-icon-hover.ts"),
	"utf8",
);

const HANDLE_IMPORT = 'import type { IconHandle } from "./icon-handle";';

if (!hookSource.includes(HANDLE_IMPORT)) {
	throw new Error(
		"hover-helper snippets: use-icon-hover.ts no longer imports IconHandle from ./icon-handle",
	);
}

export const hoverCode = `"use client"

import { Button } from "@/components/ui/button"
import { NotificationIcon } from "@animateicons/react/huge"
import { useIconHover } from "@animateicons/react"

export function NotificationBell() {
	const { ref, triggerProps } = useIconHover()

	return (
		<Button variant="secondary" {...triggerProps}>
			<NotificationIcon ref={ref} size={18} />
			Notifications
		</Button>
	)
}`;

export const clickCode = `"use client"

import { Button } from "@/components/ui/button"
import { CopyIcon } from "@animateicons/react/huge"
import { useIconHover } from "@animateicons/react"

export function CopyButton() {
	const { ref, triggerProps } = useIconHover({ trigger: "click" })

	return (
		<Button variant="secondary" {...triggerProps}>
			<CopyIcon ref={ref} size={18} />
			Copy
		</Button>
	)
}`;

export const bothCode = `"use client"

import { Button } from "@/components/ui/button"
import { BookmarkIcon } from "@animateicons/react/huge"
import { useIconHover } from "@animateicons/react"

export function SaveButton() {
	const { ref, triggerProps } = useIconHover({ trigger: "both" })

	return (
		<Button variant="secondary" {...triggerProps}>
			<BookmarkIcon ref={ref} size={18} />
			Save
		</Button>
	)
}`;

export const configCode = `"use client"

import { Button } from "@/components/ui/button"
import { BookmarkIcon, NotificationIcon } from "@animateicons/react/huge"
import { useIconHover } from "@animateicons/react"

const triggerConfig = [
	{ icon: "bell", trigger: "click" },
	{ icon: "bookmark", trigger: "hover" },
] as const

export function Actions() {
	const {
		icon: { bell, bookmark },
		trigger,
	} = useIconHover({ trigger: triggerConfig })

	return (
		<>
			<Button variant="secondary" {...trigger}>
				<BookmarkIcon {...bookmark} size={18} />
				Save
			</Button>

			<Button variant="secondary" {...trigger}>
				<NotificationIcon {...bell} size={18} />
				Notify
			</Button>
		</>
	)
}`;

export const manyCode = `"use client";
import { useIconHover, type IconHandle, type IconTrigger } from "@animateicons/react";
import { BookmarkIcon, NotificationIcon, StarIcon } from "@animateicons/react/huge";
import type { ComponentType, Ref } from "react";

type IconProps = { size?: number; ref?: Ref<IconHandle> };

function ActionButton({
	icon: Icon,
	label,
	trigger,
}: {
	icon: ComponentType<IconProps>;
	label: string;
	trigger: IconTrigger;
}) {
	const { ref, triggerProps } = useIconHover({ trigger });

	return (
		<button {...triggerProps}>
			<Icon ref={ref} size={18} />
			{label}
		</button>
	);
}

export default function Toolbar() {
	return (
		<div>
			<ActionButton icon={NotificationIcon} label="Notify" trigger="hover" />
			<ActionButton icon={BookmarkIcon} label="Save" trigger="click" />
			<ActionButton icon={StarIcon} label="Favorite" trigger="both" />
		</div>
	);
}`;

export const copyHookCode = hookSource
	.replace(
		HANDLE_IMPORT,
		"type IconHandle = {\n\tstartAnimation: () => void;\n\tstopAnimation: () => void;\n};",
	)
	.trim();
