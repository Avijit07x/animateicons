"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useRef } from "react";
import { HeartIcon, HeartIconHandle } from "../icons/huge/heart-icon";
import handleHover from "../utils/handleHover";
import { GitHub } from "./icons/Github";
import { NumberTicker } from "./magicui/number-ticker";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	stars: number | null;
	separated?: boolean;
};

const NavbarActions: React.FC<Props> = ({ stars, separated = false }) => {
	const heartRef = useRef<HeartIconHandle>(null);
	const isMobile = useIsMobile();

	const sponsorLink = (
		<Link
			href="/sponsors"
			prefetch={false}
			onMouseEnter={(e) => handleHover(e, heartRef)}
			onMouseLeave={(e) => handleHover(e, heartRef)}
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
