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
export interface Sorting01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Sorting01IconProps extends Omit<
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

const Sorting01Icon = forwardRef<Sorting01IconHandle, Sorting01IconProps>(
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

  const rowVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.55, 1],
    transition: {
     duration: 0.5 * duration,
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
      <m.path
       d="M11.0001 4H21.0001"
       variants={rowVariants(0)}
       style={{ transformBox: "view-box", originX: "11px", originY: "4px" }}
      />
      <m.path
       d="M11.0001 8L19.0001 8.00006"
       variants={rowVariants(0.1)}
       style={{ transformBox: "view-box", originX: "11px", originY: "8px" }}
      />
      <m.path
       d="M11.0001 12H16.0001"
       variants={rowVariants(0.2)}
       style={{ transformBox: "view-box", originX: "11px", originY: "12px" }}
      />
      <m.path
       d="M11.0001 16H14.0001"
       variants={rowVariants(0.3)}
       style={{ transformBox: "view-box", originX: "11px", originY: "16px" }}
      />
      <path d="M5.5 21V3M5.5 21C4.79977 21 3.49153 19.0057 3 18.5M5.5 21C6.20023 21 7.50847 19.0057 8 18.5" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Sorting01Icon.displayName = "Sorting01Icon";
export { Sorting01Icon };
