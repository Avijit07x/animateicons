import { BellIcon as FaBellIcon } from "@/icons/fontawesome/bell-icon";

import { ActivityIcon as HuActivityIcon } from "@/icons/huge/activity-icon";
import { BookmarkCheckIcon as HuBookmarkCheckIcon } from "@/icons/huge/bookmark-check-icon";
import { BookmarkIcon as HuBookmarkIcon } from "@/icons/huge/bookmark-icon";
import { BookmarkMinusIcon as HuBookmarkMinusIcon } from "@/icons/huge/bookmark-minus-icon";
import { BookmarkRemoveIcon as HuBookmarkRemoveIcon } from "@/icons/huge/bookmark-remove-icon";
import { CheckCheckIcon as HuCheckCheckIcon } from "@/icons/huge/check-check-icon";
import { CheckIcon as HuCheckIcon } from "@/icons/huge/check-icon";
import { ChevronRightIcon as HuChevronRightIcon } from "@/icons/huge/chevron-right-icon";
import { Compass01Icon as HuCompass01Icon } from "@/icons/huge/compass-0-1-icon";
import { Compass02Icon as HuCompass02Icon } from "@/icons/huge/compass-0-2-icon";
import { CopyIcon as HuCopyIcon } from "@/icons/huge/copy-icon";
import { Dashboard01Icon as HuDashboard01Icon } from "@/icons/huge/dashboard-0-1-icon";
import { Dashboard02Icon as HuDashboard02Icon } from "@/icons/huge/dashboard-0-2-icon";
import { Dashboard03Icon as HuDashboard03Icon } from "@/icons/huge/dashboard-0-3-icon";
import { DiscordIcon as HuDiscordIcon } from "@/icons/huge/discord-icon";
import { DownloadIcon as HuDownloadIcon } from "@/icons/huge/download-icon";
import { EyeIcon as HuEyeIcon } from "@/icons/huge/eye-icon";
import { FacebookIcon as HuFacebookIcon } from "@/icons/huge/facebook-icon";
import { FigmaIcon as HuFigmaIcon } from "@/icons/huge/figma-icon";
import { GithubIcon as HuGithubIcon } from "@/icons/huge/github-icon";
import { HeartIcon as HuHeartIcon } from "@/icons/huge/heart-icon";
import { Loading01Icon as HuLoading01Icon } from "@/icons/huge/loading-0-1-icon";
import { Loading02Icon as HuLoading02Icon } from "@/icons/huge/loading-0-2-icon";
import { Menu01Icon as HuMenu01Icon } from "@/icons/huge/menu-0-1-icon";
import { Menu02Icon as HuMenu02Icon } from "@/icons/huge/menu-0-2-icon";
import { MousePointerClick01Icon as HuMousePointerClick01Icon } from "@/icons/huge/mouse-pointer-click-0-1-icon";
import { NotificationIcon as HuNotificationIcon } from "@/icons/huge/notification-icon";
import { NotificationOffIcon as HuNotificationOffIcon } from "@/icons/huge/notification-off-icon";
import { SearchIcon as HuSearchIcon } from "@/icons/huge/search-icon";
import { Settings01Icon as HuSettings01Icon } from "@/icons/huge/settings-0-1-icon";
import { TwitterIcon as HuTwitterIcon } from "@/icons/huge/twitter-icon";

import { ActivityIcon } from "@/icons/lucide/activity-icon";
import { BellIcon } from "@/icons/lucide/bell-icon";
import { BookmarkIcon } from "@/icons/lucide/bookmark-icon";
import { ChartBarIcon } from "@/icons/lucide/chart-bar-icon";
import { CheckIcon } from "@/icons/lucide/check-icon";
import { ChevronRightIcon } from "@/icons/lucide/chevron-right-icon";
import { CopyIcon } from "@/icons/lucide/copy-icon";
import { DashboardIcon } from "@/icons/lucide/dashboard-icon";
import { DownloadIcon } from "@/icons/lucide/download-icon";
import { ExternalLinkIcon } from "@/icons/lucide/external-link-icon";
import { EyeIcon } from "@/icons/lucide/eye-icon";
import { FolderIcon } from "@/icons/lucide/folder-icon";
import { HeartIcon } from "@/icons/lucide/heart-icon";
import { HouseIcon } from "@/icons/lucide/house-icon";
import { LayoutGridIcon } from "@/icons/lucide/layout-grid-icon";
import { LinkIcon } from "@/icons/lucide/link-icon";
import { LoaderIcon } from "@/icons/lucide/loader-icon";
import { LockIcon } from "@/icons/lucide/lock-icon";
import { MailIcon } from "@/icons/lucide/mail-icon";
import { MenuIcon } from "@/icons/lucide/menu-icon";
import { MoonIcon } from "@/icons/lucide/moon-icon";
import { MoveRightIcon } from "@/icons/lucide/move-right-icon";
import { PlusIcon } from "@/icons/lucide/plus-icon";
import { SearchIcon } from "@/icons/lucide/search-icon";
import { SettingsIcon } from "@/icons/lucide/settings-icon";
import { ShareIcon } from "@/icons/lucide/share-icon";
import { StarIcon } from "@/icons/lucide/star-icon";
import { SunIcon } from "@/icons/lucide/sun-icon";
import { TrashIcon } from "@/icons/lucide/trash-icon";
import { UploadIcon } from "@/icons/lucide/upload-icon";
import { UserIcon } from "@/icons/lucide/user-icon";

import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type AnimatedIconProps = {
	size?: number;
	className?: string;
	isAnimated?: boolean;
};

export type AnimatedIconComponent = ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<any>
>;

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

export const FontAwesomeIcons: AnimatedIconComponent[] = [FaBellIcon];
