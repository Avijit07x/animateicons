import { HuBellIcon } from "@/Icons/huge/HuBellIcon";
import { HuBookmarkIcon } from "@/Icons/huge/HuBookmarkIcon";
import { HuCheckCheckIcon } from "@/Icons/huge/HuCheckCheckIcon";
import { HuCheckIcon } from "@/Icons/huge/HuCheckIcon";
import { HuChevronRightIcon } from "@/Icons/huge/HuChevronRightIcon";
import { HuCopyIcon } from "@/Icons/huge/HuCopyIcon";
import { HuDownloadIcon } from "@/Icons/huge/HuDownloadIcon";
import { HuEyeIcon } from "@/Icons/huge/HuEyeIcon";
import { HuHeartIcon } from "@/Icons/huge/HuHeartIcon";
import { HuSearchIcon } from "@/Icons/huge/HuSearchIcon";
import { ActivityIcon } from "@/Icons/lucide/ActivityIcon";
import { BellIcon } from "@/Icons/lucide/BellIcon";
import { BookmarkIcon } from "@/Icons/lucide/BookmarkIcon";
import { ChartBarIcon } from "@/Icons/lucide/ChartBarIcon";
import { CheckIcon } from "@/Icons/lucide/CheckIcon";
import { ChevronRightIcon } from "@/Icons/lucide/ChevronRightIcon";
import { CopyIcon } from "@/Icons/lucide/CopyIcon";
import { DashboardIcon } from "@/Icons/lucide/DashboardIcon";
import { DownloadIcon } from "@/Icons/lucide/DownloadIcon";
import { ExternalLinkIcon } from "@/Icons/lucide/ExternalLinkIcon";
import { EyeIcon } from "@/Icons/lucide/EyeIcon";
import { FolderIcon } from "@/Icons/lucide/FolderIcon";
import { HeartIcon } from "@/Icons/lucide/HeartIcon";
import { HouseIcon } from "@/Icons/lucide/HouseIcon";
import { LayoutGridIcon } from "@/Icons/lucide/LayoutGridIcon";
import { LinkIcon } from "@/Icons/lucide/LinkIcon";
import { LoaderIcon } from "@/Icons/lucide/LoaderIcon";
import { LockIcon } from "@/Icons/lucide/LockIcon";
import { MailIcon } from "@/Icons/lucide/MailIcon";
import { MenuIcon } from "@/Icons/lucide/MenuIcon";
import { MoonIcon } from "@/Icons/lucide/MoonIcon";
import { MoveRightIcon } from "@/Icons/lucide/MoveRightIcon";
import { PlusIcon } from "@/Icons/lucide/PlusIcon";
import { SearchIcon } from "@/Icons/lucide/SearchIcon";
import { SettingsIcon } from "@/Icons/lucide/SettingsIcon";
import { ShareIcon } from "@/Icons/lucide/ShareIcon";
import { StarIcon } from "@/Icons/lucide/StarIcon";
import { SunIcon } from "@/Icons/lucide/SunIcon";
import { TrashIcon } from "@/Icons/lucide/TrashIcon";
import { UploadIcon } from "@/Icons/lucide/UploadIcon";
import { UserIcon } from "@/Icons/lucide/UserIcon";
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
