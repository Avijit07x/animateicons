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
export interface Film01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Film01IconProps extends Omit<
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

const Film01Icon = forwardRef<Film01IconHandle, Film01IconProps>(
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

  const drawVariants = (length: number, delay: number): Variants => ({
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    transition: {
     duration: 0.3 * duration,
     ease: "easeOut",
     delay: delay * duration,
    },
   },
  });

  const frameVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
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
       d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
       variants={frameVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <path d="M2.5 7H21.5" />
      <path d="M2.5 17H21.5" />
      <m.path
       d="M12 17L12 7"
       strokeDasharray="10"
       strokeDashoffset="0"
       variants={drawVariants(10, 0.12)}
      />
      <m.path
       d="M8 7L8 3"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={drawVariants(4, 0)}
      />
      <m.path
       d="M16 7L16 3"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={drawVariants(4, 0)}
      />
      <m.path
       d="M8 21L8 17"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={drawVariants(4, 0.24)}
      />
      <m.path
       d="M16 21L16 17"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={drawVariants(4, 0.24)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Film01Icon.displayName = "Film01Icon";
export { Film01Icon };
