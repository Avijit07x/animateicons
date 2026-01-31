import { BellIcon as HuBellIcon } from "../../icons/huge/bell-icon";
import { BookmarkIcon as HuBookmarkIcon } from "../../icons/huge/bookmark-icon";
import { CheckCheckIcon as HuCheckCheckIcon } from "../../icons/huge/check-check-icon";
import { CheckIcon as HuCheckIcon } from "../../icons/huge/check-icon";
import { ChevronRightIcon as HuChevronRightIcon } from "../../icons/huge/chevron-right-icon";
import { CopyIcon as HuCopyIcon } from "../../icons/huge/copy-icon";
import { DownloadIcon as HuDownloadIcon } from "../../icons/huge/download-icon";
import { EyeIcon as HuEyeIcon } from "../../icons/huge/eye-icon";
import { HeartIcon as HuHeartIcon } from "../../icons/huge/heart-icon";
import { SearchIcon as HuSearchIcon } from "../../icons/huge/search-icon";

import { ActivityIcon } from "../../icons/lucide/activity-icon";
import { BellIcon } from "../../icons/lucide/bell-icon";
import { BookmarkIcon } from "../../icons/lucide/bookmark-icon";
import { ChartBarIcon } from "../../icons/lucide/chart-bar-icon";
import { CheckIcon } from "../../icons/lucide/check-icon";
import { ChevronRightIcon } from "../../icons/lucide/chevron-right-icon";
import { CopyIcon } from "../../icons/lucide/copy-icon";
import { DashboardIcon } from "../../icons/lucide/dashboard-icon";
import { DownloadIcon } from "../../icons/lucide/download-icon";
import { ExternalLinkIcon } from "../../icons/lucide/external-link-icon";
import { EyeIcon } from "../../icons/lucide/eye-icon";
import { FolderIcon } from "../../icons/lucide/folder-icon";
import { HeartIcon } from "../../icons/lucide/heart-icon";
import { HouseIcon } from "../../icons/lucide/house-icon";
import { LayoutGridIcon } from "../../icons/lucide/layout-grid-icon";
import { LinkIcon } from "../../icons/lucide/link-icon";
import { LoaderIcon } from "../../icons/lucide/loader-icon";
import { LockIcon } from "../../icons/lucide/lock-icon";
import { MailIcon } from "../../icons/lucide/mail-icon";
import { MenuIcon } from "../../icons/lucide/menu-icon";
import { MoonIcon } from "../../icons/lucide/moon-icon";
import { MoveRightIcon } from "../../icons/lucide/move-right-icon";
import { PlusIcon } from "../../icons/lucide/plus-icon";
import { SearchIcon } from "../../icons/lucide/search-icon";
import { SettingsIcon } from "../../icons/lucide/settings-icon";
import { ShareIcon } from "../../icons/lucide/share-icon";
import { StarIcon } from "../../icons/lucide/star-icon";
import { SunIcon } from "../../icons/lucide/sun-icon";
import { TrashIcon } from "../../icons/lucide/trash-icon";
import { UploadIcon } from "../../icons/lucide/upload-icon";
import { UserIcon } from "../../icons/lucide/user-icon";

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
	ActivityIcon,
	BellIcon,
	BookmarkIcon,
	ChartBarIcon,
	CheckIcon,
	ChevronRightIcon,
	CopyIcon,
	DashboardIcon,
	DownloadIcon,
	ExternalLinkIcon,
	EyeIcon,
	FolderIcon,
	HeartIcon,
	HouseIcon,
	LayoutGridIcon,
	LinkIcon,
	LoaderIcon,
	LockIcon,
	MailIcon,
	MenuIcon,
	MoonIcon,
	MoveRightIcon,
	PlusIcon,
	SearchIcon,
	SettingsIcon,
	ShareIcon,
	StarIcon,
	SunIcon,
	TrashIcon,
	UploadIcon,
	UserIcon,
];
export const HugeIcons: AnimatedIconComponent[] = [
	HuHeartIcon,
	HuSearchIcon,
	HuBellIcon,
	HuBookmarkIcon,
	HuCopyIcon,
	HuEyeIcon,
	HuCheckIcon,
	HuCheckCheckIcon,
	HuChevronRightIcon,
	HuDownloadIcon,
];
