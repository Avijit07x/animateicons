const Page: React.FC = () => {
	return (
		<div className="text-textPrimary mx-auto w-full max-w-5xl py-12">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold">Installation</h1>
			</div>

			<div className="mt-12 space-y-16">
				<section id="install" className="space-y-4">
					<p className="text-textSecondary max-w-2xl text-sm">
						Install icons directly into your project using the shadcn CLI.
					</p>

					<div className="bg-surfaceElevated border-border relative overflow-x-auto rounded-lg border">
						<pre className="text-textSecondary p-4 text-sm">
							<code>
								pnpm dlx shadcn@latest add{" "}
								https://animateicons.in/icons/eye.json
							</code>
						</pre>
					</div>
				</section>

				<section id="usage" className="space-y-4">
					<h2 className="text-xl font-medium">Usage</h2>
					<p className="text-textSecondary max-w-2xl text-sm">
						Import the icon component and use it like any other React component.
					</p>

					<div className="bg-surfaceElevated border-border relative overflow-x-auto rounded-lg border">
						<pre className="text-textSecondary p-4 text-sm">
							<code>{`import { EyeIcon } from "@/components/eye"

export default function Example() {
	return <EyeIcon size={24} />
}`}</code>
						</pre>
					</div>
				</section>

				<section id="props" className="space-y-4">
					<h2 className="text-xl font-medium">Props</h2>
					<p className="text-textSecondary max-w-2xl text-sm">
						All props are optional. Icons behave like standard React components.
					</p>

					<div className="bg-surfaceElevated border-border relative overflow-x-auto rounded-lg border">
						<pre className="text-textSecondary p-4 text-sm leading-6">
							<code>{`size?: number
className?: string

duration?: number
isAnimated?: boolean

onMouseEnter?: () => void
onMouseLeave?: () => void`}</code>
						</pre>
					</div>
				</section>

				<section id="api" className="space-y-4">
					<h2 className="text-xl font-medium">Imperative API</h2>
					<p className="text-textSecondary max-w-2xl text-sm">
						Control animations imperatively using refs.
					</p>

					<div className="bg-surfaceElevated border-border relative overflow-x-auto rounded-lg border">
						<pre className="text-textSecondary p-4 text-sm">
							<code>{`"use client"

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
}`}</code>
						</pre>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Page;
