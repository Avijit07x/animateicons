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
export interface LayoutDashboardIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LayoutDashboardIconProps extends Omit<
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

const LayoutDashboardIcon = forwardRef<
 LayoutDashboardIconHandle,
 LayoutDashboardIconProps
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

  const tileVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.85, 1.05, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
       d="M2.49634 5.5C2.49634 4.08579 2.49634 3.37868 2.93568 2.93934C3.37502 2.5 4.08212 2.5 5.49634 2.5H6.99616C8.41037 2.5 9.11748 2.5 9.55682 2.93934C9.99616 3.37868 9.99616 4.08579 9.99616 5.5V10C9.99616 11.4142 9.99616 12.1213 9.55682 12.5607C9.11748 13 8.41037 13 6.99616 13H5.49634C4.08212 13 3.37502 13 2.93568 12.5607C2.49634 12.1213 2.49634 11.4142 2.49634 10V5.5Z"
       variants={tileVariants(0)}
       style={{
        transformBox: "view-box",
        originX: "6.25px",
        originY: "7.75px",
       }}
      />
      <m.path
       d="M2.49616 19.2501C2.49613 18.5512 2.49611 18.2017 2.61029 17.926C2.76252 17.5585 3.05454 17.2664 3.42209 17.1142C3.69775 17 4.04722 17 4.74616 17H7.74597C8.44486 17 8.7943 17 9.06996 17.1142C9.43749 17.2664 9.7295 17.5584 9.88175 17.9259C9.99593 18.2016 9.99595 18.551 9.99597 19.2499C9.996 19.9488 9.99602 20.2983 9.88184 20.574C9.72961 20.9415 9.43759 21.2336 9.07004 21.3858C8.79438 21.5 8.44491 21.5 7.74597 21.5H4.74616C4.04727 21.5 3.69783 21.5 3.42217 21.3858C3.05464 21.2336 2.76263 20.9416 2.61038 20.5741C2.4962 20.2984 2.49618 19.949 2.49616 19.2501Z"
       variants={tileVariants(0.2)}
       style={{
        transformBox: "view-box",
        originX: "6.25px",
        originY: "19.25px",
       }}
      />
      <m.path
       d="M13.9962 4.75C13.9962 4.05109 13.9962 3.70163 14.1103 3.42597C14.2626 3.05843 14.5546 2.76642 14.9221 2.61418C15.1978 2.5 15.5472 2.5 16.2462 2.5H19.246C19.9449 2.5 20.2943 2.5 20.57 2.61418C20.9375 2.76642 21.2296 3.05843 21.3818 3.42597C21.496 3.70163 21.496 4.05109 21.496 4.75C21.496 5.44891 21.496 5.79837 21.3818 6.07403C21.2296 6.44157 20.9375 6.73358 20.57 6.88582C20.2943 7 19.9449 7 19.246 7H16.2462C15.5472 7 15.1978 7 14.9221 6.88582C14.5546 6.73358 14.2626 6.44157 14.1103 6.07403C13.9962 5.79837 13.9962 5.44891 13.9962 4.75Z"
       variants={tileVariants(0.1)}
       style={{
        transformBox: "view-box",
        originX: "17.75px",
        originY: "4.75px",
       }}
      />
      <m.path
       d="M13.9962 14.0001C13.9962 12.5858 13.9962 11.8787 14.4355 11.4393C14.8749 11 15.582 11 16.9962 11H18.496C19.9102 11 20.6173 11 21.0567 11.4393C21.496 11.8787 21.496 12.5858 21.496 13.9999L21.4961 18.4999C21.4961 19.9142 21.4961 20.6213 21.0568 21.0607C20.6175 21.5 19.9103 21.5 18.4961 21.5H16.9963C15.5821 21.5 14.875 21.5 14.4357 21.0607C13.9963 20.6213 13.9963 19.9142 13.9963 18.5001L13.9962 14.0001Z"
       variants={tileVariants(0.3)}
       style={{
        transformBox: "view-box",
        originX: "17.75px",
        originY: "16.25px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LayoutDashboardIcon.displayName = "LayoutDashboardIcon";
export { LayoutDashboardIcon };
