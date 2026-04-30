/**
 * Tests for Section + SectionHeader — the shared shell powering
 * AnimateIcons landing-page sections (Features, IconLibraries, etc.).
 */

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Section from "@/components/section/Section";
import SectionHeader from "@/components/section/SectionHeader";

describe("Section", () => {
	it("wraps children in a <section> with the standard padding/border", () => {
		const { container } = render(
			<Section>
				<p>content</p>
			</Section>,
		);
		const section = container.querySelector("section");
		expect(section).not.toBeNull();
		expect(section?.className).toContain("border-t");
		expect(section?.className).toContain("py-18");
	});

	it("omits the top border when noBorder is true", () => {
		const { container } = render(
			<Section noBorder>
				<p>content</p>
			</Section>,
		);
		expect(container.querySelector("section")?.className).not.toContain(
			"border-t",
		);
	});

	it("merges additional className", () => {
		const { container } = render(
			<Section className="custom-thing">
				<p>content</p>
			</Section>,
		);
		expect(container.querySelector("section")?.className).toContain(
			"custom-thing",
		);
	});
});

describe("SectionHeader", () => {
	it("renders the title", () => {
		const { getByRole } = render(<SectionHeader title="Hello world" />);
		expect(getByRole("heading", { level: 2 }).textContent).toBe("Hello world");
	});

	it("omits the subtitle paragraph when subtitle is not provided", () => {
		const { container } = render(<SectionHeader title="Bare" />);
		expect(container.querySelector("p")).toBeNull();
	});

	it("renders the subtitle when provided", () => {
		const { getByText } = render(
			<SectionHeader title="With subtitle" subtitle="A nice tagline." />,
		);
		expect(getByText("A nice tagline.")).toBeInTheDocument();
	});

	it("applies tight spacing variant", () => {
		const { container } = render(<SectionHeader title="x" spacing="tight" />);
		expect(container.firstChild).toHaveClass("mb-14");
	});

	it("applies default spacing when no variant given", () => {
		const { container } = render(<SectionHeader title="x" />);
		expect(container.firstChild).toHaveClass("mb-16");
	});
});
