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

export interface FingerprintPatternIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FingerprintPatternIconProps extends Omit<
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

const FingerprintPatternIcon = forwardRef<
 FingerprintPatternIconHandle,
 FingerprintPatternIconProps
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

  const ridgeVariants: Variants = {
   normal: { scale: 1 },
   animate: ([delay, amp]: number[]) => ({
    scale: [1, amp, 0.98, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
     delay: delay * duration,
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
       d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"
       variants={ridgeVariants}
       custom={[0, 1.1]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M14 13.12c0 2.38 0 6.38-1 8.88"
       variants={ridgeVariants}
       custom={[0.05, 1.1]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M17.29 21.02c.12-.6.43-2.3.5-3.02"
       variants={ridgeVariants}
       custom={[0.15, 1.06]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M2 12a10 10 0 0 1 18-6"
       variants={ridgeVariants}
       custom={[0.22, 1.05]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M2 16h.01"
       variants={ridgeVariants}
       custom={[0.25, 1.05]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M21.8 16c.2-2 .131-5.354 0-6"
       variants={ridgeVariants}
       custom={[0.2, 1.05]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"
       variants={ridgeVariants}
       custom={[0.12, 1.08]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M8.65 22c.21-.66.45-1.32.57-2"
       variants={ridgeVariants}
       custom={[0.15, 1.06]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M9 6.8a6 6 0 0 1 9 5.2v2"
       variants={ridgeVariants}
       custom={[0.08, 1.09]}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FingerprintPatternIcon.displayName = "FingerprintPatternIcon";
export { FingerprintPatternIcon };
