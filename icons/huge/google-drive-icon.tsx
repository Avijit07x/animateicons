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
export interface GoogleDriveIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GoogleDriveIconProps extends Omit<
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

const GoogleDriveIcon = forwardRef<GoogleDriveIconHandle, GoogleDriveIconProps>(
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

  const outlineVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 1],
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
       d="M20.0165 19.4118L21.4236 16.8293C21.811 16.1181 22.0048 15.7625 21.9999 15.3776C21.995 14.9927 21.7923 14.642 21.3869 13.9404L15.9448 4.52296C15.5155 3.78003 15.3009 3.40856 14.9431 3.20428C14.5852 3 14.1493 3 13.2773 3H10.7227C9.85074 3 9.41475 3 9.05694 3.20428C8.69913 3.40856 8.48447 3.78003 8.05515 4.52296L2.61306 13.9404C2.20767 14.642 2.00497 14.9927 2.00009 15.3776C1.99521 15.7625 2.18895 16.1181 2.57643 16.8293L3.98351 19.4118C4.40512 20.1856 4.61592 20.5725 4.97988 20.7862C5.34384 21 5.7918 21 6.68772 21H17.3123C18.2082 21 18.6562 21 19.0201 20.7862C19.3841 20.5725 19.5949 20.1856 20.0165 19.4118Z"
       variants={outlineVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M9 4L16 15"
       strokeDasharray="14"
       strokeDashoffset="0"
       variants={drawVariants(14, 0.05)}
      />
      <m.path
       d="M5.5 20.5L12 9"
       strokeDasharray="14"
       strokeDashoffset="0"
       variants={drawVariants(14, 0.15)}
      />
      <m.path
       d="M21 15H9"
       strokeDasharray="12"
       strokeDashoffset="0"
       variants={drawVariants(12, 0.25)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GoogleDriveIcon.displayName = "GoogleDriveIcon";
export { GoogleDriveIcon };
