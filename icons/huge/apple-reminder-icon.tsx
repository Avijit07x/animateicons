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
export interface AppleReminderIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AppleReminderIconProps extends Omit<
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

const AppleReminderIcon = forwardRef<
 AppleReminderIconHandle,
 AppleReminderIconProps
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

  const dotsVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.5, 1],
    transition: { duration: 0.4 * duration, ease: "easeInOut" },
   },
  };

  const drawVariants = (
   length: number,
   delay: number,
   dur = 0.35,
  ): Variants => ({
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    transition: {
     duration: dur * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

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
      <path d="M3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3C16.2426 3 18.364 3 19.682 4.31802C21 5.63604 21 7.75736 21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682C3 18.364 3 16.2426 3 12Z" />
      <m.path
       d="M7.37545 7.99976H7.25045M7.37482 11.9999H7.24982M7.37498 15.9999H7.24998M7.50045 7.99976C7.50045 8.13783 7.38852 8.24976 7.25045 8.24976C7.11238 8.24976 7.00045 8.13783 7.00045 7.99976C7.00045 7.86169 7.11238 7.74976 7.25045 7.74976C7.38852 7.74976 7.50045 7.86169 7.50045 7.99976ZM7.49982 11.9999C7.49982 12.138 7.38789 12.2499 7.24982 12.2499C7.11175 12.2499 6.99982 12.138 6.99982 11.9999C6.99982 11.8618 7.11175 11.7499 7.24982 11.7499C7.38789 11.7499 7.49982 11.8618 7.49982 11.9999ZM7.49998 15.9999C7.49998 16.138 7.38805 16.2499 7.24998 16.2499C7.11191 16.2499 6.99998 16.138 6.99998 15.9999C6.99998 15.8618 7.11191 15.7499 7.24998 15.7499C7.38805 15.7499 7.49998 15.8618 7.49998 15.9999Z"
       variants={dotsVariants}
       style={{ transformBox: "view-box", originX: "7.25px", originY: "12px" }}
      />
      <m.path
       d="M11 8H17M11 12H17M11 16H17"
       strokeDasharray="6"
       strokeDashoffset="0"
       variants={drawVariants(6, 0.1, 0.4)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AppleReminderIcon.displayName = "AppleReminderIcon";
export { AppleReminderIcon };
