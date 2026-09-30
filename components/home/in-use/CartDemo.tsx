"use client";

import IconButton from "@/components/IconButton";
import { CheckIcon } from "@/icons/huge/check-icon";
import { HeadphonesIcon } from "@/icons/huge/headphones-icon";
import { ShoppingCartAdd01Icon } from "@/icons/huge/shopping-cart-add-0-1-icon";
import {
	ShoppingCart01Icon,
	type ShoppingCart01IconHandle,
} from "@/icons/huge/shopping-cart-0-1-icon";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import HoverIcon from "../HoverIcon";

type Flight = { id: number; x: number[]; y: number[] };

const FLIGHT_S = 0.7;
const ADDED_MS = 1400;
const ARC_PX = 36;

const centerIn = (el: HTMLElement, box: DOMRect) => {
	const r = el.getBoundingClientRect();
	return {
		x: r.left + r.width / 2 - box.left,
		y: r.top + r.height / 2 - box.top,
	};
};

const CartDemo: React.FC = () => {
	const reduced = useReducedMotion();
	const [count, setCount] = useState(0);
	const [added, setAdded] = useState(false);
	const [flights, setFlights] = useState<Flight[]>([]);
	const boxRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
	const cartRef = useRef<HTMLDivElement>(null);
	const cartIconRef = useRef<ShoppingCart01IconHandle>(null);
	const addedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);
	const nextId = useRef(0);

	useEffect(() => () => clearTimeout(addedTimer.current), []);

	const land = (id: number) => {
		setFlights((cur) => cur.filter((f) => f.id !== id));
		setCount((n) => n + 1);
		cartIconRef.current?.startAnimation();
	};

	const add = () => {
		setAdded(true);
		clearTimeout(addedTimer.current);
		addedTimer.current = setTimeout(() => setAdded(false), ADDED_MS);

		const box = boxRef.current?.getBoundingClientRect();
		if (reduced || !box || !buttonRef.current || !cartRef.current) {
			setCount((n) => n + 1);
			return;
		}
		const from = centerIn(buttonRef.current, box);
		const to = centerIn(cartRef.current, box);
		setFlights((cur) => [
			...cur,
			{
				id: nextId.current++,
				x: [from.x, (from.x + to.x) / 2, to.x],
				y: [from.y, Math.min(from.y, to.y) - ARC_PX, to.y],
			},
		]);
	};

	return (
		<div ref={boxRef} className="relative flex w-full max-w-64 flex-col gap-3">
			<div className="bg-surfaceElevated flex items-center gap-3 rounded-2xl p-2.5">
				<HoverIcon
					Icon={HeadphonesIcon}
					size={28}
					className="bg-surfaceActive text-primary size-14 rounded-xl"
				/>
				<div className="flex-1 text-left">
					<p className="text-textPrimary text-sm font-medium">Headphones</p>
					<p className="text-textMuted text-xs">$79</p>
				</div>
				<div
					ref={cartRef}
					className="bg-surfaceActive text-textSecondary relative grid size-10 place-items-center rounded-full"
				>
					<ShoppingCart01Icon ref={cartIconRef} size={20} />
					{count > 0 && (
						<span
							key={count}
							className="bg-primary absolute -top-1.5 -right-1.5 grid min-w-5 animate-bounce place-items-center rounded-full px-1 text-[11px] font-semibold text-white [animation-iteration-count:1]"
						>
							{count}
						</span>
					)}
				</div>
			</div>

			<div ref={buttonRef}>
				<IconButton
					icon={added ? CheckIcon : ShoppingCartAdd01Icon}
					variant="default"
					size="pill"
					onClick={add}
					className="w-full"
				>
					{added ? "Added" : "Add to cart"}
				</IconButton>
			</div>

			{flights.map(({ id, x, y }) => (
				<motion.span
					key={id}
					aria-hidden="true"
					className="bg-primary pointer-events-none absolute top-0 left-0 -mt-2 -ml-2 size-4 rounded-full"
					initial={{ x: x[0], y: y[0], scale: 1, opacity: 1 }}
					animate={{ x, y, scale: [1, 1.15, 0.45], opacity: [1, 1, 0.2] }}
					transition={{ duration: FLIGHT_S, ease: "easeInOut" }}
					onAnimationComplete={() => land(id)}
				/>
			))}
		</div>
	);
};

export default CartDemo;
