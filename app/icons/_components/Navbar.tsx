"use client";
import { HeartIconHandle } from "@/icons/huge/heart-icon";
import Link from "next/link";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
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
import SearchBar from "./SearchBar";

type Props = {
	query: string;
	setQuery: React.Dispatch<SetStateAction<string>>;
};

const Navbar: React.FC<Props> = ({ query, setQuery }) => {
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
		<div className="border-border/50 bg-bgDark sticky top-0 z-50 flex h-15 w-full items-center justify-between border-b px-6 py-3">
			<SearchBar setQuery={setQuery} query={query} />
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
							<HeartIcon ref={heartRef} className="size-4.5 text-pink-500" />
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
						<span className="px-3! py-1.5! text-black!">View on Github</span>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default Navbar;
