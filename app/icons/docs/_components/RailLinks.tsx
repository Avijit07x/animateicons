"use client";

import { GitHub } from "@/components/icons/Github";
import { useIconHover } from "@/hooks/useIconHover";
import { Bug01Icon } from "@/icons/huge/bug-0-1-icon";
import { Edit02Icon } from "@/icons/huge/edit-0-2-icon";
import { Linkedin01Icon } from "@/icons/huge/linkedin-0-1-icon";
import { StarIcon } from "@/icons/huge/star-icon";
import { TwitterIcon } from "@/icons/huge/twitter-icon";
import type { IconHandle } from "@/types/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, Ref } from "react";
import {
	LINKEDIN_URL,
	NEW_ISSUE_URL,
	REPO_URL,
	TWITTER_URL,
	editUrl,
} from "../_lib/links";

type RailIcon = ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;

const RailLink: React.FC<{
	href: string;
	icon: RailIcon;
	children: React.ReactNode;
}> = ({ href, icon: Icon, children }) => {
	const { ref, hoverProps } = useIconHover();

	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			{...hoverProps}
			className="text-textSecondary hover:bg-surfaceElevated hover:text-textPrimary flex items-center gap-2.5 rounded-full px-3 py-2 transition-colors"
		>
			<Icon ref={ref} size={16} />
			{children}
		</Link>
	);
};

const SocialLink: React.FC<{
	href: string;
	label: string;
	icon: RailIcon;
}> = ({ href, label, icon: Icon }) => {
	const { ref, hoverProps } = useIconHover();

	return (
		<Link
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			{...hoverProps}
			className="text-textMuted hover:bg-surfaceElevated hover:text-textPrimary flex size-9 items-center justify-center rounded-full transition-colors"
		>
			<Icon ref={ref} size={16} />
		</Link>
	);
};

const RailLinks: React.FC<{ stars: number | null }> = ({ stars }) => {
	const pathname = usePathname();
	const { ref: starRef, hoverProps: starHoverProps } = useIconHover();

	return (
		<div className="space-y-6 text-[13px]">
			<div>
				<p className="text-textMuted mb-1.5 px-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
					Contribute
				</p>
				<RailLink href={editUrl(pathname)} icon={Edit02Icon}>
					Edit this page
				</RailLink>
				<RailLink href={NEW_ISSUE_URL} icon={Bug01Icon}>
					Report an issue
				</RailLink>
			</div>

			<div>
				<p className="text-textMuted mb-1.5 px-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
					Community
				</p>
				<Link
					href={REPO_URL}
					target="_blank"
					rel="noopener noreferrer"
					{...starHoverProps}
					className="bg-surfaceElevated hover:bg-surfaceActive mb-2 flex items-center gap-2.5 rounded-full px-4 py-2.5 transition-colors"
				>
					<GitHub className="size-4 shrink-0" />
					<span className="text-textPrimary font-medium">Star on GitHub</span>
					{stars !== null && (
						<span className="text-textMuted ml-auto flex items-center gap-1 text-xs">
							<StarIcon ref={starRef} size={13} color="var(--color-warning)" />
							{stars.toLocaleString()}
						</span>
					)}
				</Link>
				<div className="flex items-center gap-1 px-1">
					<SocialLink href={TWITTER_URL} label="Twitter" icon={TwitterIcon} />
					<SocialLink
						href={LINKEDIN_URL}
						label="LinkedIn"
						icon={Linkedin01Icon}
					/>
				</div>
			</div>
		</div>
	);
};

export default RailLinks;
