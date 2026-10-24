"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
	ALL_CATEGORIES,
	categoriesOf,
	useIconCategory,
} from "@/hooks/useIconCategory";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

type CategoryLinkProps = {
	label: string;
	count: number;
	href: string;
	isActive: boolean;
};

const CategoryLink: React.FC<CategoryLinkProps> = ({
	label,
	count,
	href,
	isActive,
}) => (
	<SidebarMenuItem>
		<SidebarMenuButton
			asChild
			variant="dark"
			isActive={isActive}
			className="h-9 justify-between gap-3 px-3 text-[13px]"
		>
			<Link href={href} replace scroll={false}>
				<span className="truncate">{label}</span>
				<span
					className={cn(
						"rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums transition-colors",
						isActive
							? "bg-primary/15 text-primary"
							: "text-textMuted bg-white/6",
					)}
				>
					{count}
				</span>
			</Link>
		</SidebarMenuButton>
	</SidebarMenuItem>
);

type ListProps = {
	library: IconLibrary;
	active: string;
	hrefFor: (category: string) => string;
};

const CategoryList: React.FC<ListProps> = ({ library, active, hrefFor }) => (
	<>
		<CategoryLink
			label="All"
			count={ICON_COUNTS[library]}
			href={hrefFor(ALL_CATEGORIES)}
			isActive={active === ALL_CATEGORIES}
		/>
		{categoriesOf(library).map((category) => (
			<CategoryLink
				key={category.name}
				label={category.name}
				count={category.count}
				href={hrefFor(category.name)}
				isActive={active === category.name}
			/>
		))}
	</>
);

const UrlCategoryList: React.FC<{ library: IconLibrary }> = ({ library }) => {
	const { category, hrefFor } = useIconCategory(library);
	return <CategoryList library={library} active={category} hrefFor={hrefFor} />;
};

const staticHref = (library: IconLibrary) => (category: string) =>
	category === ALL_CATEGORIES
		? `/icons/${library}`
		: `/icons/${library}?category=${encodeURIComponent(category)}`;

const CategoryNav: React.FC<{ library: IconLibrary }> = ({ library }) => (
	<Suspense
		fallback={
			<CategoryList
				library={library}
				active={ALL_CATEGORIES}
				hrefFor={staticHref(library)}
			/>
		}
	>
		<UrlCategoryList library={library} />
	</Suspense>
);

export default CategoryNav;
