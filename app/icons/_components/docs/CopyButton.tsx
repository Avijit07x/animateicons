"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Props = {
	code: string;
};

const CopyButton: React.FC<Props> = ({ code }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Button
			size="icon"
			variant="link"
			className="text-textPrimary! absolute top-2 right-2 size-5"
			onClick={handleCopy}
		>
			{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
		</Button>
	);
};

export default CopyButton;
