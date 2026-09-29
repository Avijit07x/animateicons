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
export interface LightbulbIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LightbulbIconProps extends Omit<
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

const LightbulbIcon = forwardRef<LightbulbIconHandle, LightbulbIconProps>(
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

  const bulbVariants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [1, 0.35, 1, 0.55, 1],
    scale: [1, 1.05, 1, 1.05, 1],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const glowVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.2, 1, 0.4, 1],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
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
       d="M15.4812 16.9043C15.48 16.7344 15.4793 16.6494 15.4796 16.6252C15.4889 15.5876 15.6101 15.2943 16.3363 14.553C16.3532 14.5357 16.5411 14.35 16.917 13.9785C18.2007 12.7095 18.9961 10.9476 18.9961 9C18.9961 5.13401 15.8621 2 11.9961 2C8.1301 2 4.99609 5.13401 4.99609 9C4.99609 10.948 5.79184 12.7102 7.07601 13.9792C7.46075 14.3594 7.65312 14.5495 7.67314 14.5701C8.38589 15.3019 8.50393 15.5845 8.52348 16.6059C8.52402 16.6345 8.52402 16.7241 8.52402 16.9033C8.52402 16.9931 8.52402 17.038 8.52547 17.0759C8.56516 18.1209 9.40314 18.9589 10.4481 18.9986C10.486 19 10.5309 19 10.6207 19H13.4004C13.4759 19 13.5137 19 13.5456 18.999C14.6056 18.9652 15.4549 18.1098 15.4812 17.0495C15.482 17.0176 15.4817 16.9799 15.4812 16.9043Z"
       variants={bulbVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "10px" }}
      />
      <path d="M9.99609 19V20C9.99609 21.1046 10.8915 22 11.9961 22C13.1007 22 13.9961 21.1046 13.9961 20V19" />
      <m.path d="M8.49609 16H15.4961" variants={glowVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LightbulbIcon.displayName = "LightbulbIcon";
export { LightbulbIcon };
