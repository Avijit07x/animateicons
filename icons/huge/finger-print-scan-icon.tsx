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
export interface FingerPrintScanIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FingerPrintScanIconProps extends Omit<
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

const FingerPrintScanIcon = forwardRef<
 FingerPrintScanIconHandle,
 FingerPrintScanIconProps
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

  const printVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     pathLength: { duration: 0.8 * duration, ease: "easeInOut" },
     opacity: { duration: 0.05 * duration },
    },
   },
  };

  const frameVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.86, 1.03, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
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
       d="M2 7.98608C2.10954 5.77584 2.43723 4.39781 3.41752 3.41752C4.39781 2.43723 5.77584 2.10954 7.98607 2M22 7.98608C21.8905 5.77584 21.5628 4.39781 20.5825 3.41752C19.6022 2.43723 18.2242 2.10954 16.0139 2M16.0139 22C18.2242 21.8905 19.6022 21.5628 20.5825 20.5825C21.5628 19.6022 21.8905 18.2242 22 16.0139M7.98607 22C5.77584 21.8905 4.39781 21.5628 3.41752 20.5825C2.43723 19.6022 2.10954 18.2242 2 16.0139"
       variants={frameVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M16.5146 8.9424C16.8317 9.51789 17 10.1516 17 10.7991V13.6806C17 14.8151 16.4641 15.9327 15.5355 16.7349C14.6069 17.5371 13.3132 18 12 18M7 11.2783V13.6809C6.9995 14.9393 7.65372 16.1769 8.801 17.002M14.5 6.57868C13.3516 6.00592 11.9869 5.8507 10.706 6.14718C9.42517 6.44365 8.33309 7.16753 7.67003 8.15958M13.6665 11.4782V10.5912C13.6765 9.95465 13.1333 9.38163 12.3951 9.23077M10.3335 11.8567V13.3805C10.3281 13.6611 10.4265 13.9363 10.6156 14.1694C11.2056 14.897 12.5258 14.9802 13.24 14.3226"
       variants={printVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FingerPrintScanIcon.displayName = "FingerPrintScanIcon";
export { FingerPrintScanIcon };
