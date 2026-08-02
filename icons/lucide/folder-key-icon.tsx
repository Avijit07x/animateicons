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
export interface FolderKeyIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FolderKeyIconProps extends Omit<
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

const FolderKeyIcon = forwardRef<FolderKeyIconHandle, FolderKeyIconProps>(
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

  const liftVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 1],
    transition: {
     duration: 0.5 * duration,
     times: [0, 0.5, 1],
     ease: "easeInOut",
    },
   },
  };

  const keyVariants: Variants = {
   normal: { scale: 1, rotate: 0, opacity: 1 },
   animate: {
    scale: [0.3, 1.15, 1],
    rotate: [-40, 5, 0],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.6 * duration,
     delay: 0.14 * duration,
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
      variants={liftVariants}
      style={{ transformOrigin: "center" }}
     >
      <path d="M13 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.36" />
      <m.path
       d="M19 12v6"
       variants={keyVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "20px" }}
      />
      <m.path
       d="M19 14h2"
       variants={keyVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "20px" }}
      />
      <m.circle
       cx="19"
       cy="20"
       r="2"
       variants={keyVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "20px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FolderKeyIcon.displayName = "FolderKeyIcon";
export { FolderKeyIcon };
