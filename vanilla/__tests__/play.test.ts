import { beforeEach, describe, expect, it, vi } from "vitest";
import { play } from "../src/play";
import { renderIcon } from "../src/render";
import {
	BELL,
	callsFor,
	motionMock,
	reduceMotion,
	resetMotion,
	restingFor,
	TRASH,
} from "./fixtures";

vi.mock("motion", async () => (await import("./fixtures")).motionModule);

beforeEach(resetMotion);

describe("play", () => {
	it("binds every animated element at rest without animating", () => {
		const svg = renderIcon(BELL);
		play(svg, BELL);
		expect(restingFor(svg)).toEqual({
			transformOrigin: "top center",
			rotate: 0,
		});
		expect(callsFor(svg)).toHaveLength(0);
	});

	it("centers the pivot of moving children the way motion/react does", () => {
		const svg = renderIcon(BELL);
		play(svg, BELL);
		expect(restingFor(svg.children[0])).toEqual({
			originX: "50%",
			originY: "50%",
			x: 0,
		});
		expect(restingFor(svg.children[1])).toBeUndefined();
	});

	it("keeps an explicit pivot and pivot box", () => {
		const svg = renderIcon(TRASH);
		play(svg, TRASH);
		expect(restingFor(svg.children[0])).toEqual({
			transformBox: "view-box",
			originX: "3px",
			originY: "6px",
			rotate: 0,
		});
	});

	it("plays the animate state and scales every duration and delay", () => {
		const svg = renderIcon(BELL);
		play(svg, BELL, { duration: 2 }).start();
		const clapper = callsFor(svg.children[0]).at(-1);
		expect(clapper?.values).toEqual({ x: [0, 1.7, -1.4, 0.8, -0.4, 0] });
		expect(clapper?.options).toEqual({
			duration: 2.2,
			delay: 0.4,
			ease: "easeInOut",
		});
	});

	it("scales per-property transitions and repeat delays", () => {
		const svg = renderIcon(TRASH);
		play(svg, TRASH, { duration: 0.5 }).start();
		expect(callsFor(svg.children[0]).at(-1)?.options).toEqual({
			rotate: { duration: 0.45, delay: 0.05 },
			repeatDelay: 0.15,
		});
	});

	it("returns to the normal state when stopped", () => {
		const svg = renderIcon(BELL);
		const player = play(svg, BELL);
		player.start();
		player.stop();
		expect(callsFor(svg).at(-1)?.values).toEqual({ rotate: 0 });
	});

	it("goes to rest instead of animating when reduced motion is on", () => {
		reduceMotion(true);
		const svg = renderIcon(BELL);
		play(svg, BELL).start();
		expect(callsFor(svg).at(-1)?.values).toEqual({ rotate: 0 });
	});

	it("stops running animations and releases its values when destroyed", () => {
		const player = play(renderIcon(BELL), BELL);
		player.start();
		const running = motionMock.animate.mock.results
			.slice(-2)
			.map((result) => result.value);
		player.destroy();
		for (const animation of running) {
			expect(animation.stop).toHaveBeenCalledOnce();
		}
		expect(motionMock.release).toHaveBeenCalledTimes(2);
	});
});
