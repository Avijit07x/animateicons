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
export interface CursorPointer01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CursorPointer01IconProps extends Omit<
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

const CursorPointer01Icon = forwardRef<
 CursorPointer01IconHandle,
 CursorPointer01IconProps
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

  const cursorVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.88, 1.02, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const rayVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.2, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.15 * duration,
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
      <m.path
       d="M12.0033 19.4056L9.88486 13.3197L9.88485 13.3197C9.08816 11.031 8.68981 9.88664 9.28857 9.28834C9.88733 8.69005 11.0326 9.08809 13.3231 9.88417L19.401 11.9966C20.6716 12.4382 21.3069 12.659 21.4441 13.0867C21.4819 13.2045 21.4949 13.329 21.4824 13.4521C21.4369 13.8989 20.8612 14.2464 19.7097 14.9415C18.9714 15.3872 18.6023 15.61 18.5039 15.9462C18.476 16.0414 18.4641 16.1405 18.4686 16.2396C18.4845 16.5896 18.7902 16.8935 19.4018 17.5012L21.4116 19.4988L21.4117 19.4988C21.7125 19.7979 21.863 19.9474 21.932 20.1147C22.0223 20.3335 22.0227 20.5792 21.9329 20.7983C21.8644 20.9657 21.7143 21.1157 21.4142 21.4155L21.4142 21.4156C21.1148 21.7147 20.9652 21.8642 20.7979 21.9328C20.5791 22.0224 20.3337 22.0224 20.1149 21.9328C19.9476 21.8642 19.7979 21.7147 19.4986 21.4156L19.4986 21.4155L17.4812 19.3998L17.4812 19.3998C16.8797 18.7987 16.5789 18.4982 16.2338 18.4802C16.1293 18.4747 16.0247 18.4875 15.9246 18.5179C15.594 18.6185 15.3745 18.9825 14.9355 19.7106L14.9355 19.7106C14.2491 20.8492 13.9059 21.4185 13.4653 21.4686C13.3353 21.4833 13.2037 21.4696 13.0796 21.4284C12.6588 21.2887 12.4403 20.661 12.0033 19.4056Z"
       variants={cursorVariants}
       style={{ transformBox: "view-box", originX: "9.5px", originY: "9.5px" }}
      />
      <m.path
       d="M10.8576 7.08329C11.0714 7.43808 11.5323 7.55239 11.8871 7.33861C12.2419 7.12483 12.3562 6.66392 12.1424 6.30913L10.8576 7.08329ZM6.30914 12.1424C6.66392 12.3562 7.12483 12.2419 7.33861 11.8871C7.55239 11.5323 7.43808 11.0714 7.08329 10.8576L6.30914 12.1424ZM5.75 8.5C5.75 6.98122 6.98123 5.75 8.5 5.75V4.25C6.15281 4.25 4.25 6.15279 4.25 8.5H5.75ZM8.5 5.75C9.49944 5.75 10.3752 6.28272 10.8576 7.08329L12.1424 6.30913C11.3999 5.07687 10.0469 4.25 8.5 4.25V5.75ZM7.08329 10.8576C6.28272 10.3752 5.75 9.49945 5.75 8.5H4.25C4.25 10.0469 5.07688 11.3999 6.30914 12.1424L7.08329 10.8576Z"
       fill="currentColor"
       stroke="none"
       variants={rayVariants}
      />
      <m.path
       d="M14.2515 8.13498C14.2778 8.54836 14.6342 8.86216 15.0476 8.83587C15.461 8.80958 15.7748 8.45316 15.7485 8.03979L14.2515 8.13498ZM8.04118 15.7485C8.45457 15.7747 8.81093 15.4608 8.83714 15.0475C8.86335 14.6341 8.54948 14.2777 8.1361 14.2515L8.04118 15.7485ZM2.75 8.50661C2.75 5.32733 5.32736 2.75 8.50664 2.75V1.25C4.49895 1.25 1.25 4.49889 1.25 8.50661H2.75ZM8.50664 2.75C11.561 2.75 14.0604 5.12926 14.2515 8.13498L15.7485 8.03979C15.5074 4.24925 12.3576 1.25 8.50664 1.25V2.75ZM8.1361 14.2515C5.12986 14.0609 2.75 11.5614 2.75 8.50661H1.25C1.25 12.358 4.25002 15.5081 8.04118 15.7485L8.1361 14.2515Z"
       fill="currentColor"
       stroke="none"
       variants={rayVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CursorPointer01Icon.displayName = "CursorPointer01Icon";
export { CursorPointer01Icon };
