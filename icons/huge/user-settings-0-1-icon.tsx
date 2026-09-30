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
export interface UserSettings01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UserSettings01IconProps extends Omit<
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

const UserSettings01Icon = forwardRef<
 UserSettings01IconHandle,
 UserSettings01IconProps
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

  const cogVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 60],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const headVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.15, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
    },
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
      <path d="M11 13.5C10.6446 13.5097 10.3134 13.5226 10.0008 13.5379C6.3 13.7193 3.28417 16.8058 3 20.5002" />
      <m.path
       d="M19.6709 16.2593C19.8803 16.6249 20 17.0485 20 17.5C20 17.9514 19.8804 18.3749 19.671 18.7404C19.2402 19.493 18.4293 20 17.5 20M15.3291 16.2593C15.1197 16.6249 15 17.0485 15 17.5C15 17.9514 15.1196 18.3749 15.329 18.7404C15.7598 19.493 16.5707 20 17.5 20M17.5 20L17.5 21.5M17.5 15C18.4292 15 19.24 15.5069 19.6709 16.2593M17.5 15C16.5708 15 15.76 15.5069 15.3291 16.2593M17.5 15L17.5 13.5M21 15.4998L19.6709 16.2593M14 19.4998L15.329 18.7404M21 19.4998L19.671 18.7404M14 15.4998L15.3291 16.2593"
       variants={cogVariants}
       style={{
        transformBox: "view-box",
        originX: "17.5px",
        originY: "17.5px",
       }}
      />
      <m.circle
       cx="11"
       cy="6.5"
       r="4"
       variants={headVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "6.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

UserSettings01Icon.displayName = "UserSettings01Icon";
export { UserSettings01Icon };
