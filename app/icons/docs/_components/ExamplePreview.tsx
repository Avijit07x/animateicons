import type { ReactNode } from "react";
import CodeBlock from "../../_components/docs/CodeBlock";

const ExamplePreview = async ({
	children,
	code,
	lang = "tsx",
}: {
	children: ReactNode;
	code: string;
	lang?: string;
}) => (
	<div className="mt-6">
		<div className="bg-surface relative flex min-h-44 items-center justify-center overflow-hidden rounded-3xl p-8">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0 [--plus-mask:radial-gradient(circle_at_50%_50%,#000_5%,transparent_70%)]"
			/>
			<div className="relative flex w-full justify-center">{children}</div>
		</div>
		<CodeBlock code={code} lang={lang} title="Example.tsx" />
	</div>
);

export default ExamplePreview;
