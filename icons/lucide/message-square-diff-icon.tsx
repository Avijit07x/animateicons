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
export interface MessageSquareDiffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MessageSquareDiffIconProps extends Omit<
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

const MessageSquareDiffIcon = forwardRef<
 MessageSquareDiffIconHandle,
 MessageSquareDiffIconProps
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

  const bubbleVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.7, 1.05, 1],
    transition: {
     duration: 0.65 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.75, 1],
    },
   },
  };

  const plusVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 180],
    scale: [1, 1.1, 1],
    transition: { duration: 0.95 * duration, ease: "easeInOut" },
   },
  };

  const minusVariants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.55, 1.05, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
     delay: 0.12 * duration,
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
       variants={bubbleVariants}
       style={{ transformBox: "view-box", originX: "4px", originY: "20px" }}
      >
       <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
       <m.g
        variants={plusVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
       >
        <path d="M10 9h4" />
        <path d="M12 7v4" />
       </m.g>
       <m.path
        d="M10 15h4"
        variants={minusVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "15px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MessageSquareDiffIcon.displayName = "MessageSquareDiffIcon";
export { MessageSquareDiffIcon };
