"use client";

import {
	ChevronLeftIcon,
	ChevronLeftIconHandle,
} from "@/Icons/lucide/ChevronLeftIcon";

import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const page: React.FC = () => {
	const router = useRouter();
	const backRef = useRef<ChevronLeftIconHandle>(null);

	const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(e.type);
		if (e.type === "mouseenter") {
			backRef.current?.startAnimation();
		}
		if (e.type === "mouseleave") {
			backRef.current?.stopAnimation();
		}
	};

	return (
		<div className="mx-auto max-w-5xl px-6 py-16 text-[var(--color-textPrimary)]">
			<div className="mb-8 flex items-center">
				<button
					onClick={() => router.back()}
					onMouseEnter={handleHover}
					onMouseLeave={handleHover}
					className="flex items-center justify-center gap-1 text-sm hover:text-[var(--color-textPrimary)]"
				>
					<ChevronLeftIcon ref={backRef} className="size-4" /> <span>Back</span>
				</button>
			</div>

			<h1 className="text-3xl font-semibold">AnimateIcons</h1>

			<p className="mt-4 max-w-2xl text-[var(--color-textSecondary)]">
				Animated SVG icon library for React and Next.js. Icons are installed
				locally using the shadcn CLI.
			</p>

			<section id="install" className="mt-14 space-y-4">
				<h2 className="text-xl font-medium text-[var(--color-textPrimary)]">
					Install an Icon
				</h2>

				<div className="overflow-x-auto rounded-md border border-[var(--color-border)] bg-[#161616] p-4 text-sm text-[var(--color-textSecondary)]">
					<code>
						pnpm dlx shadcn@latest add https://animateicons.in/icons/eye.json
					</code>
				</div>
			</section>

			<section id="usage" className="mt-14 space-y-4">
				<h2 className="text-xl font-medium text-[var(--color-textPrimary)]">
					Basic Usage
				</h2>

				<div className="overflow-x-auto rounded-md border border-[var(--color-border)] bg-[#161616] p-4 text-sm text-[var(--color-textSecondary)]">
					<pre>{`import { EyeIcon } from "@/components/eye"

export default function Example() {
  return <EyeIcon size={24} />
}`}</pre>
				</div>
			</section>

			<section id="props" className="mt-14 space-y-6">
				<h2 className="text-xl font-medium text-[var(--color-textPrimary)]">
					Props
				</h2>

				<div className="rounded-md border border-[var(--color-border)] bg-[#161616] p-4 text-sm leading-6 text-[var(--color-textSecondary)]">
					<pre>{`size?: number
className?: string

duration?: number
isAnimated?: boolean

onMouseEnter?: () => void
onMouseLeave?: () => void`}</pre>
				</div>

				<p className="max-w-2xl text-[var(--color-textMuted)]">
					All props are optional. Icons behave like normal React components with
					animation as an opt-in feature.
				</p>
			</section>

			<section id="api" className="mt-14 space-y-4">
				<h2 className="text-xl font-medium text-[var(--color-textPrimary)]">
					Imperative API
				</h2>

				<div className="overflow-x-auto rounded-md border border-[var(--color-border)] bg-[#161616] p-4 text-sm text-[var(--color-textSecondary)]">
					<pre>{`"use client"

import { useRef } from "react"
import { EyeIcon, type EyeIconHandle } from "@/components/eye"

export default function Demo() {
  const ref = useRef<EyeIconHandle>(null)

  return (
    <>
      <EyeIcon ref={ref} />
      <button onClick={() => ref.current?.startAnimation()}>
        Animate
      </button>
    </>
  )
}`}</pre>
				</div>
			</section>
		</div>
	);
};

export default page;
