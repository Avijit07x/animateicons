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
export interface ClockFadingIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ClockFadingIconProps extends Omit<
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

const ClockFadingIcon = forwardRef<ClockFadingIconHandle, ClockFadingIconProps>(
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

  const minuteVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 360],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  const pieceVariants: Variants = {
   normal: { opacity: 1 },
   animate: (i: number) => ({
    opacity: [1, 0.25, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: i * 0.1 * duration,
    },
   }),
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
       d="M12 2a10 10 0 0 1 7.38 16.75"
       variants={pieceVariants}
       custom={0}
      />
      <m.path
       d="M8.644 21.42a10 10 0 0 0 7.631-.38"
       variants={pieceVariants}
       custom={1}
      />
      <m.path
       d="M2.83 16a10 10 0 0 0 2.43 3.4"
       variants={pieceVariants}
       custom={2}
      />
      <m.path
       d="M2.5 8.875a10 10 0 0 0-.5 3"
       variants={pieceVariants}
       custom={3}
      />
      <m.path
       d="M4.636 5.235a10 10 0 0 1 .891-.857"
       variants={pieceVariants}
       custom={4}
      />
      <m.path
       d="M12 6V12"
       variants={minuteVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <path d="M12 12l4 2" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ClockFadingIcon.displayName = "ClockFadingIcon";
export { ClockFadingIcon };
