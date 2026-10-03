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
export interface MicrosoftIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MicrosoftIconProps extends Omit<
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

const MicrosoftIcon = forwardRef<MicrosoftIconHandle, MicrosoftIconProps>(
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
    scale: [1, 0.78, 1.08, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
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
       d="M13.5 15.5C13.5 14.5572 13.5 14.0858 13.7929 13.7929C14.0858 13.5 14.5572 13.5 15.5 13.5H20C20.9428 13.5 21.4142 13.5 21.7071 13.7929C22 14.0858 22 14.5572 22 15.5V20C22 20.9428 22 21.4142 21.7071 21.7071C21.4142 22 20.9428 22 20 22H15.5C14.5572 22 14.0858 22 13.7929 21.7071C13.5 21.4142 13.5 20.9428 13.5 20V15.5Z"
       variants={popVariants(0.16)}
       style={{
        transformBox: "view-box",
        originX: "17.75px",
        originY: "17.75px",
       }}
      />
      <m.path
       d="M2 4C2 3.05719 2 2.58579 2.29289 2.29289C2.58579 2 3.05719 2 4 2H8.5C9.44281 2 9.91421 2 10.2071 2.29289C10.5 2.58579 10.5 3.05719 10.5 4V8.5C10.5 9.44281 10.5 9.91421 10.2071 10.2071C9.91421 10.5 9.44281 10.5 8.5 10.5H4C3.05719 10.5 2.58579 10.5 2.29289 10.2071C2 9.91421 2 9.44281 2 8.5V4Z"
       variants={popVariants(0)}
       style={{
        transformBox: "view-box",
        originX: "6.25px",
        originY: "6.25px",
       }}
      />
      <m.path
       d="M2 15.5C2 14.5572 2 14.0858 2.29289 13.7929C2.58579 13.5 3.05719 13.5 4 13.5H8.5C9.44281 13.5 9.91421 13.5 10.2071 13.7929C10.5 14.0858 10.5 14.5572 10.5 15.5V20C10.5 20.9428 10.5 21.4142 10.2071 21.7071C9.91421 22 9.44281 22 8.5 22H4C3.05719 22 2.58579 22 2.29289 21.7071C2 21.4142 2 20.9428 2 20V15.5Z"
       variants={popVariants(0.24)}
       style={{
        transformBox: "view-box",
        originX: "6.25px",
        originY: "17.75px",
       }}
      />
      <m.path
       d="M13.5 4C13.5 3.05719 13.5 2.58579 13.7929 2.29289C14.0858 2 14.5572 2 15.5 2H20C20.9428 2 21.4142 2 21.7071 2.29289C22 2.58579 22 3.05719 22 4V8.5C22 9.44281 22 9.91421 21.7071 10.2071C21.4142 10.5 20.9428 10.5 20 10.5H15.5C14.5572 10.5 14.0858 10.5 13.7929 10.2071C13.5 9.91421 13.5 9.44281 13.5 8.5V4Z"
       variants={popVariants(0.08)}
       style={{
        transformBox: "view-box",
        originX: "17.75px",
        originY: "6.25px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MicrosoftIcon.displayName = "MicrosoftIcon";
export { MicrosoftIcon };
