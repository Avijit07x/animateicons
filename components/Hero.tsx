"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { CheckIcon, type CheckIconHandle } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { useCopy } from "@/hooks/useCopy";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { cn } from "@/lib/utils";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { motion, Variants } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import FloatingIcons from "./FloatingIcons";
import { PackageManagerLogo, ShadcnLogo } from "./icons/PackageLogos";
import IconLink from "./IconLink";
import { SHOWCASE } from "./home/showcase-icons";

const container: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.05 },
	},
};

const item: Variants = {
	hidden: { opacity: 0, y: 18 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
	},
};

const INSTALL = {
	npm: "npm install @animateicons/react",
	shadcn: "npx shadcn@latest add @animateicons/lu-x",
} as const;

type Method = keyof typeof INSTALL;

const METHODS: { value: Method; logo: React.ReactNode }[] = [
	{ value: "npm", logo: <PackageManagerLogo pm="npm" /> },
	{ value: "shadcn", logo: <ShadcnLogo /> },
];

const HeroSection: React.FC = () => {
	const [method, setMethod] = useState<Method>("npm");
	const { copied, copy } = useCopy();
	const { ref: copyRef, triggerProps } = useIconHover();
	const checkRef = useRef<CheckIconHandle | null>(null);

	useEffect(() => {
		if (!copied) return;
		const id = requestAnimationFrame(() => checkRef.current?.startAnimation());
		return () => cancelAnimationFrame(id);
	}, [copied]);

	return (
		<section className="relative flex min-h-[min(calc(100dvh-4rem),72rem)] flex-col justify-center overflow-hidden pb-12 lg:pb-16">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-480 -translate-x-1/2"
			/>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 pt-12 text-center lg:pt-8"
			>
				<motion.h1
					variants={item}
					className="text-[clamp(2.25rem,9.3vw,2.75rem)] leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
				>
					<span className="text-textPrimary">
						Make Every <br className="hidden max-sm:block" />
						Icon{" "}
					</span>
					<span className="text-primary">Move</span>
					<br />
					<span className="text-textPrimary font-medium">
						with AnimateIcons
					</span>
				</motion.h1>

				<motion.p
					variants={item}
					className="text-textSecondary max-w-2xl text-sm leading-relaxed text-balance max-sm:text-[15px] sm:text-base"
				>
					{ICON_COUNTS.total} open-source animated SVG icons for React, in
					Lucide and Huge styles. Drop-in components that animate on hover,
					focus, or your own code.
				</motion.p>

				<motion.div
					variants={item}
					className="mt-3 grid max-w-full pt-[22px] select-none max-sm:w-full max-sm:max-w-74"
				>
					{METHODS.map(({ value, logo }) => {
						const front = method === value;
						return (
							<motion.div
								key={value}
								animate={{ y: front ? 0 : -26, scale: front ? 1 : 0.9 }}
								whileHover={front ? undefined : { y: -31 }}
								transition={{ type: "spring", stiffness: 420, damping: 34 }}
								style={{ originX: 0.5, originY: 1 }}
								className={cn(
									"relative col-start-1 row-start-1 min-w-0 rounded-full transition-colors duration-200",
									front ? "bg-surfaceElevated z-10" : "bg-surfaceHover z-0",
								)}
							>
								{front ? (
									<Button
										variant="secondary"
										size="pill"
										onClick={() => copy(INSTALL[value])}
										{...triggerProps}
										aria-label="Copy install command"
										className="group w-full cursor-pointer justify-between gap-4 pr-4 font-normal active:scale-[0.98]"
									>
										<span className="flex min-w-0 items-center gap-3">
											<span className="text-primary [&_svg]:size-3! [&_svg]:shrink-0">
												{logo}
											</span>
											<code className="text-textPrimary min-w-0 truncate text-left font-mono text-sm">
												<span className="text-textMuted select-none">$ </span>
												{INSTALL[value]}
											</code>
										</span>
										<span className="text-textMuted group-hover:text-primary flex items-center transition-colors">
											{copied ? (
												<CheckIcon
													ref={checkRef}
													size={16}
													color="var(--color-success)"
												/>
											) : (
												<CopyIcon ref={copyRef} size={16} />
											)}
										</span>
									</Button>
								) : (
									<>
										<div
											aria-hidden="true"
											className="invisible flex h-10 items-center justify-between gap-4 overflow-hidden pr-4 pl-5"
										>
											<span className="flex items-center gap-3 font-mono text-sm whitespace-nowrap">
												<span className="size-3" />
												{`$ ${INSTALL[value]}`}
											</span>
											<span className="size-4" />
										</div>
										<Button
											variant="ghost"
											size="xs"
											onClick={() => setMethod(value)}
											aria-label={`Show ${value} install command`}
											className="text-textMuted hover:text-primary absolute inset-x-0 top-0 h-[22px] cursor-pointer gap-1.5 rounded-b-none font-mono text-[13px] font-normal hover:bg-transparent dark:hover:bg-transparent [&_svg:not([class*='size-'])]:size-[11px]"
										>
											{logo}
											{value}
										</Button>
									</>
								)}
							</motion.div>
						);
					})}
				</motion.div>

				<motion.div
					variants={item}
					className="flex flex-wrap items-center justify-center gap-3 max-sm:w-full max-sm:max-w-74 max-sm:flex-col"
				>
					<IconLink
						href="/icons/lucide"
						prefetch={false}
						icon={ArrowRight02Icon}
						variant="default"
						size="pill"
						className="max-sm:w-full"
					>
						Browse {ICON_COUNTS.total} icons
					</IconLink>
					<IconLink
						href="/icons/docs"
						icon={ArrowUpRight01Icon}
						variant="secondary"
						size="pill"
						className="max-sm:w-full"
					>
						Documentation
					</IconLink>
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, duration: 0.8 }}
				className="relative z-10 mx-auto mt-11 min-h-[300px] w-full max-w-480 flex-1 max-sm:h-60 max-sm:min-h-0 max-sm:flex-none"
			>
				<FloatingIcons
					items={SHOWCASE}
					cols={10}
					rows={3}
					thinOnPhone
					className="[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
				/>
			</motion.div>
		</section>
	);
};

export default HeroSection;
