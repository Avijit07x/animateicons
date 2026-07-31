import type { ReactNode } from "react";
import CodeBlock from "../../_components/docs/CodeBlock";

/**
 * Examples-page wrapper: a live preview pane (the rendered demo, centered)
 * followed by its source via CodeBlock.
 */
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
		<div className="border-border bg-bgDark flex min-h-44 items-center justify-center rounded-xl border p-8">
			{children}
		</div>
		<CodeBlock code={code} lang={lang} title="Example.tsx" />
	</div>
);

export default ExamplePreview;
