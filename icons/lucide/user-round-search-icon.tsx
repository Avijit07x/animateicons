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
export interface UserRoundSearchIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UserRoundSearchIconProps extends Omit<
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

const UserRoundSearchIcon = forwardRef<
 UserRoundSearchIconHandle,
 UserRoundSearchIconProps
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

  const bodyVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [60, 0],
    opacity: [0.3, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut" as const,
    },
   },
  };

  const headVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.6, 1.2, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut" as const,
    },
   },
  };

  const searchVariants: Variants = {
   normal: { x: 0, y: 0, rotate: 0, opacity: 1 },
   animate: {
    x: [0, 2, -2, 1, 0],
    y: [0, -1, 2, -1, 0],
    rotate: [0, 6, -6, 4, 0],
    transition: {
     duration: 1.2 * duration,
     ease: "easeInOut" as const,
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
      className="lucide lucide-user-round-search-icon lucide-user-round-search"
     >
      <m.circle
       cx="10"
       cy="8"
       r="5"
       variants={headVariants}
       initial="normal"
       animate={controls}
      />
      <m.path
       d="M2 21a8 8 0 0 1 10.434-7.62"
       strokeDasharray="60"
       strokeDashoffset="60"
       variants={bodyVariants}
       initial="normal"
       animate={controls}
      />
      <m.g variants={searchVariants} initial="normal" animate={controls}>
       <m.circle cx="18" cy="18" r="3" />
       <m.path d="m22 22-1.9-1.9" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

UserRoundSearchIcon.displayName = "UserRoundSearchIcon";
export { UserRoundSearchIcon };
