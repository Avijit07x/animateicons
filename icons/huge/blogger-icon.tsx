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
export interface BloggerIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BloggerIconProps extends Omit<
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

const BloggerIcon = forwardRef<BloggerIconHandle, BloggerIconProps>(
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

  const boxVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.94, 1.04, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.3, 0.7, 1],
    },
   },
  };

  const glyphVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.1, 0.97, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const lineVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
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
       d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
       variants={boxVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M14.9577 11.4622V10.5088C14.9577 8.63614 14.9577 7.69981 14.4825 7.04341C13.5821 5.79972 11.833 6.01409 10.4788 6.01409C9.12474 6.01409 7.37562 5.79972 6.47521 7.04341C6 7.69981 6 8.63614 6 10.5088V13.0059C6 15.3601 6 16.5373 6.72879 17.2686C7.45758 18 8.63055 18 10.9765 18H14.6862C17.285 18 18.3239 16.1725 17.913 13.5687C17.6684 12.0195 16.3315 11.4622 14.9577 11.4622Z"
       variants={glyphVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M10 10H11"
       variants={lineVariants(0.2)}
       style={{ transformBox: "view-box", originX: "10px", originY: "10px" }}
      />
      <m.path
       d="M10 15H14"
       variants={lineVariants(0.35)}
       style={{ transformBox: "view-box", originX: "10px", originY: "15px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BloggerIcon.displayName = "BloggerIcon";
export { BloggerIcon };
