import IconsNotFound from "@/app/icons/_components/iconlist/IconsNotFound";
import RequestSheet from "@/app/icons/_components/request/RequestSheet";
import SidebarNavItem from "@/app/icons/_components/sidebar/SidebarNavItem";
import {
	RequestProvider,
	useRequest,
	type RequestPreset,
} from "@/app/icons/_contexts/RequestContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../axe";

const action = vi.hoisted(() => ({ submitRequest: vi.fn() }));

vi.mock("@/actions/submitRequest", () => action);
vi.mock("next/navigation", () => ({ usePathname: () => "/icons/lucide" }));

const Opener: React.FC<{ preset: RequestPreset }> = ({ preset }) => {
	const { openRequest } = useRequest();
	return (
		<button type="button" onClick={() => openRequest(preset)}>
			open
		</button>
	);
};

const setup = (preset: RequestPreset = { type: "icon" }) => {
	render(
		<RequestProvider>
			<Opener preset={preset} />
			<RequestSheet />
		</RequestProvider>,
	);
	fireEvent.click(screen.getByText("open"));
	return screen.getByRole("dialog");
};

const type = (label: string, value: string) =>
	fireEvent.change(screen.getByLabelText(label), { target: { value } });

const fillValid = () => {
	type("Name", "Riya");
	type("Email", "riya@studio.dev");
};

const send = () =>
	fireEvent.click(screen.getByRole("button", { name: "Send request" }));

const sentForm = (): Record<string, FormDataEntryValue> =>
	Object.fromEntries(action.submitRequest.mock.calls[0][1] as FormData);

beforeEach(() => {
	action.submitRequest.mockResolvedValue({ status: "sent" });
});

describe("RequestSheet", () => {
	it("opens with the preset type and icon name filled in", () => {
		const dialog = setup({ type: "icon", icon: "rocket-launch" });
		expect(dialog).toHaveAccessibleName("Send a request");
		expect(
			screen.getByRole("button", { name: "Request an icon" }),
		).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByLabelText("Icon name")).toHaveValue("rocket-launch");
	});

	it("shows what is missing and does not send an incomplete request", () => {
		setup();
		send();
		expect(screen.getByText("Add your name.")).toBeInTheDocument();
		expect(screen.getByText("Add a valid email.")).toBeInTheDocument();
		expect(
			screen.getByText("Name the icon, like rocket-launch."),
		).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(
			"Add a valid email.",
		);
		expect(action.submitRequest).not.toHaveBeenCalled();
	});

	it("clears a field's error as soon as it is edited", () => {
		setup();
		send();
		type("Name", "Riya");
		expect(screen.queryByText("Add your name.")).not.toBeInTheDocument();
		expect(screen.getByText("Add a valid email.")).toBeInTheDocument();
	});

	it("sends an icon request with every field and shows the thank you", async () => {
		setup({ type: "icon", icon: "rocket-launch" });
		fillValid();
		fireEvent.click(screen.getByRole("button", { name: "Huge" }));
		type("How should it look and move?", "Lifts off on hover");
		send();

		expect(await screen.findByText("Request sent")).toBeInTheDocument();
		expect(action.submitRequest).toHaveBeenCalledTimes(1);
		expect(sentForm()).toEqual({
			type: "icon",
			library: "huge",
			page: "/icons/lucide",
			website: "",
			name: "Riya",
			email: "riya@studio.dev",
			icon: "rocket-launch",
			message: "Lifts off on hover",
		});
	});

	it("drops the icon fields for custom work and asks about the project", async () => {
		setup({ type: "icon" });
		fireEvent.click(screen.getByRole("button", { name: "Custom work" }));
		expect(screen.queryByLabelText("Icon name")).not.toBeInTheDocument();
		fillValid();
		type("Tell me about the project", "Thirty icons for a dashboard");
		send();

		await screen.findByText("Request sent");
		expect(sentForm()).toMatchObject({
			type: "work",
			library: "",
			message: "Thirty icons for a dashboard",
		});
		expect(sentForm()).not.toHaveProperty("icon");
	});

	it.each([
		["error", "Couldn't send right now. Please try again in a moment."],
		["limited", "Too many requests. Please try again in a few minutes."],
	])("keeps what was typed and explains a %s", async (status, message) => {
		action.submitRequest.mockResolvedValue({ status });
		setup({ type: "feedback" });
		fillValid();
		type("What's on your mind?", "Svelte please");
		send();

		expect(await screen.findByRole("status")).toHaveTextContent(message);
		expect(screen.getByLabelText("Name")).toHaveValue("Riya");
		expect(screen.getByLabelText("What's on your mind?")).toHaveValue(
			"Svelte please",
		);
	});

	it("shows errors the server sends back", async () => {
		action.submitRequest.mockResolvedValue({
			status: "invalid",
			errors: { email: "Add a valid email." },
		});
		setup({ type: "feedback" });
		fillValid();
		type("What's on your mind?", "Svelte please");
		send();
		expect(await screen.findByText("Add a valid email.")).toBeInTheDocument();
	});

	it("keeps the bot trap out of reach of people and screen readers", () => {
		setup();
		const trap = document.querySelector<HTMLInputElement>(
			'input[name="website"]',
		);
		expect(trap).not.toBeNull();
		expect(trap).toHaveAttribute("tabindex", "-1");
		expect(trap).toHaveAttribute("autocomplete", "off");
		expect(trap!.closest("[aria-hidden='true']")).not.toBeNull();
	});

	it("starts a fresh form each time it opens", async () => {
		setup({ type: "feedback" });
		fillValid();
		type("What's on your mind?", "Svelte please");
		send();
		await screen.findByText("Request sent");

		fireEvent.click(screen.getByRole("button", { name: "Done" }));
		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		fireEvent.click(screen.getByText("open"));
		expect(screen.getByLabelText("Name")).toHaveValue("");
		expect(screen.queryByText("Request sent")).not.toBeInTheDocument();
	});

	it("has no accessibility problems", async () => {
		const dialog = setup({ type: "icon" });
		send();
		await expectNoA11yViolations(dialog);
	});
});

describe("ways into the form", () => {
	it("opens it from an empty search with the search as the icon name", () => {
		render(
			<RequestProvider>
				<IconsNotFound query="  Rocket Launch!" />
				<RequestSheet />
			</RequestProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Request it" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByLabelText("Icon name")).toHaveValue("rocket-launch");
	});

	it("opens it from the sidebar item", () => {
		render(
			<SidebarProvider>
				<RequestProvider>
					<ul>
						<SidebarNavItem
							item={{ label: "Request an icon", request: "feedback" }}
							isActive={false}
						/>
					</ul>
					<RequestSheet />
				</RequestProvider>
			</SidebarProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Request an icon" }));
		expect(screen.getByRole("button", { name: "Feedback" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});
});
