"use client";

import { MAX_SEARCH_LENGTH } from "@/app/icons/_contexts/IconSearchContext";
import { Kbd } from "@/components/ui/kbd";
import { SearchIcon, type SearchIconHandle } from "@/icons/huge/search-icon";
import { ICON_CATALOG, POPULAR_ICONS, searchIcons } from "@/lib/icon-search";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CommandSearchItem, { type CommandSearchIcon } from "./CommandSearchItem";

const MAX_RESULTS = 40;

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const CommandSearch: React.FC<Props> = ({ isOpen, onClose }) => {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const searchIconRef = useRef<SearchIconHandle | null>(null);
	const router = useRouter();

	const searching = query.trim().length >= 2;
	const results = useMemo<readonly CommandSearchIcon[]>(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return POPULAR_ICONS;
		return searchIcons(q, MAX_RESULTS);
	}, [query]);

	const [prevQuery, setPrevQuery] = useState(query);
	if (query !== prevQuery) {
		setPrevQuery(query);
		setSelected(0);
	}

	const [prevOpen, setPrevOpen] = useState(isOpen);
	if (isOpen !== prevOpen) {
		setPrevOpen(isOpen);
		if (isOpen) {
			setQuery("");
			setSelected(0);
		}
	}

	useEffect(() => {
		if (!isOpen) return;
		const id = requestAnimationFrame(() => {
			inputRef.current?.focus();
			searchIconRef.current?.startAnimation();
		});
		return () => cancelAnimationFrame(id);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [isOpen]);

	const navigateTo = (icon: CommandSearchIcon) => {
		router.push(`/icons/${icon.library}/${icon.name}`);
		onClose();
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			e.preventDefault();
			onClose();
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelected((s) => Math.min(s + 1, results.length - 1));
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelected((s) => Math.max(s - 1, 0));
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			const target = results[selected];
			if (target) navigateTo(target);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="cmdk-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					onClick={onClose}
					onKeyDown={onKeyDown}
					role="dialog"
					aria-modal="true"
					aria-label="Search icons"
					className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[15vh] backdrop-blur-md"
				>
					<motion.div
						key="cmdk-panel"
						initial={{ opacity: 0, scale: 0.96, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: -8 }}
						transition={{ type: "spring", stiffness: 480, damping: 36 }}
						onClick={(e) => e.stopPropagation()}
						className="bg-surface relative w-full max-w-lg overflow-hidden rounded-[18px] p-2.5 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]"
					>
						<div className="bg-surfaceElevated flex h-11 items-center gap-2.5 rounded-full pr-2.5 pl-4">
							<SearchIcon
								ref={searchIconRef}
								size={18}
								color="var(--color-primary)"
							/>
							<input
								ref={inputRef}
								type="text"
								maxLength={MAX_SEARCH_LENGTH}
								value={query}
								onChange={(e) =>
									setQuery(e.target.value.slice(0, MAX_SEARCH_LENGTH))
								}
								placeholder="Search icons by name or keyword…"
								className="text-textPrimary placeholder:text-textMuted caret-primary min-w-0 flex-1 bg-transparent text-sm outline-none"
								autoComplete="off"
								spellCheck={false}
							/>
							<Kbd className="hidden h-5 rounded-full bg-white/10 px-2 text-[0.65rem] sm:inline-flex">
								Esc
							</Kbd>
						</div>

						{results.length > 0 && (
							<p className="text-textMuted px-3.5 pt-3 text-[11px] font-medium">
								{searching ? "Results" : "Popular"}
							</p>
						)}

						<div
							role="listbox"
							aria-label="Icon results"
							className="max-h-[40vh] [scrollbar-width:none] space-y-0.5 overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_6px,black_calc(100%-16px),transparent)] pt-1.5 pb-4 [&::-webkit-scrollbar]:hidden"
						>
							{results.length === 0 ? (
								<div className="text-textSecondary px-3 py-10 text-center text-sm">
									No icons match{" "}
									<span className="text-textPrimary font-medium">
										&ldquo;{query}&rdquo;
									</span>
								</div>
							) : (
								results.map((icon, i) => (
									<CommandSearchItem
										key={`${icon.library}-${icon.name}`}
										item={icon}
										isSelected={i === selected}
										onSelect={() => navigateTo(icon)}
										onHover={() => setSelected(i)}
									/>
								))
							)}
						</div>

						<div className="text-textMuted mt-2 flex items-center justify-between gap-3 px-2.5 pb-0.5 text-[11px]">
							<div className="flex items-center gap-4">
								<span className="inline-flex items-center gap-2">
									<Kbd className="h-5 rounded-full bg-white/10 px-2 text-[0.65rem]">
										↑↓
									</Kbd>
									navigate
								</span>
								<span className="inline-flex items-center gap-2">
									<Kbd className="h-5 rounded-full bg-white/10 px-2 text-[0.65rem]">
										↵
									</Kbd>
									open
								</span>
							</div>
							<span>
								{searching
									? `${results.length} of ${ICON_CATALOG.length}`
									: `${ICON_CATALOG.length} icons`}
							</span>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CommandSearch;
