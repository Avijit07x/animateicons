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
export interface GoogleHomeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GoogleHomeIconProps extends Omit<
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

const GoogleHomeIcon = forwardRef<GoogleHomeIconHandle, GoogleHomeIconProps>(
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

  const bodyVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.06, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
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
       d="M22 11.2703C22 16.6439 17.5228 21 12 21C6.47715 21 2 16.6439 2 11.2703C2 8.76656 2.97195 6.48373 4.56875 4.75948C5.01425 4.27842 5.237 4.03789 5.88434 3.71276C6.53168 3.38764 6.98784 3.33859 7.90016 3.24048C9.0225 3.11979 10.5114 3 12 3C13.4886 3 14.9775 3.11979 16.0998 3.24048C17.0122 3.33859 17.4683 3.38764 18.1157 3.71276C18.763 4.03789 18.9857 4.27842 19.4313 4.75948C21.0281 6.48373 22 8.76656 22 11.2703Z"
       variants={bodyVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M18 4C18 5.10457 15.3137 6 12 6C8.68629 6 6 5.10457 6 4"
       strokeDasharray="14"
       strokeDashoffset="0"
       variants={drawVariants(14, 0.15, 0.4)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GoogleHomeIcon.displayName = "GoogleHomeIcon";
export { GoogleHomeIcon };
