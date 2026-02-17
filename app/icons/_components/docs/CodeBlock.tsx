import { codeToHtml } from "shiki";
import CopyButton from "./CopyButton";

type Props = {
	code: string;
	lang?: string;
	title?: string;
};

const CodeBlock = async ({ code, lang = "tsx", title }: Props) => {
	const html = await codeToHtml(code, {
		lang,
		theme: "github-dark-default",
	});

	return (
		<div className="border-border bg-surfaceElevated relative overflow-hidden rounded-lg border">
			{title && (
				<div className="border-border text-textSecondary border-b px-4 py-2 text-xs">
					{title}
				</div>
			)}

			<CopyButton code={code} />

			<div
				className="text-sm [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
};

export default CodeBlock;
