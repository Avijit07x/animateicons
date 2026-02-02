"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { HeartIcon, HeartIconHandle } from "../icons/huge/heart-icon";
import handleHover from "../utils/handleHover";
import { GitHub } from "./icons/Github";
import { NumberTicker } from "./magicui/number-ticker";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Navbar: React.FC = () => {
	const [stars, setStars] = useState<number | null>(250);
	const heartRef = useRef<HeartIconHandle>(null);

	useEffect(() => {
		async function fetchStars() {
			try {
				const res = await fetch("/api/stars");
				if (!res.ok) throw new Error("Failed to fetch stars");

				const data: { stars: number } = await res.json();
				setStars(data.stars);
			} catch (error) {
				console.error(error);
			}
		}

		fetchStars();
	}, []);

	return (
		<header className="sticky top-0 z-50">
			<nav className="bg-bgDark backdrop-blur-3xl">
				<div className="mx-auto max-w-7xl px-3 pt-1 md:px-6 lg:px-8">
					<div className="flex h-14 items-center justify-between">
						<div className="flex items-center">
							<Link href="/" className="flex items-center gap-2">
								<Image
									src={"/logo.svg"}
									alt="logo"
									width={40}
									height={40}
									loading="eager"
									className="-ml-0.5 max-md:size-10"
								/>
								<span className="text-lg font-semibold text-white max-sm:hidden">
									AnimateIcons
								</span>
							</Link>
						</div>

						<div className="hidden items-center gap-2 text-sm md:flex">
							<Link
								href="/icons/lucide"
								className="hover:text-primaryHover hover:bg-surface text-textPrimary flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors duration-200"
							>
								Icons
							</Link>

							<Separator orientation={"vertical"} className="h-4! w-1" />
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
										<HeartIcon
											ref={heartRef}
											className="size-4.5 text-pink-500"
										/>
										<span>Sponsor</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									<span className="px-3! py-1.5! text-black">
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
									<span className="px-3! py-1.5! text-black!">
										View on Github
									</span>
								</TooltipContent>
							</Tooltip>
						</div>
						<div className="flex items-center justify-center gap-2 md:hidden">
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
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
