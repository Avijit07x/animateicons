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
export interface GamepadIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GamepadIconProps extends Omit<
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

const GamepadIcon = forwardRef<GamepadIconHandle, GamepadIconProps>(
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

  const rumbleVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -4, 4, -3, 2, 0],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const padVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.7, 1.08, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const buttonVariants = (index: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 2, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: (0.15 + 0.18 * index) * duration,
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
      <m.g
       variants={rumbleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
       <m.g
        variants={padVariants}
        style={{ transformBox: "view-box", originX: "8px", originY: "11px" }}
       >
        <line x1="6" x2="10" y1="11" y2="11" />
        <line x1="8" x2="8" y1="9" y2="13" />
       </m.g>
       <m.line
        x1="15"
        x2="15.01"
        y1="12"
        y2="12"
        variants={buttonVariants(0)}
        style={{ transformBox: "view-box", originX: "15px", originY: "12px" }}
       />
       <m.line
        x1="18"
        x2="18.01"
        y1="10"
        y2="10"
        variants={buttonVariants(1)}
        style={{ transformBox: "view-box", originX: "18px", originY: "10px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GamepadIcon.displayName = "GamepadIcon";
export { GamepadIcon };
