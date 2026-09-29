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
export interface ShoppingBagAddIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShoppingBagAddIconProps extends Omit<
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

const ShoppingBagAddIcon = forwardRef<
 ShoppingBagAddIconHandle,
 ShoppingBagAddIconProps
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

  const plusVariants: Variants = {
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
      <path d="M20.1765 12.5113C19.8261 9.50898 19.3142 7.25784 18.8394 5.65851C18.4501 4.34711 18.2554 3.69141 17.4572 3.0957C16.659 2.5 15.8431 2.5 14.2113 2.5H8.78876C7.15697 2.5 6.34107 2.5 5.54283 3.0957C4.74459 3.69141 4.54994 4.34711 4.16063 5.65851C3.68586 7.25784 3.1739 9.50898 2.82352 12.5113C2.41058 16.0497 2.20411 17.8189 3.39731 19.1594C4.59052 20.5 6.52422 20.5 10.3916 20.5H12.6084" />
      <m.path
       d="M8.5 6.5C8.5 8.15685 9.84315 9.5 11.5 9.5C13.1569 9.5 14.5 8.15685 14.5 6.5"
       variants={handleVariants}
      />
      <m.path
       d="M15.5 18.5H21.5M18.5 21.5V15.5"
       variants={plusVariants}
       style={{
        transformBox: "view-box",
        originX: "18.5px",
        originY: "18.5px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShoppingBagAddIcon.displayName = "ShoppingBagAddIcon";
export { ShoppingBagAddIcon };
