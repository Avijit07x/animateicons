import ComposedProviders from "@/components/ComposedProviders";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const wrapper = (name: string) => {
	const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
		<div data-provider={name}>{children}</div>
	);
	return Provider;
};

describe("ComposedProviders", () => {
	it("nests the providers with the first one outermost", () => {
		render(
			<ComposedProviders providers={[wrapper("outer"), wrapper("inner")]}>
				<span>child</span>
			</ComposedProviders>,
		);
		const child = screen.getByText("child");
		expect(child.parentElement).toHaveAttribute("data-provider", "inner");
		expect(child.parentElement?.parentElement).toHaveAttribute(
			"data-provider",
			"outer",
		);
	});

	it("renders the children alone when there are no providers", () => {
		const { container } = render(
			<ComposedProviders providers={[]}>
				<span>child</span>
			</ComposedProviders>,
		);
		expect(container.innerHTML).toBe("<span>child</span>");
	});
});
