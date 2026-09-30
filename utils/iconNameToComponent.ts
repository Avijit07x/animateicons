export const iconNameToComponent = (name: string): string =>
	`${name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("")}Icon`;
