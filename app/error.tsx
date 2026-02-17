"use client";

import Link from "next/link";
import React from "react";

type Props = {
	error: Error;
	reset: () => void;
};

const error: React.FC<Props> = ({ error, reset }) => {
	return (
		<div className="relative flex min-h-dvh items-center justify-center px-6 text-white">
			<div
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					backgroundImage: `
						repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75, 85, 99, 0.08) 20px, rgba(75, 85, 99, 0.08) 21px),
						repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107, 114, 128, 0.06) 30px, rgba(107, 114, 128, 0.06) 31px),
						repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(55, 65, 81, 0.05) 40px, rgba(55, 65, 81, 0.05) 41px),
						repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(31, 41, 55, 0.04) 35px, rgba(31, 41, 55, 0.04) 36px)`,
				}}
			/>
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/60 p-8 backdrop-blur">
				<div className="mb-6 text-center">
					<p className="mb-2 text-xs tracking-wider text-zinc-500 uppercase">
						Application error
					</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						Something went wrong
					</h1>
				</div>

				<p className="mb-6 text-center text-sm text-zinc-400">
					An unexpected error occurred while loading this page. You can try
					again or return to the homepage.
				</p>

				<div className="flex flex-col gap-3">
					<button
						onClick={() => reset()}
						className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
					>
						Try again
					</button>

					<Link
						href="/"
						className="rounded-lg border border-white/15 px-4 py-2 text-center text-sm transition hover:bg-white/5"
					>
						Go to homepage
					</Link>
				</div>

				{process.env.NODE_ENV === "development" && (
					<div className="mt-6 rounded-lg bg-black/40 p-3 text-xs text-zinc-400">
						<p className="mb-1 font-medium text-zinc-300">Debug info</p>
						<p className="break-all">{error.message}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default error;
