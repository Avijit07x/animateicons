export type IconLibrary = "lucide" | "huge";

export const getCurrentIconLibrary = (pathname: string): IconLibrary | null => {
	if (pathname.startsWith("/icons/lucide")) return "lucide";
	if (pathname.startsWith("/icons/huge")) return "huge";
	return null;
};
