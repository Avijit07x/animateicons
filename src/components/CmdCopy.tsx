"use client";

import { CopyIcon, CopyIconHandle } from "@/icons/lucide/CopyIcon";
import React from "react";
import { CheckIcon } from "./icons/CheckIcon";
import { Button } from "./ui/button";

type Props = {
	copyToClipboard: () => void;
	copied: boolean;
};

const CmdCopy: React.FC<Props> = ({ copyToClipboard, copied }) => {
	const copyRef = React.useRef<CopyIconHandle>(null);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="hover:bg-primary/10 p-0.5 hover:text-white"
				onClick={copyToClipboard}
				aria-label={copied ? "Copied" : "Copy"}
				onMouseEnter={() => copyRef.current?.startAnimation()}
				onMouseLeave={() => copyRef.current?.stopAnimation()}
			>
				{copied ? <CheckIcon /> : <CopyIcon ref={copyRef} />}
			</Button>
		</>
	);
};

export default CmdCopy;
