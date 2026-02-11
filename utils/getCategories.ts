
export const getCategories = (icons: { category?: string[] }[]) => {
	const map: Record<string, number> = {};

	icons.forEach((icon) => {
		icon.category?.forEach((cat) => {
			map[cat] = (map[cat] || 0) + 1;
		});
	});

	return Object.entries(map)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);
};
