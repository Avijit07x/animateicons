"use client";

import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";
import {
 LazyMotion,
 domMin,
 m,
 useAnimation,
 useReducedMotion,
} from "motion/react";
import {
 forwardRef,
 useCallback,
 useImperativeHandle,
 useRef,
 type HTMLAttributes,
} from "react";
export interface ShoppingBagRemoveIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShoppingBagRemoveIconProps extends Omit<
 HTMLAttributes<HTMLDivElement>,
 | "color"
 | "onDrag"
 | "onDragStart"
 | "onDragEnd"
 | "onAnimationStart"
 | "onAnimationEnd"
 | "onAnimationIteration"
> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
 color?: string;
}

const ShoppingBagRemoveIcon = forwardRef<
 ShoppingBagRemoveIconHandle,
 ShoppingBagRemoveIconProps
>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   color,
   ...props
  },
  ref,
 ) => {
  const controls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () =>
     reduced ? controls.start("normal") : controls.start("animate"),
    stopAnimation: () => controls.start("normal"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) controls.start("animate");
    else onMouseEnter?.(e as any);
   },
   [controls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const handleVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0.5, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const crossVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 90],
    scale: [1, 1.3, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("inline-flex items-center justify-center", className)}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     {...props}
     style={{ color, ...props.style }}
    >
     <m.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      initial="normal"
     >
      <m.path
       d="M8 6.5C8 8.15685 9.34315 9.5 11 9.5C12.6569 9.5 14 8.15685 14 6.5"
       variants={handleVariants}
      />
      <m.path
       d="M16 16.5L21 21.5M16 21.5L21 16.5"
       variants={crossVariants}
       style={{ transformBox: "view-box", originX: "18.5px", originY: "19px" }}
      />
      <path d="M13.1084 20.5H9.89162C6.02422 20.5 4.09052 20.5 2.89731 19.1594C1.70411 17.8189 1.91058 16.0497 2.32352 12.5113C2.6739 9.50898 3.18586 7.25784 3.66063 5.65851C4.04994 4.34711 4.24459 3.69141 5.04283 3.0957C5.84107 2.5 6.65697 2.5 8.28876 2.5H13.7113C15.3431 2.5 16.159 2.5 16.9572 3.0957C17.7554 3.69141 17.9501 4.34711 18.3394 5.65851C18.8142 7.25784 19.3261 9.50898 19.6765 12.5113C19.7169 12.8574 19.7553 13.1865 19.7906 13.5" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShoppingBagRemoveIcon.displayName = "ShoppingBagRemoveIcon";
export { ShoppingBagRemoveIcon };
