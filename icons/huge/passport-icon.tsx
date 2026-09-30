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
export interface PassportIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PassportIconProps extends Omit<
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

const PassportIcon = forwardRef<PassportIconHandle, PassportIconProps>(
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

  const personVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.15, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
    },
   },
  };

  const lineOneVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [5, 0],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: 0.05 * duration,
    },
   },
  };

  const lineTwoVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [5, 0],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
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
      <path d="M2 12C2 7.75736 2 5.63604 3.46447 4.31802C4.92893 3 7.28596 3 12 3C16.714 3 19.0711 3 20.5355 4.31802C22 5.63604 22 7.75736 22 12C22 16.2426 22 18.364 20.5355 19.682C19.0711 21 16.714 21 12 21C7.28596 21 4.92893 21 3.46447 19.682C2 18.364 2 16.2426 2 12Z" />
      <m.path
       d="M5 16.5C6.20831 13.9189 10.7122 13.7491 12 16.5M10.5 9.5C10.5 10.6046 9.60457 11.5 8.5 11.5C7.39543 11.5 6.5 10.6046 6.5 9.5C6.5 8.39543 7.39543 7.5 8.5 7.5C9.60457 7.5 10.5 8.39543 10.5 9.5Z"
       variants={personVariants}
       style={{ transformBox: "view-box", originX: "8.5px", originY: "12px" }}
      />
      <m.path
       d="M15 10H19"
       strokeDasharray="5"
       strokeDashoffset="0"
       variants={lineOneVariants}
      />
      <m.path
       d="M15 14H19"
       strokeDasharray="5"
       strokeDashoffset="0"
       variants={lineTwoVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PassportIcon.displayName = "PassportIcon";
export { PassportIcon };
