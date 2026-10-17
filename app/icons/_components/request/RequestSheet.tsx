"use client";

import { submitRequest, type RequestState } from "@/actions/submitRequest";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Briefcase01Icon } from "@/icons/huge/briefcase-0-1-icon";
import { CheckIcon } from "@/icons/huge/check-icon";
import { HelpCircleIcon } from "@/icons/huge/help-circle-icon";
import { Message01Icon } from "@/icons/huge/message-0-1-icon";
import { SparklesIcon } from "@/icons/huge/sparkles-icon";
import {
	parseRequest,
	REQUEST_LIMITS,
	type RequestErrors,
	type RequestField,
	type RequestLibrary,
	type RequestType,
} from "@/lib/request";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { startTransition, useActionState, useId, useState } from "react";
import { useRequest, type RequestPreset } from "../../_contexts/RequestContext";

const TYPES: {
	value: RequestType;
	label: string;
	Icon: React.ComponentType<{ size?: number }>;
	prompt: string;
	placeholder: string;
}[] = [
	{
		value: "icon",
		label: "Request an icon",
		Icon: SparklesIcon,
		prompt: "How should it look and move?",
		placeholder: "A rocket that lifts off on hover, with a little smoke.",
	},
	{
		value: "work",
		label: "Custom work",
		Icon: Briefcase01Icon,
		prompt: "Tell me about the project",
		placeholder: "We need around 30 animated icons for our dashboard.",
	},
	{
		value: "feedback",
		label: "Feedback",
		Icon: Message01Icon,
		prompt: "What's on your mind?",
		placeholder: "Svelte support would be amazing.",
	},
	{
		value: "other",
		label: "Something else",
		Icon: HelpCircleIcon,
		prompt: "Your message",
		placeholder: "Anything you'd like to ask or share.",
	},
];

const LIBRARIES: { value: RequestLibrary; label: string }[] = [
	{ value: "lucide", label: "Lucide" },
	{ value: "huge", label: "Huge" },
	{ value: "either", label: "Either" },
];

const STATUS_TEXT: Partial<Record<RequestState["status"], string>> = {
	limited: "Too many requests. Please try again in a few minutes.",
	error: "Couldn't send right now. Please try again in a moment.",
};

const FIELD =
	"bg-surfaceHover text-textPrimary placeholder:text-textMuted focus-visible:inset-ring-primary/60 aria-invalid:inset-ring-primary/60 w-full rounded-[14px] px-3 text-sm outline-none focus-visible:inset-ring aria-invalid:inset-ring";

const Field: React.FC<{
	label: string;
	error?: string;
	className?: string;
	children: (props: { id: string; describedBy?: string }) => React.ReactNode;
}> = ({ label, error, className, children }) => {
	const id = useId();
	const errorId = `${id}-error`;
	return (
		<div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
			<label htmlFor={id} className="text-textMuted text-xs font-medium">
				{label}
			</label>
			{children({ id, describedBy: error ? errorId : undefined })}
			{error && (
				<p id={errorId} className="text-primary text-xs">
					{error}
				</p>
			)}
		</div>
	);
};

const RequestForm: React.FC<{ preset: RequestPreset; onDone: () => void }> = ({
	preset,
	onDone,
}) => {
	const pathname = usePathname();
	const [state, dispatch, pending] = useActionState(submitRequest, {
		status: "idle",
	});
	const [type, setType] = useState<RequestType>(preset.type);
	const [library, setLibrary] = useState<RequestLibrary>("lucide");
	const [values, setValues] = useState({
		name: "",
		email: "",
		icon: preset.icon ?? "",
		message: "",
	});
	const [errors, setErrors] = useState<RequestErrors>({});
	const active = TYPES.find((t) => t.value === type) ?? TYPES[0];
	const shown: RequestErrors =
		state.status === "invalid" ? { ...state.errors, ...errors } : errors;

	if (state.status === "sent") {
		return (
			<div className="flex flex-col items-center px-6 pt-6 pb-10 text-center">
				<span className="bg-success/12 text-success grid size-13 place-items-center rounded-full">
					<CheckIcon size={24} />
				</span>
				<p className="text-textPrimary mt-4 text-lg font-semibold">
					Request sent
				</p>
				<p className="text-textSecondary mt-1 text-sm">
					Thanks! I&apos;ll get back to you by email.
				</p>
				<Button variant="secondary" className="mt-6" onClick={onDone}>
					Done
				</Button>
			</div>
		);
	}

	const update = (field: Exclude<RequestField, "type">, value: string) => {
		setValues((current) => ({ ...current, [field]: value }));
		setErrors((current) => ({ ...current, [field]: undefined }));
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const checked = parseRequest(Object.fromEntries(form));
		if (!checked.ok) {
			setErrors(checked.errors);
			return;
		}
		setErrors({});
		startTransition(() => dispatch(form));
	};

	return (
		<form
			noValidate
			onSubmit={onSubmit}
			aria-label="Send a request"
			className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto px-6 pt-3 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:grid-rows-1"
		>
			<input type="hidden" name="type" value={type} />
			<input
				type="hidden"
				name="library"
				value={type === "icon" ? library : ""}
			/>
			<input type="hidden" name="page" value={pathname ?? ""} />
			<div
				aria-hidden="true"
				className="absolute -left-[9999px] size-px overflow-hidden"
			>
				<label>
					Website
					<input name="website" type="text" tabIndex={-1} autoComplete="off" />
				</label>
			</div>

			<fieldset className="flex min-w-0 flex-col gap-1.5">
				<legend className="text-textMuted mb-1.5 text-xs font-medium">
					What do you need?
				</legend>
				<div className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
					{TYPES.map(({ value, label, Icon }) => (
						<button
							key={value}
							type="button"
							aria-pressed={type === value}
							onClick={() => setType(value)}
							className={cn(
								"flex cursor-pointer items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
								type === value
									? "bg-surfaceElevated text-textPrimary inset-ring-primary/45 [&_svg]:text-primary inset-ring"
									: "bg-surfaceHover text-textSecondary hover:text-textPrimary",
							)}
						>
							<Icon size={16} />
							{label}
						</button>
					))}
				</div>
				{shown.type && <p className="text-primary text-xs">{shown.type}</p>}
			</fieldset>

			<div className="flex min-w-0 flex-col gap-4">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<Field label="Name" error={shown.name}>
						{({ id, describedBy }) => (
							<input
								id={id}
								name="name"
								autoComplete="name"
								maxLength={REQUEST_LIMITS.name}
								value={values.name}
								onChange={(e) => update("name", e.target.value)}
								aria-invalid={!!shown.name}
								aria-describedby={describedBy}
								placeholder="Your name"
								className={cn(FIELD, "h-10")}
							/>
						)}
					</Field>
					<Field label="Email" error={shown.email}>
						{({ id, describedBy }) => (
							<input
								id={id}
								name="email"
								type="email"
								autoComplete="email"
								maxLength={REQUEST_LIMITS.email}
								value={values.email}
								onChange={(e) => update("email", e.target.value)}
								aria-invalid={!!shown.email}
								aria-describedby={describedBy}
								placeholder="you@company.com"
								className={cn(FIELD, "h-10")}
							/>
						)}
					</Field>
				</div>

				{type === "icon" && (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Field label="Icon name" error={shown.icon}>
							{({ id, describedBy }) => (
								<input
									id={id}
									name="icon"
									maxLength={REQUEST_LIMITS.icon}
									value={values.icon}
									onChange={(e) => update("icon", e.target.value)}
									aria-invalid={!!shown.icon}
									aria-describedby={describedBy}
									placeholder="rocket-launch"
									className={cn(FIELD, "h-10")}
								/>
							)}
						</Field>
						<div className="flex min-w-0 flex-col gap-1.5">
							<span className="text-textMuted text-xs font-medium">
								Library
							</span>
							<div role="group" aria-label="Library" className="flex gap-1.5">
								{LIBRARIES.map(({ value, label }) => (
									<button
										key={value}
										type="button"
										aria-pressed={library === value}
										onClick={() => setLibrary(value)}
										className={cn(
											"h-10 flex-1 cursor-pointer rounded-[14px] text-[13px] font-medium transition-colors",
											library === value
												? "bg-surfaceActive text-textPrimary"
												: "bg-surfaceHover text-textSecondary hover:text-textPrimary",
										)}
									>
										{label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				<Field label={active.prompt} error={shown.message} className="flex-1">
					{({ id, describedBy }) => (
						<textarea
							id={id}
							name="message"
							rows={4}
							maxLength={REQUEST_LIMITS.message}
							value={values.message}
							onChange={(e) => update("message", e.target.value)}
							aria-invalid={!!shown.message}
							aria-describedby={describedBy}
							placeholder={active.placeholder}
							className={cn(
								FIELD,
								"min-h-24 flex-1 resize-none py-2.5 leading-relaxed",
							)}
						/>
					)}
				</Field>

				<div className="flex flex-wrap items-center justify-between gap-3">
					<p
						role="status"
						className={cn(
							"text-xs",
							STATUS_TEXT[state.status] ? "text-primary" : "text-textMuted",
						)}
					>
						{STATUS_TEXT[state.status] ?? "Goes straight to me. No spam."}
					</p>
					<Button type="submit" disabled={pending}>
						{pending ? "Sending..." : "Send request"}
					</Button>
				</div>
			</div>
		</form>
	);
};

const RequestSheet: React.FC = () => {
	const { open, preset, session, closeRequest } = useRequest();

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) closeRequest();
			}}
		>
			<SheetContent
				side="bottom"
				className="bg-bgDark border-border/60 inset-x-3 bottom-3 mx-auto max-h-[85dvh] max-w-3xl gap-0 overflow-hidden rounded-3xl border p-0 md:h-[30rem]"
			>
				<SheetHeader className="shrink-0 gap-1 px-6 pt-5 pb-3">
					<SheetTitle className="text-textPrimary text-lg font-semibold">
						Send a request
					</SheetTitle>
					<SheetDescription className="text-textSecondary text-sm">
						Ask for an icon, hire me for custom work, or tell me anything.
					</SheetDescription>
				</SheetHeader>
				<RequestForm key={session} preset={preset} onDone={closeRequest} />
			</SheetContent>
		</Sheet>
	);
};

export default RequestSheet;
