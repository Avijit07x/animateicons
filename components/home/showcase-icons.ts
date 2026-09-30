import { getIcon } from "@/icons/huge/meta";
import { getIcon as getLucideIcon } from "@/icons/lucide/meta";

export const SHOWCASE_NAMES = [
	"notification",
	"heart",
	"search",
	"download",
	"settings-0-1",
	"eye",
	"star",
	"music-0-1",
	"camera-0-1",
	"calendar-0-1",
	"folder-0-1",
	"mail-0-1",
	"lock-open",
	"trophy",
	"flash",
	"rocket-0-1",
	"gift",
	"palette",
	"shield-check",
	"clock-0-1",
	"home-0-1",
	"chat-0-1",
	"share-0-1",
	"upload-0-1",
	"bookmark",
	"key-0-1",
	"sparkles",
	"compass-0-1",
	"wifi-0-1",
	"code-xml",
] as const;

export const SHOWCASE = SHOWCASE_NAMES.map((name) => ({
	name,
	Icon: getIcon(name),
}));

export const PLAYGROUND_NAMES = [
	"home-0-1",
	"dashboard-0-1",
	"user",
	"search",
	"notification",
	"star",
	"chat-0-1",
	"calendar-0-1",
	"analytics-0-1",
	"folder-0-1",
	"heart",
	"settings-0-1",
] as const;

export const PLAYGROUND_ICONS = PLAYGROUND_NAMES.map((name) => ({
	name,
	Icon: getIcon(name),
}));

export const LIBRARY_PREVIEW_NAMES = {
	lucide: [
		"house",
		"search",
		"user",
		"settings",
		"mail",
		"bell",
		"heart",
		"download",
		"calendar",
		"message-circle",
		"shopping-cart",
		"trash-2",
	],
	huge: [
		"home-0-1",
		"search",
		"user",
		"settings-0-1",
		"mail-0-1",
		"notification",
		"heart",
		"download",
		"calendar-0-1",
		"chat-0-1",
		"shopping-cart-0-1",
		"delete-0-2",
	],
} as const;

export const LIBRARY_PREVIEWS = {
	lucide: LIBRARY_PREVIEW_NAMES.lucide.map((name) => ({
		name,
		Icon: getLucideIcon(name),
	})),
	huge: LIBRARY_PREVIEW_NAMES.huge.map((name) => ({
		name,
		Icon: getIcon(name),
	})),
};
