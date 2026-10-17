import type { IconData } from "@animateicons/vanilla";
import { clock } from "./clock";
import {
	atRest,
	difference,
	measure,
	type Gap,
	type Snapshot,
} from "./measure";
import { animationSeconds } from "./timing";

export interface Track {
	cell: Element;
	start: () => void;
	stop: () => void;
}

export interface IconTracks {
	key: string;
	data: IconData;
	reference: Track;
	candidates: Track[];
}

const SCENARIOS = ["full", "interrupted"] as const;

type Scenario = (typeof SCENARIOS)[number];

export interface Comparison extends Gap {
	atMs: number;
	scenario: Scenario;
}

interface Run {
	tracks: Track[];
	stopAtMs: number;
	endAtMs: number;
	rest: Snapshot[];
	worst: Comparison[];
	stoppedAtMs?: number;
	restFrames: number;
	done: boolean;
}

const FRAME_MS = 1000 / 60;
const MARGIN_MS = 100;
const SETTLE_MS = 1000;
const MIN_SETTLE_MS = 100;
const REST_FRAMES = 3;
const INTERRUPT_AT = 0.4;
const FRAMES_PER_YIELD = 8;

export const isMatch = (comparison: Comparison) => comparison.ratio <= 1;

const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve));

function startRun(icon: IconTracks, scenario: Scenario, duration: number): Run {
	const tracks = [icon.reference, ...icon.candidates];
	const playMs = animationSeconds(icon.data) * 1000 * duration + MARGIN_MS;
	const stopAtMs = scenario === "full" ? playMs : playMs * INTERRUPT_AT;
	const run: Run = {
		tracks,
		stopAtMs,
		endAtMs: stopAtMs + SETTLE_MS * Math.max(1, duration),
		rest: tracks.map((track) => measure(track.cell)),
		worst: icon.candidates.map(() => ({
			ratio: 0,
			metric: "position",
			difference: 0,
			atMs: 0,
			scenario,
		})),
		restFrames: 0,
		done: false,
	};
	for (const track of tracks) track.start();
	return run;
}

function recordFrame(run: Run, atMs: number, scenario: Scenario): boolean {
	const snapshots = run.tracks.map((track) => measure(track.cell));
	const [reference, ...candidates] = snapshots;
	candidates.forEach((candidate, index) => {
		const gap = difference(reference, candidate);
		if (gap.ratio > run.worst[index].ratio) {
			run.worst[index] = { ...gap, atMs: Math.round(atMs), scenario };
		}
	});

	if (run.stoppedAtMs === undefined) {
		if (atMs < run.stopAtMs) return false;
		for (const track of run.tracks) track.stop();
		run.stoppedAtMs = atMs;
		return true;
	}

	const settling = atMs - run.stoppedAtMs >= MIN_SETTLE_MS;
	const resting = snapshots.every((snapshot, index) =>
		atRest(snapshot, run.rest[index]),
	);
	run.restFrames = settling && resting ? run.restFrames + 1 : 0;
	run.done = run.restFrames >= REST_FRAMES || atMs >= run.endAtMs;
	return false;
}

export async function measureIcons(
	icons: IconTracks[],
	duration: number,
): Promise<Record<string, Comparison[]>> {
	const results: Record<string, Comparison[]> = {};
	clock.pause();
	try {
		for (const scenario of SCENARIOS) {
			const runs = icons.map((icon) => startRun(icon, scenario, duration));
			await yieldToBrowser();
			for (let frame = 1; runs.some((run) => !run.done); frame++) {
				await clock.step(FRAME_MS);
				let stopped = false;
				for (const run of runs) {
					if (!run.done && recordFrame(run, frame * FRAME_MS, scenario)) {
						stopped = true;
					}
				}
				if (stopped || frame % FRAMES_PER_YIELD === 0) await yieldToBrowser();
			}
			icons.forEach((icon, index) => {
				const previous = results[icon.key];
				results[icon.key] = runs[index].worst.map((comparison, framework) =>
					previous && previous[framework].ratio > comparison.ratio
						? previous[framework]
						: comparison,
				);
			});
		}
	} finally {
		clock.resume();
	}
	return results;
}
