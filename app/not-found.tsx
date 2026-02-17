import Link from "next/link";
import React from "react";

const NotFound: React.FC = () => {
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
						404 error
					</p>
					<h1 className="text-4xl font-semibold tracking-tight">
						Page not found
					</h1>
				</div>

				<p className="mb-8 text-center text-sm leading-relaxed text-zinc-400">
					The page you are looking for does not exist or may have been moved.
					Check the URL or return to the homepage.
				</p>

				<div className="flex flex-col gap-3">
					<Link
						href="/"
						className="rounded-lg bg-white px-4 py-2 text-center text-sm font-medium text-black transition hover:bg-zinc-200"
					>
						Go to homepage
					</Link>

					<Link
						href="/icons"
						className="rounded-lg border border-white/15 px-4 py-2 text-center text-sm text-white transition hover:bg-white/5"
					>
						Browse icons
					</Link>
				</div>

				<p className="mt-6 text-center text-xs text-zinc-500">
					If you believe this is a mistake, please contact support.
				</p>
			</div>
		</div>
	);
};

export default NotFound;
