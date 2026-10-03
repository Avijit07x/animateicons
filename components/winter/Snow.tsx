"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useWinter } from "./useWinter";

type Flake = {
	x: number;
	y: number;
	radius: number;
	speed: number;
	alpha: number;
	sway: number;
	phase: number;
	drift: number;
	icy: boolean;
};

const COUNT = 40;
const TAU = Math.PI * 2;

const createFlake = (): Flake => {
	const radius = 0.9 + Math.random() * Math.random() * 2.8;
	return {
		x: Math.random(),
		y: Math.random(),
		radius,
		speed: 12 + radius * 9 + Math.random() * 8,
		alpha: 0.32 + Math.random() * 0.45 - radius * 0.03,
		sway: 4 + Math.random() * 14,
		phase: Math.random() * TAU,
		drift: 0.25 + Math.random() * 0.5,
		icy: Math.random() < 0.35,
	};
};

const Snow: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const reduced = useReducedMotion();
	const winter = useWinter();
	const active = winter && !reduced;

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx || !active) return;

		const flakes = Array.from({ length: COUNT }, createFlake);
		let width = 0;
		let height = 0;
		let frame = 0;
		let last = 0;

		const resize = () => {
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		};

		const draw = (time: number) => {
			const dt = Math.min(0.05, (time - last) / 1000);
			last = time;
			ctx.clearRect(0, 0, width, height);

			for (const flake of flakes) {
				flake.y += (flake.speed * dt) / height;
				flake.phase += flake.drift * dt;
				if (flake.y > 1.02) {
					flake.y = -0.02;
					flake.x = Math.random();
				}

				const x = flake.x * width + Math.sin(flake.phase) * flake.sway;
				const y = flake.y * height;
				const color = flake.icy
					? `rgba(186,228,255,${flake.alpha})`
					: `rgba(240,247,255,${flake.alpha})`;

				ctx.beginPath();
				if (flake.radius > 1.7) {
					const glow = ctx.createRadialGradient(
						x,
						y,
						0,
						x,
						y,
						flake.radius * 1.8,
					);
					glow.addColorStop(0, color);
					glow.addColorStop(1, "rgba(255,255,255,0)");
					ctx.fillStyle = glow;
					ctx.arc(x, y, flake.radius * 1.8, 0, TAU);
				} else {
					ctx.fillStyle = color;
					ctx.arc(x, y, flake.radius, 0, TAU);
				}
				ctx.fill();
			}

			frame = requestAnimationFrame(draw);
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		resize();
		last = performance.now();
		frame = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
		};
	}, [active]);

	if (!active) return null;

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className="animate-in fade-in pointer-events-none fixed inset-0 z-40 size-full duration-1000"
		/>
	);
};

export default Snow;
