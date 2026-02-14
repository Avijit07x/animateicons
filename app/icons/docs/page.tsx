"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CodeBlock from "../_components/CodeBlock";

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

const Page: React.FC = () => {
	const router = useRouter();
	return (
		<div className="min-w-0 flex-1">
			<div className="text-textPrimary mx-auto w-full max-w-5xl px-6 py-12">
				<div className="mb-10 flex items-center gap-3">
					<Button
						variant={"link"}
						onClick={() => {
							router.back();
						}}
						className="border-border hover:bg-surfaceElevated text-textPrimary! flex h-9 w-9 items-center justify-center rounded-md border transition"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>

					<h1 className="text-2xl font-semibold">Installation</h1>
				</div>

				<div className="space-y-16">
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
						<h2 className="text-xl font-medium">Usage</h2>
						<p className="text-textSecondary max-w-2xl text-sm">
							Import and use the icon like any React component.
						</p>

						<CodeBlock code={usageCode} />
					</section>

					<section className="space-y-4">
						<h2 className="text-xl font-medium">Props</h2>
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
