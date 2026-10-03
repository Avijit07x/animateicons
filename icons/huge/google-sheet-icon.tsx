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
export interface GoogleSheetIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GoogleSheetIconProps extends Omit<
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

const GoogleSheetIcon = forwardRef<GoogleSheetIconHandle, GoogleSheetIconProps>(
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

  const pageVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 0.4 * duration, ease: "easeInOut" },
   },
  };

  const drawVariants = (
   length: number,
   delay: number,
   dur = 0.35,
  ): Variants => ({
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    transition: {
     duration: dur * duration,
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
       d="M15 2.5V4C15 5.41421 15 6.12132 15.4393 6.56066C15.8787 7 16.5858 7 18 7H19.5"
       variants={pageVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14.1716C14.5803 2 14.7847 2 14.9685 2.07612C15.1522 2.15224 15.2968 2.29676 15.5858 2.58579L19.4142 6.41421C19.7032 6.70324 19.8478 6.84776 19.9239 7.03153C20 7.2153 20 7.41968 20 7.82843V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16Z"
       variants={pageVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M12 11V14M12 14V17M12 14H7.5M12 14H16.5M9.5 17H14.5C15.4428 17 15.9142 17 16.2071 16.7071C16.5 16.4142 16.5 15.9428 16.5 15V13C16.5 12.0572 16.5 11.5858 16.2071 11.2929C15.9142 11 15.4428 11 14.5 11H9.5C8.55719 11 8.08579 11 7.79289 11.2929C7.5 11.5858 7.5 12.0572 7.5 13V15C7.5 15.9428 7.5 16.4142 7.79289 16.7071C8.08579 17 8.55719 17 9.5 17Z"
       strokeDasharray="44"
       strokeDashoffset="0"
       variants={drawVariants(44, 0.1, 0.45)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GoogleSheetIcon.displayName = "GoogleSheetIcon";
export { GoogleSheetIcon };
