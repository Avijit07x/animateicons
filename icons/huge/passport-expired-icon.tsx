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
export interface PassportExpiredIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PassportExpiredIconProps extends Omit<
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

const PassportExpiredIcon = forwardRef<
 PassportExpiredIconHandle,
 PassportExpiredIconProps
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

  const crossVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 90],
    scale: [1, 1.3, 1],
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
      <path d="M22 11V13C22 17.2426 22 19.364 20.5355 20.682C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.682C2 19.364 2 17.2426 2 13C2 8.75736 2 6.63604 3.46447 5.31802C4.92893 4 7.28595 4 12 4H13" />
      <m.path
       d="M5 17.5C6.20831 14.9189 10.7122 14.7491 12 17.5M10.5 10.5C10.5 11.6046 9.60457 12.5 8.5 12.5C7.39543 12.5 6.5 11.6046 6.5 10.5C6.5 9.39543 7.39543 8.5 8.5 8.5C9.60457 8.5 10.5 9.39543 10.5 10.5Z"
       variants={personVariants}
       style={{ transformBox: "view-box", originX: "8.5px", originY: "13px" }}
      />
      <m.path
       d="M16 2L19 5M19 5L22 8M19 5L16 8M19 5L22 2"
       variants={crossVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PassportExpiredIcon.displayName = "PassportExpiredIcon";
export { PassportExpiredIcon };
