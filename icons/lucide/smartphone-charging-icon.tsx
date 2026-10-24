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
export interface SmartphoneChargingIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SmartphoneChargingIconProps extends Omit<
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

const SmartphoneChargingIcon = forwardRef<
 SmartphoneChargingIconHandle,
 SmartphoneChargingIconProps
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

  const buzzVariants: Variants = {
   normal: { x: 0, rotate: 0 },
   animate: {
    x: [0, -1, 1, -0.5, 0],
    rotate: [0, -4, 4, -2, 0],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const boltVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [1, 1.18, 0.96, 1],
    opacity: [1, 0.45, 1, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
      <m.g
       variants={buzzVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
       <m.path
        d="M12.667 8 10 12h4l-2.667 4"
        variants={boltVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SmartphoneChargingIcon.displayName = "SmartphoneChargingIcon";
export { SmartphoneChargingIcon };
