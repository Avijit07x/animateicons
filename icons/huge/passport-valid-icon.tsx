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
export interface PassportValidIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PassportValidIconProps extends Omit<
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

const PassportValidIcon = forwardRef<
 PassportValidIconHandle,
 PassportValidIconProps
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

  const checkVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [13, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.15 * duration,
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
      <path d="M12 3.5C7.28595 3.5 4.92893 3.5 3.46447 4.81802C2 6.13604 2 8.25736 2 12.5C2 16.7426 2 18.864 3.46447 20.182C4.92893 21.5 7.28595 21.5 12 21.5C16.714 21.5 19.0711 21.5 20.5355 20.182C22 18.864 22 16.7426 22 12.5C22 11.3538 22 8.5 22 8.5" />
      <m.path
       d="M5 17C6.20831 14.4189 10.7122 14.2491 12 17M10.5 10C10.5 11.1046 9.60457 12 8.5 12C7.39543 12 6.5 11.1046 6.5 10C6.5 8.89543 7.39543 8 8.5 8C9.60457 8 10.5 8.89543 10.5 10Z"
       variants={personVariants}
       style={{ transformBox: "view-box", originX: "8.5px", originY: "12.5px" }}
      />
      <m.path
       d="M14 6.5C14 6.5 15 6.5 16 8.5C16 8.5 19.1765 3.5 22 2.5"
       strokeDasharray="13"
       strokeDashoffset="0"
       variants={checkVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PassportValidIcon.displayName = "PassportValidIcon";
export { PassportValidIcon };
