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
export interface WandSparklesIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WandSparklesIconProps extends Omit<
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

const WandSparklesIcon = forwardRef<
 WandSparklesIconHandle,
 WandSparklesIconProps
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

  const wandVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -8, 5, -2, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const sparkleVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [1, 0, 1.3, 1],
    opacity: [1, 0, 1, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeOut",
     times: [0, 0.25, 0.65, 1],
     delay: (0.15 + i * 0.12) * duration,
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
      <m.g
       variants={wandVariants}
       style={{ transformBox: "view-box", originX: "3px", originY: "21px" }}
      >
       <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
       <path d="m14 7 3 3" />
      </m.g>
      <m.g
       variants={sparkleVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "5px", originY: "8px" }}
      >
       <path d="M5 6v4" />
       <path d="M7 8H3" />
      </m.g>
      <m.g
       variants={sparkleVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "10px", originY: "3px" }}
      >
       <path d="M10 2v2" />
       <path d="M11 3H9" />
      </m.g>
      <m.g
       variants={sparkleVariants}
       custom={2}
       style={{ transformBox: "view-box", originX: "19px", originY: "16px" }}
      >
       <path d="M19 14v4" />
       <path d="M21 16h-4" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

WandSparklesIcon.displayName = "WandSparklesIcon";
export { WandSparklesIcon };
