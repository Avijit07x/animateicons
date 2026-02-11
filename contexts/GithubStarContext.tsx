"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface GithubStarContextValue {
	stars: number;
}

const GithubStarContext = createContext<GithubStarContextValue | null>(null);

type Props = {
	children: React.ReactNode;
};

const GithubStarContextProvider: React.FC<Props> = ({ children }) => {
	const [stars, setStars] = useState<number>(0);

	useEffect(() => {
		async function fetchStars() {
			try {
				const res = await fetch("/api/stars");
				if (!res.ok) return;

				const data: { stars: number | null } = await res.json();
				setStars(data.stars ?? 0);
			} catch {}
		}

		fetchStars();
	}, []);

	return (
		<GithubStarContext.Provider value={{ stars }}>
			{children}
		</GithubStarContext.Provider>
	);
};

export default GithubStarContextProvider;

export const useGithubStars = () => {
	const ctx = useContext(GithubStarContext);
	if (!ctx) {
		throw new Error(
			"useGithubStars must be used within GithubStarContextProvider",
		);
	}
	return ctx;
};
