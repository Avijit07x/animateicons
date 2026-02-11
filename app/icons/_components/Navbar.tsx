"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGithubStars } from "@/contexts/GithubStarContext";
import { HeartIconHandle } from "@/icons/huge/heart-icon";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { GitHub } from "../../../components/icons/Github";
import { NumberTicker } from "../../../components/magicui/number-ticker";
import { Separator } from "../../../components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../../../components/ui/tooltip";
import { HeartIcon } from "../../../icons/huge/heart-icon";
import handleHover from "../../../utils/handleHover";
import PackageManagerToggle from "./PackageManagerToggle";
import SearchBar from "./SearchBar";

type Props = {};

const Navbar: React.FC<Props> = () => {
	const heartRef = useRef<HeartIconHandle>(null);
	const { stars } = useGithubStars();

	return (
		<div className="border-border/50 bg-bgDark sticky top-0 z-50 h-15 w-full border-b px-4 py-3 lg:px-6">
			<div className="mx-auto flex max-w-384 items-center justify-between">
				<div className="flex items-center justify-center gap-2 md:hidden">
					<SidebarTrigger className="bg-bgDark text-white hover:bg-transparent hover:text-white" />
					<Link href="/" className="flex items-center gap-2">
						<Image
							src={"/logo.svg"}
							alt="logo"
							width={40}
							height={40}
							loading="eager"
							className="-ml-0.5 max-md:size-9"
						/>
					</Link>
				</div>
				<div className="flex items-center justify-center gap-2 lg:hidden">
					<Link
						href="https://github.com/sponsors/Avijit07x"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:bg-surface text-textPrimary flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
					>
						<HeartIcon className="size-4.5 text-pink-500" />
					</Link>
					<Separator orientation={"vertical"} className="h-4! w-1" />
					<Link
						href="https://github.com/Avijit07x/animateicons"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:bg-surface flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
					>
						<GitHub className="size-4.5" />
						{stars !== null && (
							<NumberTicker
								value={stars}
								className="text-textPrimary min-w-7 text-xs!"
							/>
						)}
					</Link>
				</div>
				<div className="hidden items-center justify-center gap-4 lg:flex">
					<SearchBar />

					<PackageManagerToggle />
				</div>
				<div className="hidden items-center gap-2 text-sm lg:flex">
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="https://github.com/sponsors/Avijit07x"
								target="_blank"
								rel="noopener noreferrer"
								onMouseEnter={(e) => handleHover(e, heartRef)}
								onMouseLeave={(e) => handleHover(e, heartRef)}
								className="hover:bg-surface text-textPrimary flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
							>
								<HeartIcon ref={heartRef} className="size-4.5 text-pink-500" />
								<span>Sponsor</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							<span className="px-3! py-1.5! font-medium text-black!">
								Sponsor this project
							</span>
						</TooltipContent>
					</Tooltip>
					<Separator orientation={"vertical"} className="h-4! w-1" />
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="https://github.com/Avijit07x/animateicons"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:bg-surface flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium"
							>
								<GitHub className="size-4.5" />

								{stars !== null && (
									<NumberTicker
										value={stars}
										className="text-textPrimary min-w-7 text-xs!"
									/>
								)}
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							<span className="px-3! py-1.5! font-medium text-black!">
								View on Github
							</span>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
