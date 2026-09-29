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
export interface DiscountTag01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DiscountTag01IconProps extends Omit<
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

const DiscountTag01Icon = forwardRef<
 DiscountTag01IconHandle,
 DiscountTag01IconProps
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

  const swingVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 8, -3, 0],
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
      <m.g
       variants={swingVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "2px" }}
      >
       <path d="M17.2426 6.24264L13.7071 2.70711C13.2544 2.25435 12.6403 2 12 2C11.3597 2 10.7456 2.25435 10.2929 2.70711L6.75736 6.24264C5.89027 7.10973 5.45672 7.54328 5.22836 8.09459C5 8.6459 5 9.25903 5 10.4853V16C5 18.8284 5 20.2426 5.87868 21.1213C6.75736 22 8.17157 22 11 22H13C15.8284 22 17.2426 22 18.1213 21.1213C19 20.2426 19 18.8284 19 16V10.4853C19 9.25903 19 8.6459 18.7716 8.09459C18.5433 7.54328 18.1097 7.10973 17.2426 6.24264Z" />
       <path d="M12.25 7H12M12.5 7C12.5 7.27614 12.2761 7.5 12 7.5C11.7239 7.5 11.5 7.27614 11.5 7C11.5 6.72386 11.7239 6.5 12 6.5C12.2761 6.5 12.5 6.72386 12.5 7Z" />
       <path d="M14.5 13L9.5 18" />
       <path d="M9.875 13.25H9.75M10 13.25C10 13.3881 9.88807 13.5 9.75 13.5C9.61193 13.5 9.5 13.3881 9.5 13.25C9.5 13.1119 9.61193 13 9.75 13C9.88807 13 10 13.1119 10 13.25Z" />
       <path d="M14.375 17.75H14.25M14.5 17.75C14.5 17.8881 14.3881 18 14.25 18C14.1119 18 14 17.8881 14 17.75C14 17.6119 14.1119 17.5 14.25 17.5C14.3881 17.5 14.5 17.6119 14.5 17.75Z" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DiscountTag01Icon.displayName = "DiscountTag01Icon";
export { DiscountTag01Icon };
