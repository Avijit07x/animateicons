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

export interface FileScanIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FileScanIconProps extends Omit<
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

const FLIP_FRAMES = Array.from({ length: 49 }, (_, i) => {
 const eased = (1 - Math.cos(Math.PI * (i / 48))) / 2;
 return Math.cos(2 * Math.PI * eased);
});

const FileScanIcon = forwardRef<FileScanIconHandle, FileScanIconProps>(
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

  const cornerVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: ([dx, dy]: number[]) => ({
    x: [0, dx, -dx * 0.4, 0],
    y: [0, dy, -dy * 0.4, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   }),
  };

  const flipVariants: Variants = {
   normal: { scaleX: 1, transition: { duration: 0 } },
   animate: {
    scaleX: FLIP_FRAMES,
    transition: {
     duration: 0.9 * duration,
     ease: "linear",
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
      <m.g
       variants={flipVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M20 10V8a2.4 2.4 0 0 0-.706-1.704l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4.35" />
       <path d="M14 2v5a1 1 0 0 0 1 1h5" />
       <m.path
        d="M16 14a2 2 0 0 0-2 2"
        variants={cornerVariants}
        custom={[1, 1]}
       />
       <m.path
        d="M16 22a2 2 0 0 1-2-2"
        variants={cornerVariants}
        custom={[1, -1]}
       />
       <m.path
        d="M20 14a2 2 0 0 1 2 2"
        variants={cornerVariants}
        custom={[-1, 1]}
       />
       <m.path
        d="M20 22a2 2 0 0 0 2-2"
        variants={cornerVariants}
        custom={[-1, -1]}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FileScanIcon.displayName = "FileScanIcon";
export { FileScanIcon };
