"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import Link from "next/link";
import { HeartIcon } from "../icons/huge/heart-icon";
import { GitHub } from "./icons/Github";
import { NumberTicker } from "./magicui/number-ticker";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	stars: number | null;
	separated?: boolean;
};

const NavbarActions: React.FC<Props> = ({ stars, separated = false }) => {
	const { ref: heartRef, triggerProps } = useIconHover();
	const isMobile = useIsMobile();

	const sponsorLink = (
		<Link
			href="/sponsors"
			prefetch={false}
			aria-label="Sponsor"
			{...triggerProps}
			className="pill-link"
		>
			<HeartIcon ref={heartRef} className="size-4.5 text-pink-500" />
			<span className="hidden md:inline">Sponsor</span>
		</Link>
	);

	const githubLink = (
		<Link
			href="https://github.com/Avijit07x/animateicons"
			target="_blank"
			aria-label="GitHub"
			className="pill-link"
		>
			<GitHub className="size-4.5" />
			{stars !== null && (
				<NumberTicker
					value={stars}
					className="text-textPrimary min-w-9 text-xs!"
				/>
			)}
		</Link>
	);

	return (
		<>
			{isMobile ? (
				sponsorLink
			) : (
				<Tooltip>
					<TooltipTrigger asChild>{sponsorLink}</TooltipTrigger>
					<TooltipContent>See supporters</TooltipContent>
				</Tooltip>
			)}

			{separated && (
				<span
					aria-hidden="true"
					className="bg-border/60 mx-1 hidden h-6 w-px lg:block"
				/>
			)}

			{isMobile ? (
				githubLink
			) : (
				<Tooltip>
					<TooltipTrigger asChild>{githubLink}</TooltipTrigger>
					<TooltipContent>View on GitHub</TooltipContent>
				</Tooltip>
			)}
		</>
	);
};

export default NavbarActions;
