const realRequestFrame = window.requestAnimationFrame.bind(window);
const realCancelFrame = window.cancelAnimationFrame.bind(window);
const realNow = performance.now.bind(performance);

const pending = new Map<number, FrameRequestCallback>();
let lastId = 0;
let realFrame = 0;
let manual = false;
let manualTime = 0;
let offset = 0;

const now = () => (manual ? manualTime : realNow() + offset);

const runPending = (time: number) => {
	const callbacks = [...pending.values()];
	pending.clear();
	for (const callback of callbacks) callback(time);
};

const scheduleRealFrame = () => {
	if (manual || realFrame) return;
	realFrame = realRequestFrame(() => {
		realFrame = 0;
		runPending(now());
	});
};

const flushMicrotasks = async () => {
	for (let turn = 0; turn < 4; turn++) await Promise.resolve();
};

delete (Element.prototype as Partial<Element>).animate;

performance.now = now;

window.requestAnimationFrame = (callback) => {
	lastId += 1;
	pending.set(lastId, callback);
	scheduleRealFrame();
	return lastId;
};

window.cancelAnimationFrame = (id) => {
	pending.delete(id);
};

export const clock = {
	pause() {
		manualTime = now();
		manual = true;
		realCancelFrame(realFrame);
		realFrame = 0;
	},

	async step(ms: number) {
		manualTime += ms;
		runPending(manualTime);
		await flushMicrotasks();
	},

	resume() {
		offset = manualTime - realNow();
		manual = false;
		if (pending.size) scheduleRealFrame();
	},
};
