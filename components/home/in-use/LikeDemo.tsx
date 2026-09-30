"use client";

import IconButton from "@/components/IconButton";
import { HeartIcon } from "@/icons/huge/heart-icon";
import { useState } from "react";

const LikeDemo: React.FC = () => {
	const [liked, setLiked] = useState(false);

	return (
		<IconButton
			icon={HeartIcon}
			iconSize={20}
			iconColor={liked ? "var(--color-primary)" : undefined}
			variant="secondary"
			size="pill"
			aria-pressed={liked}
			onClick={() => setLiked((v) => !v)}
		>
			{liked ? 129 : 128}
		</IconButton>
	);
};

export default LikeDemo;
