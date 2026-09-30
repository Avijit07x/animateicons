"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useIconHover } from "@/hooks/useIconHover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentType } from "react";
import type { SidebarGroupConfig } from "./sidebar.types";

type Props = {
	item: SidebarGroupConfig["items"][number];
	isActive: boolean;
	LibraryIcon?: ComponentType<{ className?: string }>;
	newCount?: number;
};

const SidebarNavItem: React.FC<Props> = ({
	item,
	isActive,
	LibraryIcon,
	newCount = 0,
}) => {
	const { ref, hoverProps } = useIconHover();
	const Icon = item.icon;
	const external = item.target === "_blank";

	const content = (
		<>
			{LibraryIcon ? (
				<LibraryIcon
					className={cn("size-[18px]", isActive && "text-primary")}
				/>
			) : (
				Icon && (
					<Icon
						ref={ref}
						size={18}
						color={item.highlight ? "var(--color-primary)" : undefined}
					/>
				)
			)}
			<span className="flex-1 truncate">{item.label}</span>
			{newCount > 0 && (
				<span className="bg-primary/12 text-primary rounded-full px-1.5 py-px font-mono text-[10px] font-semibold">
					{newCount} New
				</span>
			)}
		</>
	);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				variant="dark"
				isActive={isActive}
				className="h-9 gap-2.5 px-3 text-[13px]"
				{...hoverProps}
			>
				<Link
					href={item.href ?? "#"}
					target={item.target}
					rel={external ? "noopener noreferrer" : undefined}
				>
					{content}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

export default SidebarNavItem;
