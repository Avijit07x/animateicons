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
export interface Coupon01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Coupon01IconProps extends Omit<
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

const Coupon01Icon = forwardRef<Coupon01IconHandle, Coupon01IconProps>(
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

  const slashVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0.3, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const dotVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.8, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const couponVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -5, 4, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
       variants={couponVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <m.path
        d="M15 7.99805L9 13.998"
        strokeDasharray="9"
        strokeDashoffset="0"
        variants={slashVariants}
       />
       <path d="M14 1.99805H10C7.17157 1.99805 5.75736 1.99805 4.87868 2.87673C4 3.75541 4 5.16962 4 7.99805V19.5741C4 20.4277 4 20.8545 4.16333 21.104C4.34401 21.38 4.64917 21.5491 4.97898 21.5561C5.27712 21.5623 5.63906 21.3361 6.36294 20.8837C6.9209 20.535 7.19989 20.3606 7.49648 20.2835C7.82667 20.1976 8.17333 20.1976 8.50352 20.2835C8.80011 20.3606 9.0791 20.535 9.63706 20.8837L10 21.1105C10.9126 21.6809 11.3689 21.9661 11.8736 21.998C11.9578 22.0034 12.0422 22.0034 12.1264 21.998C12.6311 21.9661 13.0874 21.6809 14 21.1105L14.3629 20.8837C14.9209 20.535 15.1999 20.3606 15.4965 20.2835C15.8267 20.1976 16.1733 20.1976 16.5035 20.2835C16.8001 20.3606 17.0791 20.535 17.6371 20.8837C18.3609 21.3361 18.7229 21.5623 19.021 21.5561C19.3508 21.5491 19.656 21.38 19.8367 21.104C20 20.8545 20 20.4277 20 19.5741V7.99805C20 5.16962 20 3.75541 19.1213 2.87673C18.2426 1.99805 16.8284 1.99805 14 1.99805Z" />
       <m.path
        d="M9.375 8.24805H9.25M9.5 8.24805C9.5 8.38612 9.38807 8.49805 9.25 8.49805C9.11193 8.49805 9 8.38612 9 8.24805C9 8.10998 9.11193 7.99805 9.25 7.99805C9.38807 7.99805 9.5 8.10998 9.5 8.24805Z"
        variants={dotVariants(0.1)}
        style={{
         transformBox: "view-box",
         originX: "9.25px",
         originY: "8.25px",
        }}
       />
       <m.path
        d="M14.875 13.748H14.75M15 13.748C15 13.8861 14.8881 13.998 14.75 13.998C14.6119 13.998 14.5 13.8861 14.5 13.748C14.5 13.61 14.6119 13.498 14.75 13.498C14.8881 13.498 15 13.61 15 13.748Z"
        variants={dotVariants(0.3)}
        style={{
         transformBox: "view-box",
         originX: "14.75px",
         originY: "13.75px",
        }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Coupon01Icon.displayName = "Coupon01Icon";
export { Coupon01Icon };
