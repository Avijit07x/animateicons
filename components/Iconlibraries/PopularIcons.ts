import dynamic from "next/dynamic";
const HuActivityIcon = dynamic(() =>
	import("@/icons/huge/activity-icon").then((m) => m.ActivityIcon),
);
const HuBookmarkCheckIcon = dynamic(() =>
	import("@/icons/huge/bookmark-check-icon").then((m) => m.BookmarkCheckIcon),
);
const HuBookmarkIcon = dynamic(() =>
	import("@/icons/huge/bookmark-icon").then((m) => m.BookmarkIcon),
);
const HuBookmarkMinusIcon = dynamic(() =>
	import("@/icons/huge/bookmark-minus-icon").then((m) => m.BookmarkMinusIcon),
);
const HuBookmarkRemoveIcon = dynamic(() =>
	import("@/icons/huge/bookmark-remove-icon").then((m) => m.BookmarkRemoveIcon),
);
const HuCheckCheckIcon = dynamic(() =>
	import("@/icons/huge/check-check-icon").then((m) => m.CheckCheckIcon),
);
const HuCheckIcon = dynamic(() =>
	import("@/icons/huge/check-icon").then((m) => m.CheckIcon),
);
const HuChevronRightIcon = dynamic(() =>
	import("@/icons/huge/chevron-right-icon").then((m) => m.ChevronRightIcon),
);
const HuCompass01Icon = dynamic(() =>
	import("@/icons/huge/compass-0-1-icon").then((m) => m.Compass01Icon),
);
const HuCompass02Icon = dynamic(() =>
	import("@/icons/huge/compass-0-2-icon").then((m) => m.Compass02Icon),
);
const HuCopyIcon = dynamic(() =>
	import("@/icons/huge/copy-icon").then((m) => m.CopyIcon),
);
const HuDashboard01Icon = dynamic(() =>
	import("@/icons/huge/dashboard-0-1-icon").then((m) => m.Dashboard01Icon),
);
const HuDashboard02Icon = dynamic(() =>
	import("@/icons/huge/dashboard-0-2-icon").then((m) => m.Dashboard02Icon),
);
const HuDashboard03Icon = dynamic(() =>
	import("@/icons/huge/dashboard-0-3-icon").then((m) => m.Dashboard03Icon),
);
const HuDiscordIcon = dynamic(() =>
	import("@/icons/huge/discord-icon").then((m) => m.DiscordIcon),
);
const HuDownloadIcon = dynamic(() =>
	import("@/icons/huge/download-icon").then((m) => m.DownloadIcon),
);
const HuEyeIcon = dynamic(() =>
	import("@/icons/huge/eye-icon").then((m) => m.EyeIcon),
);
const HuFacebookIcon = dynamic(() =>
	import("@/icons/huge/facebook-icon").then((m) => m.FacebookIcon),
);
const HuFigmaIcon = dynamic(() =>
	import("@/icons/huge/figma-icon").then((m) => m.FigmaIcon),
);
const HuGithubIcon = dynamic(() =>
	import("@/icons/huge/github-icon").then((m) => m.GithubIcon),
);
const HuHeartIcon = dynamic(() =>
	import("@/icons/huge/heart-icon").then((m) => m.HeartIcon),
);
const HuLoading01Icon = dynamic(() =>
	import("@/icons/huge/loading-0-1-icon").then((m) => m.Loading01Icon),
);
const HuLoading02Icon = dynamic(() =>
	import("@/icons/huge/loading-0-2-icon").then((m) => m.Loading02Icon),
);
const HuMenu01Icon = dynamic(() =>
	import("@/icons/huge/menu-0-1-icon").then((m) => m.Menu01Icon),
);
const HuMenu02Icon = dynamic(() =>
	import("@/icons/huge/menu-0-2-icon").then((m) => m.Menu02Icon),
);
const HuMousePointerClick01Icon = dynamic(() =>
	import("@/icons/huge/mouse-pointer-click-0-1-icon").then(
		(m) => m.MousePointerClick01Icon,
	),
);
const HuNotificationIcon = dynamic(() =>
	import("@/icons/huge/notification-icon").then((m) => m.NotificationIcon),
);
const HuNotificationOffIcon = dynamic(() =>
	import("@/icons/huge/notification-off-icon").then(
		(m) => m.NotificationOffIcon,
	),
);
const HuSearchIcon = dynamic(() =>
	import("@/icons/huge/search-icon").then((m) => m.SearchIcon),
);
const HuSettings01Icon = dynamic(() =>
	import("@/icons/huge/settings-0-1-icon").then((m) => m.Settings01Icon),
);
const HuTwitterIcon = dynamic(() =>
	import("@/icons/huge/twitter-icon").then((m) => m.TwitterIcon),
);

const ActivityIcon = dynamic(() =>
	import("@/icons/lucide/activity-icon").then((m) => m.ActivityIcon),
);
const BellIcon = dynamic(() =>
	import("@/icons/lucide/bell-icon").then((m) => m.BellIcon),
);
const BookmarkIcon = dynamic(() =>
	import("@/icons/lucide/bookmark-icon").then((m) => m.BookmarkIcon),
);
const ChartBarIcon = dynamic(() =>
	import("@/icons/lucide/chart-bar-icon").then((m) => m.ChartBarIcon),
);
const CheckIcon = dynamic(() =>
	import("@/icons/lucide/check-icon").then((m) => m.CheckIcon),
);
const ChevronRightIcon = dynamic(() =>
	import("@/icons/lucide/chevron-right-icon").then((m) => m.ChevronRightIcon),
);
const CopyIcon = dynamic(() =>
	import("@/icons/lucide/copy-icon").then((m) => m.CopyIcon),
);
const DashboardIcon = dynamic(() =>
	import("@/icons/lucide/dashboard-icon").then((m) => m.DashboardIcon),
);
const DownloadIcon = dynamic(() =>
	import("@/icons/lucide/download-icon").then((m) => m.DownloadIcon),
);
const ExternalLinkIcon = dynamic(() =>
	import("@/icons/lucide/external-link-icon").then((m) => m.ExternalLinkIcon),
);
const EyeIcon = dynamic(() =>
	import("@/icons/lucide/eye-icon").then((m) => m.EyeIcon),
);
const FolderIcon = dynamic(() =>
	import("@/icons/lucide/folder-icon").then((m) => m.FolderIcon),
);
const HeartIcon = dynamic(() =>
	import("@/icons/lucide/heart-icon").then((m) => m.HeartIcon),
);
const HouseIcon = dynamic(() =>
	import("@/icons/lucide/house-icon").then((m) => m.HouseIcon),
);
const LayoutGridIcon = dynamic(() =>
	import("@/icons/lucide/layout-grid-icon").then((m) => m.LayoutGridIcon),
);
const LinkIcon = dynamic(() =>
	import("@/icons/lucide/link-icon").then((m) => m.LinkIcon),
);
const LoaderIcon = dynamic(() =>
	import("@/icons/lucide/loader-icon").then((m) => m.LoaderIcon),
);
const LockIcon = dynamic(() =>
	import("@/icons/lucide/lock-icon").then((m) => m.LockIcon),
);
const MailIcon = dynamic(() =>
	import("@/icons/lucide/mail-icon").then((m) => m.MailIcon),
);
const MenuIcon = dynamic(() =>
	import("@/icons/lucide/menu-icon").then((m) => m.MenuIcon),
);
const MoonIcon = dynamic(() =>
	import("@/icons/lucide/moon-icon").then((m) => m.MoonIcon),
);
const MoveRightIcon = dynamic(() =>
	import("@/icons/lucide/move-right-icon").then((m) => m.MoveRightIcon),
);
const PlusIcon = dynamic(() =>
	import("@/icons/lucide/plus-icon").then((m) => m.PlusIcon),
);
const SearchIcon = dynamic(() =>
	import("@/icons/lucide/search-icon").then((m) => m.SearchIcon),
);
const SettingsIcon = dynamic(() =>
	import("@/icons/lucide/settings-icon").then((m) => m.SettingsIcon),
);
const ShareIcon = dynamic(() =>
	import("@/icons/lucide/share-icon").then((m) => m.ShareIcon),
);
const StarIcon = dynamic(() =>
	import("@/icons/lucide/star-icon").then((m) => m.StarIcon),
);
const SunIcon = dynamic(() =>
	import("@/icons/lucide/sun-icon").then((m) => m.SunIcon),
);
const TrashIcon = dynamic(() =>
	import("@/icons/lucide/trash-icon").then((m) => m.TrashIcon),
);
const UploadIcon = dynamic(() =>
	import("@/icons/lucide/upload-icon").then((m) => m.UploadIcon),
);
const UserIcon = dynamic(() =>
	import("@/icons/lucide/user-icon").then((m) => m.UserIcon),
);

import type React from "react";

export type AnimatedIconProps = {
	size?: number;
	className?: string;
	isAnimated?: boolean;
};

export type AnimatedIconComponent = React.ComponentType<AnimatedIconProps>;

export const LucideIcons: AnimatedIconComponent[] = [
	MenuIcon,
	DashboardIcon,
	LayoutGridIcon,
	HouseIcon,
	SearchIcon,
	CopyIcon,
	DownloadIcon,
	UploadIcon,
	ShareIcon,
	ExternalLinkIcon,
	BellIcon,
	CheckIcon,
	EyeIcon,
	BookmarkIcon,
	HeartIcon,
	StarIcon,
	FolderIcon,
	LinkIcon,
	SettingsIcon,
	LockIcon,
	UserIcon,
	MailIcon,
	ActivityIcon,
	ChartBarIcon,
	LoaderIcon,
	SunIcon,
	MoonIcon,
	ChevronRightIcon,
	MoveRightIcon,
	PlusIcon,
	TrashIcon,
];

export const HugeIcons: AnimatedIconComponent[] = [
	HuMenu01Icon,
	HuDashboard01Icon,
	HuSearchIcon,
	HuCopyIcon,
	HuDownloadIcon,
	HuNotificationIcon,
	HuNotificationOffIcon,
	HuCheckIcon,
	HuCheckCheckIcon,
	HuEyeIcon,
	HuBookmarkIcon,
	HuBookmarkCheckIcon,
	HuBookmarkMinusIcon,
	HuBookmarkRemoveIcon,
	HuHeartIcon,
	HuSettings01Icon,
	HuActivityIcon,
	HuLoading01Icon,
	HuLoading02Icon,
	HuChevronRightIcon,
	HuCompass01Icon,
	HuCompass02Icon,
	HuMousePointerClick01Icon,
	HuMenu02Icon,
	HuDashboard02Icon,
	HuDashboard03Icon,
	HuGithubIcon,
	HuFigmaIcon,
	HuDiscordIcon,
	HuFacebookIcon,
	HuTwitterIcon,
];
