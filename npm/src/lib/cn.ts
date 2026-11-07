type ClassValue = string | undefined | null | false | 0;

export const cn = (...inputs: ClassValue[]): string =>
	inputs.filter(Boolean).join(" ");
