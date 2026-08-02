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
export interface FileArchiveIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FileArchiveIconProps extends Omit<
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

const FileArchiveIcon = forwardRef<FileArchiveIconHandle, FileArchiveIconProps>(
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
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const outlineVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.5 * duration, ease: [0.16, 1, 0.3, 1] },
   },
  };

  const notchVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.3 * duration,
     delay: (0.18 + i * 0.1) * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
    },
   }),
  };

  const pullVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0, 1.15, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.4 * duration,
     delay: 0.5 * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
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
       d="M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5"
       variants={outlineVariants}
      />
      <m.path d="M14 2v5a1 1 0 0 0 1 1h5" variants={outlineVariants} />
      <m.path
       d="M8 7V6"
       custom={0}
       variants={notchVariants}
       style={{ transformBox: "view-box", originX: "8px", originY: "6.5px" }}
      />
      <m.path
       d="M8 12v-1"
       custom={1}
       variants={notchVariants}
       style={{ transformBox: "view-box", originX: "8px", originY: "11.5px" }}
      />
      <m.path
       d="M8 18v-2"
       custom={2}
       variants={notchVariants}
       style={{ transformBox: "view-box", originX: "8px", originY: "17px" }}
      />
      <m.circle
       cx="8"
       cy="20"
       r="2"
       variants={pullVariants}
       style={{ transformBox: "view-box", originX: "8px", originY: "20px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FileArchiveIcon.displayName = "FileArchiveIcon";
export { FileArchiveIcon };
