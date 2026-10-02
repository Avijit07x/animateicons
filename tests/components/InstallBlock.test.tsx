import InstallBlock from "@/app/icons/_components/playground/InstallBlock";
import { DistributionProvider } from "@/app/icons/_contexts/DistributionContext";
import { PackageManagerProvider } from "@/app/icons/_contexts/PackageManagerContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

const setup = () =>
	render(
		<DistributionProvider>
			<PackageManagerProvider>
				<InstallBlock prefix="lu" name="bell" />
			</PackageManagerProvider>
		</DistributionProvider>,
	);

const command = () => screen.getByRole("code").textContent;

describe("InstallBlock", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("starts with the npm package install", () => {
		setup();
		expect(command()).toBe("npm i @animateicons/react");
		expect(
			screen
				.getByRole("button", { name: "npm package" })
				.getAttribute("aria-pressed"),
		).toBe("true");
	});

	it("shows the shadcn command for this icon when shadcn is chosen", () => {
		setup();
		fireEvent.click(screen.getByRole("button", { name: "shadcn" }));
		expect(command()).toBe("npx shadcn@latest add @animateicons/lu-bell");
	});

	it("follows the package manager for shadcn", () => {
		setup();
		fireEvent.click(screen.getByRole("button", { name: "shadcn" }));
		fireEvent.click(screen.getByRole("button", { name: "bun" }));
		expect(command()).toBe(
			"bunx --bun shadcn@latest add @animateicons/lu-bell",
		);
	});

	it("keeps the chosen manager when switching between methods", () => {
		setup();
		fireEvent.click(screen.getByRole("button", { name: "pnpm" }));
		expect(command()).toBe("pnpm add @animateicons/react");
		fireEvent.click(screen.getByRole("button", { name: "shadcn" }));
		expect(command()).toBe("pnpm dlx shadcn@latest add @animateicons/lu-bell");
	});
});
