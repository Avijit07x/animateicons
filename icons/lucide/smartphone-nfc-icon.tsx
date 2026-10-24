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
export interface SmartphoneNfcIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SmartphoneNfcIconProps extends Omit<
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

const SmartphoneNfcIcon = forwardRef<
 SmartphoneNfcIconHandle,
 SmartphoneNfcIconProps
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

  const tapVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 8, -2, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const waveVariants: Variants = {
   normal: { x: 0 },
   animate: (i: number) => ({
    x: [0, 1.6, -0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: i * 0.09 * duration,
    },
   }),
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
      <m.rect
       width="7"
       height="12"
       x="2"
       y="6"
       rx="1"
       variants={tapVariants}
       style={{ transformBox: "view-box", originX: "5.5px", originY: "18px" }}
      />
      <m.path
       d="M13 8.32a7.43 7.43 0 0 1 0 7.36"
       variants={waveVariants}
       custom={0}
      />
      <m.path
       d="M16.46 6.21a11.76 11.76 0 0 1 0 11.58"
       variants={waveVariants}
       custom={1}
      />
      <m.path
       d="M19.91 4.1a15.91 15.91 0 0 1 .01 15.8"
       variants={waveVariants}
       custom={2}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SmartphoneNfcIcon.displayName = "SmartphoneNfcIcon";
export { SmartphoneNfcIcon };
