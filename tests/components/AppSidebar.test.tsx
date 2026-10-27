import AppSidebar from "@/app/icons/_components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { act, render } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const today = new Date().toISOString().slice(0, 10);
	const summary = (addedAt: string[]) => ({
		ICON_ADDED_AT: addedAt,
		ICON_CATEGORIES: [{ name: "Social", count: addedAt.length }],
	});
	return {
		lucide: summary([today, "2020-01-01"]),
		huge: summary([today, today, "2020-01-01"]),
	};
});

const nav = vi.hoisted(() => ({ params: new URLSearchParams() }));

vi.mock("next/navigation", () => ({
	usePathname: () => "/icons/lucide",
	useRouter: () => ({ replace: vi.fn() }),
	useSearchParams: () => nav.params,
}));
vi.mock("@/icons/lucide/summary", () => mocks.lucide);
vi.mock("@/icons/huge/summary", () => mocks.huge);

const tree = (
	<SidebarProvider>
		<AppSidebar />
	</SidebarProvider>
);

describe("AppSidebar new icon counts", () => {
	it("leaves the counts out of the server HTML, which is built on another day", () => {
		const server = document.createElement("div");
		server.innerHTML = renderToString(tree);
		expect(server.textContent).toContain("Lucide Icons");
		expect(server.textContent).not.toMatch(/\d+ New/);
	});

	it("shows the counts after hydrating, without a hydration error", async () => {
		const container = document.createElement("div");
		container.innerHTML = renderToString(tree);
		document.body.appendChild(container);
		const recoverable: unknown[] = [];

		await act(async () => {
			hydrateRoot(container, tree, {
				onRecoverableError: (error) => recoverable.push(error),
			});
		});

		expect(recoverable).toEqual([]);
		expect(container.textContent).toContain("1 New");
		expect(container.textContent).toContain("2 New");
		container.remove();
	});
});

describe("AppSidebar categories", () => {
	const categoryLink = (container: HTMLElement, label: string) =>
		[...container.querySelectorAll("a")].find((a) =>
			a.textContent?.startsWith(label),
		);

	it("links each category to the gallery with the category in the address", () => {
		nav.params = new URLSearchParams();
		const { container } = render(tree);
		expect(categoryLink(container, "Social")?.getAttribute("href")).toBe(
			"/icons/lucide?category=Social",
		);
		expect(categoryLink(container, "All")?.getAttribute("href")).toBe(
			"/icons/lucide",
		);
	});

	it("marks the category from the address as active", () => {
		nav.params = new URLSearchParams("category=Social");
		const { container } = render(tree);
		expect(categoryLink(container, "Social")?.getAttribute("data-active")).toBe(
			"true",
		);
		expect(categoryLink(container, "All")?.getAttribute("data-active")).toBe(
			"false",
		);
		nav.params = new URLSearchParams();
	});
});
