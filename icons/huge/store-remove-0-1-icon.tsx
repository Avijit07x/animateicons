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
export interface StoreRemove01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface StoreRemove01IconProps extends Omit<
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

const StoreRemove01Icon = forwardRef<
 StoreRemove01IconHandle,
 StoreRemove01IconProps
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

  const awningVariants: Variants = {
   normal: { y: 0, scaleY: 1 },
   animate: {
    y: [0, -3, 1, -0.4, 0],
    scaleY: [1, 1, 0.94, 1.03, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.15, 0.5, 0.75, 1],
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
      <path d="M3.5 9.99988V14.9999C3.5 17.8283 3.5 19.2425 4.37868 20.1212C5.25736 20.9999 6.67157 20.9999 9.5 20.9999H12M20.5 12.9999V9.99988" />
      <m.path
       d="M17 7.50171C17 8.88243 15.8807 9.99985 14.5 9.99985C13.1193 9.99985 12 8.88056 12 7.49985C12 8.88056 10.8807 9.99985 9.5 9.99985C8.11929 9.99985 7 8.88056 7 7.49985C7 8.88056 5.82654 9.99985 4.379 9.99985C3.59983 9.99985 2.90007 9.67555 2.41999 9.16075C1.59461 8.27567 2.12559 6.97391 2.81446 5.9883L3.202 5.45839C4.08384 4.25258 4.52476 3.64968 5.16491 3.32482C5.80507 2.99996 6.552 3.00005 8.04586 3.00025L15.9551 3.00131C17.4485 3.00151 18.1952 3.00161 18.8351 3.32646C19.475 3.65131 19.9158 4.25402 20.7974 5.45945L21.1855 5.99017C21.8744 6.97577 22.4054 8.27754 21.58 9.16261C21.0999 9.67742 20.4001 10.0017 19.621 10.0017C18.1734 10.0017 17 8.88243 17 7.50171Z"
       variants={awningVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "10px" }}
      />
      <m.path
       d="M15.5 15.9999L20.5 20.9999M15.5 20.9999L20.5 15.9999"
       variants={crossVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "18.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

StoreRemove01Icon.displayName = "StoreRemove01Icon";
export { StoreRemove01Icon };
