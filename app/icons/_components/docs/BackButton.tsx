"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
	const router = useRouter();

	return (
		<Button
			variant="link"
			onClick={() => router.back()}
			className="border-border hover:bg-surfaceElevated text-textPrimary! flex h-9 w-9 items-center justify-center rounded-md border transition"
		>
			<ArrowLeft className="h-4 w-4" />
		</Button>
	);
};

export default BackButton;
