"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useRef } from "react";
import { HeartIcon, HeartIconHandle } from "../icons/huge/heart-icon";
import handleHover from "../utils/handleHover";
import { GitHub } from "./icons/Github";
import { NumberTicker } from "./magicui/number-ticker";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	/** Star count fetched server-side. `null` means fetch failed or no
	 *  data yet — the count badge simply won't render. */
	stars: number | null;
};

const NavbarActions: React.FC<Props> = ({ stars }) => {
	const heartRef = useRef<HeartIconHandle>(null);
	const isMobile = useIsMobile();

	const sponsorLink = (
		<Link
			href="/sponsors"
			onMouseEnter={(e) => handleHover(e, heartRef)}
			onMouseLeave={(e) => handleHover(e, heartRef)}
			className="hover:bg-surface text-textPrimary flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
		>
			<HeartIcon ref={heartRef} className="size-4.5 text-pink-500" />
			<span className="hidden md:inline">Sponsor</span>
		</Link>
	);

	const githubLink = (
		<Link
			href="https://github.com/Avijit07x/animateicons"
			target="_blank"
			className="hover:bg-surface flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
		>
			<GitHub className="size-4.5" />
			{stars !== null && (
				<NumberTicker
					value={stars}
					className="text-textPrimary min-w-7 text-xs!"
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

			<Separator orientation="vertical" className="h-4! w-1" />

			{isMobile ? (
				githubLink
			) : (
				<Tooltip>
					<TooltipTrigger asChild>{githubLink}</TooltipTrigger>
					<TooltipContent className="text-primary! px-3! py-1.5! font-medium">
						View on GitHub
					</TooltipContent>
				</Tooltip>
			)}
		</>
	);
};

export default NavbarActions;
