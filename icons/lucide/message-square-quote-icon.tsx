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
export interface MessageSquareQuoteIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MessageSquareQuoteIconProps extends Omit<
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

const MessageSquareQuoteIcon = forwardRef<
 MessageSquareQuoteIconHandle,
 MessageSquareQuoteIconProps
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

  const bubbleVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.7, 1.05, 1],
    transition: {
     duration: 0.65 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.75, 1],
    },
   },
  };

  const quoteVariants = (delay: number): Variants => ({
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0.6, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
      <m.g
       variants={bubbleVariants}
       style={{ transformBox: "view-box", originX: "4px", originY: "20px" }}
      >
       <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
       <m.path d="M8 14a2 2 0 0 0 2-2V8H8" variants={quoteVariants(0.15)} />
       <m.path d="M14 14a2 2 0 0 0 2-2V8h-2" variants={quoteVariants(0.25)} />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MessageSquareQuoteIcon.displayName = "MessageSquareQuoteIcon";
export { MessageSquareQuoteIcon };
