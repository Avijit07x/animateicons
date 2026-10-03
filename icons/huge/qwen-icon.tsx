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
export interface QwenIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface QwenIconProps extends Omit<
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

const QwenIcon = forwardRef<QwenIconHandle, QwenIconProps>(
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

  const pulseVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.07, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const triangleVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 360],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
       d="M9 2H12.5L14 4.5H19.13L20.5 7M22 14.5L20.3545 17.163H17.8782L15.0001 22H11.7825M5 20L3.5 17.5L4.5 14.5L2 9.5L4 7"
       variants={pulseVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M19.1901 9.66219L20.5001 7.0008H9.99996L11 5.0004L8.99996 2.0004L6.74874 7.0008H4.00006L8.99996 17.0004H5.99996L4.99996 20.0004H10.5L11.7516 22.0004L17.4017 12.0659L18.9401 14.5004H22L19.1901 9.66219Z"
       variants={pulseVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M12.0001 15.5L9.00006 10H15.0001L12.0001 15.5Z"
       variants={triangleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "11.83px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

QwenIcon.displayName = "QwenIcon";
export { QwenIcon };
