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
export interface Moon01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Moon01IconProps extends Omit<
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

const Moon01Icon = forwardRef<Moon01IconHandle, Moon01IconProps>(
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

  const moonVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -14, 10, -4, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const craterVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.5, 1],
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
      <m.g
       variants={moonVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M21.0985 7.84477C20.458 8.55417 19.5311 9 18.5 9C16.567 9 15 7.433 15 5.5C15 4.46895 15.4458 3.54203 16.1552 2.90149M16.1552 2.90149C18.3384 3.90018 20.0998 5.66155 21.0985 7.84477C21.6774 9.11025 22 10.5174 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C13.4826 2 14.8898 2.32262 16.1552 2.90149Z" />
       <m.path
        d="M16 16C16 17.1046 15.1046 18 14 18C12.8954 18 12 17.1046 12 16C12 14.8954 12.8954 14 14 14C15.1046 14 16 14.8954 16 16Z"
        variants={craterVariants(0.1)}
        style={{ transformBox: "view-box", originX: "14px", originY: "16px" }}
       />
       <m.path
        d="M7.13086 14H7.00586M7.25586 14C7.25586 14.1381 7.14393 14.25 7.00586 14.25C6.86779 14.25 6.75586 14.1381 6.75586 14C6.75586 13.8619 6.86779 13.75 7.00586 13.75C7.14393 13.75 7.25586 13.8619 7.25586 14Z"
        variants={craterVariants(0.25)}
        style={{ transformBox: "view-box", originX: "7px", originY: "14px" }}
       />
       <m.path
        d="M10.1309 8H10.0059M10.2559 8C10.2559 8.13807 10.1439 8.25 10.0059 8.25C9.86779 8.25 9.75586 8.13807 9.75586 8C9.75586 7.86193 9.86779 7.75 10.0059 7.75C10.1439 7.75 10.2559 7.86193 10.2559 8Z"
        variants={craterVariants(0.4)}
        style={{ transformBox: "view-box", originX: "10px", originY: "8px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Moon01Icon.displayName = "Moon01Icon";
export { Moon01Icon };
