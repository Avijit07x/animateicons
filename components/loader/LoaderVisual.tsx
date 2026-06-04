import Image from "next/image";

/**
 * The shared loader graphic: the AnimateIcons logo above a thin, sweeping
 * progress bar. Pure markup + CSS (see globals.css `loaderSweep`/`loaderPulse`)
 * so it works in a server component (app/loading.tsx) and inside the client
 * boot overlay alike. Reduced-motion users get a static bar.
 */
export function LoaderVisual() {
	return (
		<div className="flex flex-col items-center gap-5">
			<Image
				src="/logo.svg"
				alt=""
				width={40}
				height={40}
				priority
				className="loader-logo"
			/>
			<div className="relative h-[3px] w-52 overflow-hidden rounded-full bg-white/10">
				<div className="loader-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/90" />
			</div>
		</div>
	);
}
