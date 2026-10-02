"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { BookmarkIcon } from "@/icons/huge/bookmark-icon";
import { NotificationIcon } from "@/icons/huge/notification-icon";
import { StarIcon } from "@/icons/huge/star-icon";
import { useIconHover, type IconTrigger } from "@/npm/src/lib/use-icon-hover";
import type { IconHandle } from "@/types/icon";
import type { ComponentType, ReactNode, Ref } from "react";

type IconProps = { size?: number; ref?: Ref<IconHandle> };

const Frame = ({ children }: { children: ReactNode }) => (
	<div className="flex flex-col items-center gap-4">{children}</div>
);

const Caption = ({ children }: { children: ReactNode }) => (
	<span className="text-textMuted text-xs">{children}</span>
);

export function HoverDemo() {
	const { ref, triggerProps } = useIconHover();

	return (
		<Frame>
			<Button variant="secondary" {...triggerProps}>
				<NotificationIcon ref={ref} size={18} />
				Notifications
			</Button>
			<Caption>Hover the button to play the animation.</Caption>
		</Frame>
	);
}

export function ClickDemo() {
	const { ref, triggerProps } = useIconHover({ trigger: "click" });

	return (
		<Frame>
			<Button variant="secondary" {...triggerProps}>
				<CopyIcon ref={ref} size={18} />
				Copy
			</Button>
			<Caption>Click the button to play the animation.</Caption>
		</Frame>
	);
}

export function BothDemo() {
	const { ref, triggerProps } = useIconHover({ trigger: "both" });

	return (
		<Frame>
			<Button variant="secondary" {...triggerProps}>
				<BookmarkIcon ref={ref} size={18} />
				Save
			</Button>
			<Caption>Hover or click the button to play the animation.</Caption>
		</Frame>
	);
}

const triggerConfig = [
	{ icon: "bell", trigger: "click" },
	{ icon: "bookmark", trigger: "hover" },
] as const;

export function ConfigDemo() {
	const {
		icon: { bell, bookmark },
		trigger,
	} = useIconHover({ trigger: triggerConfig });

	return (
		<Frame>
			<div className="flex flex-wrap items-start justify-center gap-4">
				<div className="flex flex-col items-center gap-2">
					<Button variant="secondary" {...trigger}>
						<BookmarkIcon {...bookmark} size={18} />
						Save
					</Button>
					<Caption>bookmark: hover</Caption>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Button variant="secondary" {...trigger}>
						<NotificationIcon {...bell} size={18} />
						Notify
					</Button>
					<Caption>bell: click</Caption>
				</div>
			</div>
		</Frame>
	);
}

type ToolbarItem = {
	icon: ComponentType<IconProps>;
	label: string;
	trigger: IconTrigger;
};

const TOOLBAR: ToolbarItem[] = [
	{ icon: NotificationIcon, label: "Notify", trigger: "hover" },
	{ icon: BookmarkIcon, label: "Save", trigger: "click" },
	{ icon: StarIcon, label: "Favorite", trigger: "both" },
];

function ActionButton({ icon: Icon, label, trigger }: ToolbarItem) {
	const { ref, triggerProps } = useIconHover({ trigger });

	return (
		<div className="flex flex-col items-center gap-2">
			<Button variant="secondary" {...triggerProps}>
				<Icon ref={ref} size={18} />
				{label}
			</Button>
			<Caption>{trigger}</Caption>
		</div>
	);
}

export function ToolbarDemo() {
	return (
		<Frame>
			<div className="flex flex-wrap items-start justify-center gap-4">
				{TOOLBAR.map((item) => (
					<ActionButton key={item.label} {...item} />
				))}
			</div>
		</Frame>
	);
}
