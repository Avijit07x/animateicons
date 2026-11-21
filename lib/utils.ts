import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Without "ui", text-ui is read as a colour and removes the text-* colour next to it.
const twMerge = extendTailwindMerge({
	extend: { classGroups: { "font-size": [{ text: ["ui"] }] } },
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
