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
export interface QuoteIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface QuoteIconProps extends Omit<
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

const QuoteIcon = forwardRef<QuoteIconHandle, QuoteIconProps>(
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

  const popVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.25, 1],
    transition: {
     duration: 0.4 * duration,
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
       d="M5.99219 5.75C8.20132 5.75 9.99219 7.63509 9.99219 9.96101C9.99219 13.0258 8.57833 15.7433 6.39979 17.4295C5.61672 18.0357 5.22518 18.3387 4.95877 18.2272C4.87752 18.1932 4.80451 18.1362 4.75143 18.0654C4.57737 17.8331 4.8036 17.2896 5.25607 16.2028C5.50059 15.6154 5.62285 15.3217 5.57711 15.0357C5.55871 14.9206 5.54279 14.8689 5.49331 14.7636C5.37036 14.5018 4.88084 14.1853 3.9018 13.5523C2.75622 12.8116 1.99219 11.4802 1.99219 9.96101C1.99219 8.47071 2.72729 7.16135 3.83662 6.41291C4.45869 5.99345 5.19849 5.75 5.99219 5.75Z"
       variants={popVariants(0)}
       style={{ transformBox: "view-box", originX: "6px", originY: "12px" }}
      />
      <m.path
       d="M17.9922 5.75C20.2013 5.75 21.9922 7.63509 21.9922 9.96101C21.9922 13.0258 20.5783 15.7433 18.3998 17.4295C17.6167 18.0357 17.2252 18.3387 16.9588 18.2272C16.8775 18.1932 16.8045 18.1362 16.7514 18.0654C16.5774 17.8331 16.8036 17.2896 17.2561 16.2028C17.5006 15.6154 17.6228 15.3217 17.5771 15.0357C17.5587 14.9206 17.5428 14.8689 17.4933 14.7636C17.3704 14.5018 16.8808 14.1853 15.9018 13.5523C14.7562 12.8116 13.9922 11.4802 13.9922 9.96101C13.9922 8.47071 14.7273 7.16135 15.8366 6.41291C16.4587 5.99345 17.1985 5.75 17.9922 5.75Z"
       variants={popVariants(0.15)}
       style={{ transformBox: "view-box", originX: "18px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

QuoteIcon.displayName = "QuoteIcon";
export { QuoteIcon };
