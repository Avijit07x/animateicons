"use client";

import { GithubIcon, GithubIconHandle } from "@/Icons/GithubIcon";
import { isWinterSeason } from "@/utils/isWinterSeason";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Heart from "./icons/Heart";
import { StarIcon, StarIconHandle } from "./icons/StarIcon";
import { NumberTicker } from "./magicui/number-ticker";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [stars, setStars] = useState<number | null>(250);
	const starRef = useRef<StarIconHandle>(null);
	const githubRef = useRef<GithubIconHandle>(null);
	const toggleMenu = () => setIsOpen(!isOpen);
	const isWinter = isWinterSeason();

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

	const handleMouseEnter = () => {
		starRef.current?.startAnimation();
		githubRef.current?.startAnimation();
	};

	const handleMouseLeave = () => {
		starRef.current?.stopAnimation();
		githubRef.current?.stopAnimation();
	};

	return (
		<nav className="relative z-50 transition-all duration-300">
			<div className="mx-auto max-w-7xl px-3 pt-2 md:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src={isWinter ? "/winter-logo.svg" : "/logo.svg"}
								alt="logo"
								width={45}
								height={45}
								loading="eager"
								className="-ml-0.5 max-md:size-10"
							/>
							<span className="text-lg font-semibold text-white">
								AnimateIcons
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden items-center space-x-4 text-sm md:flex">
						<Link
							href="https://github.com/Avijit07x/animateicons/blob/main/README.md"
							target="_blank"
							className="text-zinc-300 transition-colors duration-200 hover:text-blue-600"
						>
							Docs
						</Link>

						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="https://github.com/Avijit07x/animateicons"
									target="_blank"
									rel="noopener noreferrer"
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
									className="group hover:bg-primary/10 flex h-8 items-center justify-center space-x-2 rounded-sm border border-gray-700 px-5 py-[0.438rem] text-sm font-medium text-white transition-colors duration-200"
								>
									<GithubIcon ref={githubRef} size={16} />
									<span className="text-xs">Star</span>
									<StarIcon ref={starRef} size={13} />
									{stars !== null && (
										<NumberTicker
											value={stars}
											className="min-w-5 !text-xs text-white"
										/>
									)}
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<span className="px-3! py-1.5! font-medium! text-blue-600!">
									View on Github
								</span>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="https://github.com/sponsors/Avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:bg-primary/10 flex h-8 items-center justify-center gap-2 rounded-sm border border-gray-700 px-4 font-medium! text-white transition-colors duration-200"
								>
									<Heart className="size-4 text-pink-400" />
									<span className="text-xs">Sponsor</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="">
								<span className="px-3! py-1.5! font-medium! text-blue-600!">
									Support this project
								</span>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							aria-label="Open menu"
							className="text-zinc-300 transition-colors duration-200 hover:text-indigo-400"
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div
					className={`overflow-hidden transition-all duration-300 md:hidden ${
						isOpen ? "mt-2 max-h-80 opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className="bg-primary/10 border-primary/20 flex w-full flex-col items-center justify-center gap-4 rounded-lg border px-6 py-10 shadow-lg backdrop-blur-md">
						{/* Docs */}
						<Link
							href="https://github.com/Avijit07x/animateicons/blob/main/README.md"
							target="_blank"
							className="w-full px-3 py-2 text-center font-medium text-zinc-300 transition-colors duration-200 hover:text-indigo-400"
						>
							Docs
						</Link>

						{/* GitHub Star */}
						<Link
							href="https://github.com/Avijit07x/animateicons"
							target="_blank"
							rel="noopener noreferrer"
							className="group hover:bg-primary/10 flex h-9 w-full items-center justify-center space-x-2 rounded-sm border border-gray-700 px-5 py-[0.5rem] text-sm font-semibold text-zinc-300 transition-colors duration-200 hover:text-white"
						>
							<GithubIcon size={16} />
							<span className="text-xs group-hover:text-white">Star</span>
							<StarIcon size={14} />
							{stars !== null && (
								<NumberTicker
									value={stars}
									className="min-w-5 !text-xs text-zinc-300 group-hover:!text-white"
								/>
							)}
						</Link>
						<Link
							href="https://github.com/sponsors/Avijit07x"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:bg-primary/10 flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-gray-700 px-5 text-sm text-zinc-300 transition-colors duration-200 hover:text-white"
						>
							<Heart className="size-5 text-pink-400" />
							<span className="text-sm font-semibold">Sponsor</span>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
