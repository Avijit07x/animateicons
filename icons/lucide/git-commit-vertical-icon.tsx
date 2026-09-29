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
export interface GitCommitVerticalIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GitCommitVerticalIconProps extends Omit<
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

const GitCommitVerticalIcon = forwardRef<
 GitCommitVerticalIconHandle,
 GitCommitVerticalIconProps
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e);
   },
   [controls, onMouseLeave],
  );

  const topLineVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [7, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: { duration: 0.4 * duration, ease: "easeOut" },
     opacity: { duration: 0.25 * duration },
    },
   },
  };

  const bottomLineVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [-7, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: { duration: 0.4 * duration, ease: "easeOut" },
     opacity: { duration: 0.25 * duration },
    },
   },
  };

  const commitNodeVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.3, 0.92, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.3 * duration,
     times: [0, 0.4, 0.75, 1],
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
      <m.path
       d="M12 3v6"
       strokeDasharray="7"
       strokeDashoffset="0"
       variants={topLineVariants}
      />
      <m.circle
       cx="12"
       cy="12"
       r="3"
       variants={commitNodeVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M12 15v6"
       strokeDasharray="7"
       strokeDashoffset="0"
       variants={bottomLineVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GitCommitVerticalIcon.displayName = "GitCommitVerticalIcon";

export { GitCommitVerticalIcon };
