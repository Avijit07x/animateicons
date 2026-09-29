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
export interface CookieIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CookieIconProps extends Omit<
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

const CookieIcon = forwardRef<CookieIconHandle, CookieIconProps>(
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

  const popVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.9, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const cookieVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -15, 10, -4, 0],
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
       variants={cookieVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M12.0579 22C16.9725 22 21.0638 18.4937 21.9416 13.8586C22.1996 12.4967 21.5931 12.5686 20.3101 12.3438C19.3996 12.1844 18.5498 11.5667 18.2333 10.588C18.0178 9.9216 17.9376 9.89475 17.2352 9.86554C15.7861 9.80529 14.625 8.2689 15.2032 7.02602C15.419 6.56236 15.412 6.50892 15.0078 6.19448C14.3005 5.6443 13.9706 4.6166 14.0978 3.62604C14.2347 2.5591 14.3147 2.1747 13.1854 2.05455C7.45657 1.44501 2 6.0196 2 11.9948C2 17.5205 6.50308 22 12.0579 22Z" />
       <m.path
        d="M12.0078 18L11.9988 18"
        variants={popVariants(0.1)}
        style={{ transformBox: "view-box", originX: "12px", originY: "18px" }}
       />
       <m.path
        d="M10 6L9 7"
        variants={popVariants(0.2)}
        style={{ transformBox: "view-box", originX: "9.5px", originY: "6.5px" }}
       />
       <m.path
        d="M17 14L16 15"
        variants={popVariants(0.3)}
        style={{
         transformBox: "view-box",
         originX: "16.5px",
         originY: "14.5px",
        }}
       />
       <m.path
        d="M7 15L8 16"
        variants={popVariants(0.4)}
        style={{
         transformBox: "view-box",
         originX: "7.5px",
         originY: "15.5px",
        }}
       />
       <m.path
        d="M11.125 12H11M11.25 12C11.25 12.1381 11.1381 12.25 11 12.25C10.8619 12.25 10.75 12.1381 10.75 12C10.75 11.8619 10.8619 11.75 11 11.75C11.1381 11.75 11.25 11.8619 11.25 12Z"
        variants={popVariants(0.5)}
        style={{ transformBox: "view-box", originX: "11px", originY: "12px" }}
       />
       <m.path
        d="M6.125 10H6M6.25 10C6.25 10.1381 6.13807 10.25 6 10.25C5.86193 10.25 5.75 10.1381 5.75 10C5.75 9.86193 5.86193 9.75 6 9.75C6.13807 9.75 6.25 9.86193 6.25 10Z"
        variants={popVariants(0.6)}
        style={{ transformBox: "view-box", originX: "6px", originY: "10px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CookieIcon.displayName = "CookieIcon";
export { CookieIcon };
