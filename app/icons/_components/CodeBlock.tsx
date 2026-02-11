"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

type CodeBlockProps = {
	code: string;
	lang?: string;
	title?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, lang = "tsx", title }) => {
	const [html, setHtml] = useState("");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const highlight = async () => {
			const result = await codeToHtml(code, {
				lang,
				theme: "github-dark-default",
			});
			setHtml(result);
		};
		highlight();
	}, [code, lang]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="border-border bg-surfaceElevated relative overflow-hidden rounded-lg border">
			{title && (
				<div className="border-border text-textSecondary flex items-center justify-between border-b px-4 py-2 text-xs">
					<span>{title}</span>
				</div>
			)}

			<Button
				size="icon"
				variant="link"
				className="text-textPrimary! absolute top-2 right-2 size-5"
				onClick={handleCopy}
			>
				{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
			</Button>

			<div
				className="text-sm [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-4"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
};

export default CodeBlock;
