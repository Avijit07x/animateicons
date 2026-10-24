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
export interface MessageSquareLockIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MessageSquareLockIconProps extends Omit<
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

const MessageSquareLockIcon = forwardRef<
 MessageSquareLockIconHandle,
 MessageSquareLockIconProps
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

  const shackleVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0.5, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.45, 0.72, 1],
     delay: 0.1 * duration,
    },
   },
  };

  const lockVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 1, 0.88, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.45, 0.72, 1],
     delay: 0.1 * duration,
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
       <path d="M22 8.5V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H10" />
       <m.path d="M20 15v-2a2 2 0 0 0-4 0v2" variants={shackleVariants} />
       <m.rect
        x="14"
        y="15"
        width="8"
        height="5"
        rx="1"
        variants={lockVariants}
        style={{ transformBox: "view-box", originX: "18px", originY: "20px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MessageSquareLockIcon.displayName = "MessageSquareLockIcon";
export { MessageSquareLockIcon };
