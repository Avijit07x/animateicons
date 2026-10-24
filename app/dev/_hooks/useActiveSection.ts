import { useEffect, useState } from "react";

export const useActiveSection = (ids: string[]) => {
	const [active, setActive] = useState("");
	const key = ids.join(" ");

	useEffect(() => {
		const sections = key
			.split(" ")
			.map((id) => document.getElementById(id))
			.filter((section): section is HTMLElement => section !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				const top = entries
					.filter((entry) => entry.isIntersecting)
					.sort(
						(a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
					)[0];
				if (top) setActive(top.target.id);
			},
			{ rootMargin: "-96px 0px -60% 0px" },
		);

		sections.forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	}, [key]);

	return active;
};
