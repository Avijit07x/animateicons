import AppSidebar from "@/app/icons/_components/sidebar/AppSidebar";
import CategoryContextProvider from "@/app/icons/_contexts/CategoryContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const today = new Date().toISOString().slice(0, 10);
	const icon = (name: string, addedAt: string) => ({
		name,
		keywords: [name],
		category: ["Social"],
		addedAt,
	});
	return {
		lucide: [icon("heart", today), icon("bell", "2020-01-01")],
		huge: [icon("star", today), icon("moon", today), icon("sun", "2020-01-01")],
	};
});

vi.mock("next/navigation", () => ({
	usePathname: () => "/icons/lucide",
	useRouter: () => ({ replace: vi.fn() }),
}));
vi.mock("@/icons/lucide/meta", () => ({ ICON_META: mocks.lucide }));
vi.mock("@/icons/huge/meta", () => ({ ICON_META: mocks.huge }));

const tree = (
	<SidebarProvider>
		<CategoryContextProvider>
			<AppSidebar />
		</CategoryContextProvider>
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
