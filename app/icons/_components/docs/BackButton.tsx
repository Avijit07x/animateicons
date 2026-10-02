"use client";

import { Button } from "@/components/ui/button";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { ArrowLeft02Icon } from "@/icons/huge/arrow-left-0-2-icon";
import { useRouter } from "next/navigation";

const BackButton = () => {
	const router = useRouter();
	const { ref, triggerProps } = useIconHover();

	return (
		<Button
			type="button"
			variant="secondary"
			size="icon"
			aria-label="Go back"
			onClick={() => router.back()}
			{...triggerProps}
		>
			<ArrowLeft02Icon ref={ref} />
		</Button>
	);
};

export default BackButton;
