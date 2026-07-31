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
export interface ShoppingBagIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShoppingBagIconProps extends Omit<
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

const ShoppingBagIcon = forwardRef<ShoppingBagIconHandle, ShoppingBagIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );
  const bagVariants: Variants = {
   normal: { scaleX: 1, scaleY: 1, y: 0 },
   animate: {
    y: [-6, 0, 0, 0, 0],
    scaleY: [1, 1, 0.86, 1.05, 1],
    scaleX: [1, 1, 1.12, 0.97, 1],
    transition: {
     duration: 0.7 * duration,
     times: [0, 0.4, 0.55, 0.78, 1],
     ease: "easeOut",
    },
   },
  };

  const handleVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.4, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.35 * duration,
     delay: 0.42 * duration,
     times: [0, 0.6, 1],
     ease: "easeOut",
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
       variants={bagVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "22px" }}
      >
       <m.path
        d="M16 10a4 4 0 0 1-8 0"
        variants={handleVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "11px" }}
       />
       <path d="M3.103 6.034h17.794" />
       <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShoppingBagIcon.displayName = "ShoppingBagIcon";
export { ShoppingBagIcon };
