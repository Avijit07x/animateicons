import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "../_components/docs/BackButton";
import CodeBlock from "../_components/docs/CodeBlock";
import OpenInAI from "../_components/docs/OpenInAI";

const installCode = `pnpm dlx shadcn@latest add https://animateicons.in/r/lu-eye.json`;

const usageCode = `import { EyeIcon } from "@/components/ui/eye"

export default function Example() {
	return <EyeIcon size={24} />
}`;

const propsCode = `size?: number
className?: string

duration?: number
isAnimated?: boolean

onMouseEnter?: () => void
onMouseLeave?: () => void`;

const apiCode = `"use client"

import { useRef } from "react"
import { EyeIcon, type EyeIconHandle } from "@/components/ui/eye"

export default function Demo() {
	const ref = useRef<EyeIconHandle>(null)

	return (
		<div className="flex items-center gap-6">
			<button
				onMouseEnter={() => ref.current?.startAnimation()}
				onMouseLeave={() => ref.current?.stopAnimation()}
				className="cursor-pointer"
			>
				<EyeIcon ref={ref} size={28} duration={1} />
			</button>	
		</div>
	)
}`;

export const metadata: Metadata = {
	title: "Install AnimateIcons",
	description:
		"Learn how to install AnimateIcons using the shadcn CLI and add free animated SVG icons to your React or Next.js project.",
	alternates: {
		canonical: "/icons/docs",
	},
};

const Page: React.FC = () => {
	return (
		<div className="min-w-0 flex-1">
			<div className="text-textPrimary mx-auto w-full max-w-5xl px-6 py-12">
				<div className="mb-10 flex w-full flex-wrap items-center justify-between gap-5">
					<div className="flex items-center gap-3">
						<BackButton />

						<h1 className="text-2xl font-semibold">Install AnimateIcons</h1>
					</div>
					<OpenInAI
						pageUrl="https://animateicons.in/icons/docs"
						title="AnimateIcons Documentation"
					/>
				</div>

				<p className="text-textSecondary mt-2 max-w-2xl text-sm">
					Learn how to install AnimateIcons using the shadcn CLI and start using
					animated SVG icons in your React or Next.js project.
				</p>

				<div className="mt-5 space-y-16">
					<section className="space-y-4">
						<h2 className="text-xl font-medium">1. Setup shadcn/ui</h2>
						<p className="text-textSecondary max-w-2xl text-sm">
							These icons use the shadcn CLI. If you have not installed shadcn
							yet, follow the official guide first.
						</p>

						<Link
							href="https://ui.shadcn.com/docs/installation"
							target="_blank"
							className="text-sm font-medium underline underline-offset-4"
						>
							Open shadcn installation guide
						</Link>
					</section>

					<section className="space-y-4">
						<h2 className="text-xl font-medium">2. Install Icon</h2>
						<p className="text-textSecondary max-w-2xl text-sm">
							Install the icon directly into your project.
						</p>

						<CodeBlock code={installCode} lang="bash" />
					</section>

					<section className="space-y-4">
						<h2 className="text-xl font-medium">Basic Usage</h2>
						<p className="text-textSecondary max-w-2xl text-sm">
							Import and use the icon like any React component.
						</p>

						<CodeBlock code={usageCode} />
					</section>

					<section className="space-y-4">
						<h2 className="text-xl font-medium">Icon Props</h2>
						<p className="text-textSecondary max-w-2xl text-sm">
							All props are optional.
						</p>

						<CodeBlock code={propsCode} lang="ts" />
					</section>

					<section className="space-y-4">
						<h2 className="text-xl font-medium">Imperative API</h2>
						<p className="text-textSecondary max-w-2xl text-sm">
							Control animations programmatically using refs.
						</p>

						<CodeBlock code={apiCode} />
					</section>
				</div>
			</div>
		</div>
	);
};

export default Page;
