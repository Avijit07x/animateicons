"use client";

import { ICON_COUNT } from "@/icons/lucide";
import { Command } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import IconList from "./IconList";

const isMac =
	typeof navigator !== "undefined" &&
	/Mac|iPhone|iPad|iPod/i.test(navigator.platform);

const IconSection = () => {
	const [query, setQuery] = useState("");
	const [debouncedQuery] = useDebounce(query, 200);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "f") {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="relative min-h-80 w-full">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="relative mt-5 w-full"
			>
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={`Search ${ICON_COUNT} icons...`}
					className="bg-primary/10 border-primary/20 focus:ring-primary/50 w-full rounded-md border px-4 py-2 text-sm text-white shadow-lg placeholder:text-zinc-300 focus:ring-1 focus:outline-none"
				/>

				<div className="absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-1 rounded-sm text-xs font-bold text-zinc-300 lg:flex">
					<span className="rounded bg-black/25 px-1.5 py-0.5">
						{isMac ? <Command className="size-4 py-0.5" /> : "CTRL"}
					</span>
					<span className="opacity-70">+</span>
					<span className="rounded bg-black/25 px-1.5 py-0.5">F</span>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 1.5,
					delay: 2,
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="bg-accent/5 pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
			/>

			<IconList query={debouncedQuery} />
		</div>
	);
};

export default IconSection;
