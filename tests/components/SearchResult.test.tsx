import SearchResult from "@/components/home/SearchResult";
import type { IconSearchEntry } from "@/lib/icon-search";
import type { IconHandle } from "@/types/icon";
import { act, render } from "@testing-library/react";
import { forwardRef, useImperativeHandle } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const handle = { startAnimation: vi.fn(), stopAnimation: vi.fn() };

const FakeIcon = forwardRef<IconHandle, { size?: number }>(
	function FakeIcon(_props, ref) {
		useImperativeHandle(ref, () => handle);
		return <svg data-testid="icon" />;
	},
);

const entry: IconSearchEntry = {
	name: "fake-icon",
	library: "huge",
	component: FakeIcon,
};

describe("SearchResult", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		handle.startAnimation.mockClear();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("links to the icon's page and shows its name", () => {
		const { getByRole, getByText } = render(
			<SearchResult entry={entry} index={0} />,
		);
		expect(getByRole("link").getAttribute("href")).toBe(
			"/icons/huge/fake-icon",
		);
		expect(getByText("fake-icon")).toBeTruthy();
	});

	it("plays the icon once, shortly after it arrives", () => {
		render(<SearchResult entry={entry} index={0} />);
		expect(handle.startAnimation).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(260);
		});
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);
	});

	it("staggers later results", () => {
		render(<SearchResult entry={entry} index={3} />);
		act(() => {
			vi.advanceTimersByTime(260 + 60 * 3 - 1);
		});
		expect(handle.startAnimation).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);
	});

	it("never plays an icon that was removed before its turn", () => {
		const { unmount } = render(<SearchResult entry={entry} index={0} />);
		unmount();
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(handle.startAnimation).not.toHaveBeenCalled();
	});

	it("plays once even when its callback is re-bound after a re-render", () => {
		const { rerender } = render(<SearchResult entry={entry} index={0} />);
		rerender(<SearchResult entry={entry} index={1} />);
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);
	});

	it("leaves no pending play behind after a re-bind and an unmount", () => {
		const { rerender, unmount } = render(
			<SearchResult entry={entry} index={0} />,
		);
		rerender(<SearchResult entry={entry} index={1} />);
		unmount();
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(handle.startAnimation).not.toHaveBeenCalled();
	});
});
