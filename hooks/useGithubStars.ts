"use client";

import useSWR, { SWRResponse } from "swr";

export type StarsResponse = {
	stars: number | null;
};

const fetcher = async (url: string): Promise<StarsResponse> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch");
	return res.json();
};

type UseGithubStarsReturn = {
	stars: number;
	isLoading: boolean;
	error: Error | undefined;
};

export function useGithubStars(): UseGithubStarsReturn {
	const { data, error, isLoading }: SWRResponse<StarsResponse, Error> = useSWR<
		StarsResponse,
		Error
	>("/api/stars", fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		dedupingInterval: 3600 * 1000,
	});

	return {
		stars: data?.stars ?? 0,
		isLoading,
		error,
	};
}
