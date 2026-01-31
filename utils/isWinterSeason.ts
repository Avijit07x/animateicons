export const isWinterSeason = (): boolean => {
	const now = new Date();
	const month = now.getMonth();
	const day = now.getDate();

	if (month === 11 && day >= 10) return true;

	return false;
};
