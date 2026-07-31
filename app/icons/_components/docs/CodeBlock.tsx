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
		<div className="group/code bg-surface relative my-6 overflow-hidden rounded-xl shadow-lg ring-1 shadow-black/20 ring-white/10">
			{title ? (
				<div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] py-2 pr-2 pl-4">
					<span className="text-textSecondary font-mono text-xs">{title}</span>
					<div className="flex items-center gap-1">
						<span className="text-textMuted rounded bg-white/6 px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide uppercase">
							{lang}
						</span>
						<CopyButton code={code} />
					</div>
				</div>
			) : (
				<CopyButton
					code={code}
					className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover/code:opacity-100"
				/>
			)}

			<div
				className="text-[0.8125rem] max-sm:overflow-x-auto [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:leading-[1.7]"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
};

export default CodeBlock;
