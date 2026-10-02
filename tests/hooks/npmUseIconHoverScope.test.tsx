import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import type { IconHandle } from "@/types/icon";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
	useEffect,
	useImperativeHandle,
	type HTMLAttributes,
	type Ref,
} from "react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";

type Spies = { start: Mock<() => void>; stop: Mock<() => void> };

const spies: Record<string, Spies> = {};

const spy = (name: string) => {
	spies[name] ??= { start: vi.fn<() => void>(), stop: vi.fn<() => void>() };
	return spies[name];
};

const Icon = ({
	name,
	ref,
	...rest
}: {
	name: string;
	ref?: Ref<IconHandle>;
} & HTMLAttributes<HTMLSpanElement>) => {
	const own = spy(name);
	useImperativeHandle(ref, () => ({
		startAnimation: own.start,
		stopAnimation: own.stop,
	}));
	return <span data-testid={name} {...rest} />;
};

const frames = () => {
	const queue: FrameRequestCallback[] = [];
	vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
		queue.push(cb);
		return queue.length;
	});
	return () => act(() => queue.splice(0).forEach((cb) => cb(0)));
};

const played = (name: string, kind: "start" | "stop" = "start") =>
	spy(name)[kind].mock.calls.length;

afterEach(() => {
	for (const key of Object.keys(spies)) delete spies[key];
});

const likeAndNotify = [
	{ icon: "bell", trigger: "click" },
	{ icon: "heart", trigger: "hover" },
] as const;

function TwoButtons() {
	const {
		icon: { bell, heart },
		trigger,
	} = useIconHover({ trigger: likeAndNotify });

	return (
		<div>
			<button data-testid="like" {...trigger}>
				<Icon name="heart" {...heart} />
				Like
			</button>
			<button data-testid="notify" {...trigger}>
				<Icon name="bell" {...bell} />
				Notify
			</button>
		</div>
	);
}

describe("useIconHover plays only the icons inside the element you touch", () => {
	it("hovering Like plays the heart, hovering Notify plays nothing", () => {
		render(<TwoButtons />);

		fireEvent.mouseEnter(screen.getByTestId("notify"));
		expect(played("heart")).toBe(0);
		expect(played("bell")).toBe(0);

		fireEvent.mouseEnter(screen.getByTestId("like"));
		expect(played("heart")).toBe(1);
		expect(played("bell")).toBe(0);
	});

	it("leaving a button stops only the icons inside it", () => {
		render(<TwoButtons />);

		fireEvent.mouseLeave(screen.getByTestId("notify"));
		expect(played("heart", "stop")).toBe(0);

		fireEvent.mouseLeave(screen.getByTestId("like"));
		expect(played("heart", "stop")).toBe(1);
		expect(played("bell", "stop")).toBe(0);
	});

	it("clicking Notify plays the bell, clicking Like plays nothing", () => {
		render(<TwoButtons />);
		const flush = frames();

		fireEvent.click(screen.getByTestId("like"));
		flush();
		expect(played("bell")).toBe(0);
		expect(played("heart")).toBe(0);

		fireEvent.click(screen.getByTestId("notify"));
		flush();
		expect(played("bell")).toBe(1);
		expect(played("heart")).toBe(0);
	});
});

describe("useIconHover with several icons in one element", () => {
	const cart = [
		{ icon: "cart", trigger: "click" },
		{ icon: "sparkles", trigger: "hover" },
		{ icon: "check", trigger: "both" },
	] as const;

	function AddToCart() {
		const {
			icon: { cart: cartIcon, sparkles, check },
			trigger,
		} = useIconHover({ trigger: cart });

		return (
			<button data-testid="button" {...trigger}>
				<Icon name="cart" {...cartIcon} />
				<span>
					<span>
						<Icon name="sparkles" {...sparkles} />
					</span>
				</span>
				<Icon name="check" {...check} />
			</button>
		);
	}

	it("hover plays the hover and both icons, including nested ones", () => {
		render(<AddToCart />);

		fireEvent.mouseEnter(screen.getByTestId("button"));

		expect(played("sparkles")).toBe(1);
		expect(played("check")).toBe(1);
		expect(played("cart")).toBe(0);
	});

	it("click plays the click and both icons", () => {
		render(<AddToCart />);
		const flush = frames();

		fireEvent.click(screen.getByTestId("button"));
		flush();

		expect(played("cart")).toBe(1);
		expect(played("check")).toBe(1);
		expect(played("sparkles")).toBe(0);
	});
});

describe("useIconHover scoping edge cases", () => {
	it("keeps two hooks on one page apart", () => {
		const firstConfig = [{ icon: "star", trigger: "hover" }] as const;
		const secondConfig = [{ icon: "star", trigger: "hover" }] as const;

		function Page() {
			const first = useIconHover({ trigger: firstConfig });
			const second = useIconHover({ trigger: secondConfig });

			return (
				<div>
					<button data-testid="a" {...first.trigger}>
						<Icon name="first-star" {...first.icon.star} />
						<Icon name="second-star" {...second.icon.star} />
					</button>
				</div>
			);
		}

		render(<Page />);
		fireEvent.mouseEnter(screen.getByTestId("a"));

		expect(played("first-star")).toBe(1);
		expect(played("second-star")).toBe(0);
	});

	it("plays nothing when the element holds none of the icons", () => {
		const config = [{ icon: "heart", trigger: "hover" }] as const;

		function Page() {
			const { icon, trigger } = useIconHover({ trigger: config });

			return (
				<div>
					<button data-testid="empty" {...trigger}>
						Empty
					</button>
					<Icon name="heart" {...icon.heart} />
				</div>
			);
		}

		render(<Page />);
		fireEvent.mouseEnter(screen.getByTestId("empty"));

		expect(played("heart")).toBe(0);
	});

	it("plays every matching icon when a handler is called without an event", () => {
		const captured: {
			hook?: ReturnType<typeof useIconHover<typeof likeAndNotify>>;
		} = {};

		function Page() {
			const hook = useIconHover({ trigger: likeAndNotify });
			useEffect(() => {
				captured.hook = hook;
			});
			return (
				<div>
					<Icon name="heart" {...hook.icon.heart} />
					<Icon name="bell" {...hook.icon.bell} />
				</div>
			);
		}

		render(<Page />);
		const flush = frames();
		const hook = captured.hook;
		if (!hook) throw new Error("hook was not captured");

		hook.trigger.onMouseEnter?.();
		hook.trigger.onClick?.();
		flush();

		expect(played("heart")).toBe(1);
		expect(played("bell")).toBe(1);
	});

	it("does not throw when the button is removed before the click frame", () => {
		const flush = frames();
		const { rerender } = render(<TwoButtons />);

		fireEvent.click(screen.getByTestId("notify"));
		rerender(<div />);

		expect(flush).not.toThrow();
		expect(played("bell")).toBe(0);
	});
});
