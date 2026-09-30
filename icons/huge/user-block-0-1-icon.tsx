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
export interface UserBlock01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UserBlock01IconProps extends Omit<
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

const UserBlock01Icon = forwardRef<UserBlock01IconHandle, UserBlock01IconProps>(
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

  const blockVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 180],
    scale: [1, 1.2, 1],
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
      <path d="M11.995 13.5663L11 13.5C10.6446 13.5097 10.3134 13.5226 10.0008 13.5379C6.3 13.7193 3.28417 16.8058 3 20.5002" />
      <m.circle
       cx="11"
       cy="6.5"
       r="4"
       variants={headVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "6.5px" }}
      />
      <m.path
       d="M15.5 16L19.5 20M21 18C21 16.067 19.433 14.5 17.5 14.5C15.567 14.5 14 16.067 14 18C14 19.933 15.567 21.5 17.5 21.5C19.433 21.5 21 19.933 21 18Z"
       variants={blockVariants}
       style={{ transformBox: "view-box", originX: "17.5px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

UserBlock01Icon.displayName = "UserBlock01Icon";
export { UserBlock01Icon };
