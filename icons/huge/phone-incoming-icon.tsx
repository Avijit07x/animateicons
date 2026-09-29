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
export interface PhoneIncomingIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PhoneIncomingIconProps extends Omit<
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

const PhoneIncomingIcon = forwardRef<
 PhoneIncomingIconHandle,
 PhoneIncomingIconProps
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

  const arrowVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -2, 0.5, 0],
    y: [0, 2, -0.5, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
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
      <path d="M4.90404 10.5413L7.54448 7.90088C8.08309 7.36227 8.26947 6.56642 8.05163 5.83652C7.88129 5.26577 7.68937 4.57964 7.5618 3.99292C7.44381 3.45027 6.96763 3 6.41231 3H4.90404C3.79339 3 2.8813 3.90384 3.00313 5.0078C3.92928 13.3996 10.5926 20.0629 18.9844 20.9891C20.0883 21.1109 20.9922 20.1988 20.9922 19.0881V17.5799C20.9922 17.0246 20.5401 16.569 19.9937 16.4696C19.391 16.36 18.7533 16.1804 18.2198 16.0103C17.4533 15.7659 16.6013 15.9377 16.0325 16.5065L13.4509 19.0881" />
      <m.path
       d="M14.7252 9.26892L19.9922 4.00195M18.9922 9.70596C17.7368 9.81518 14.9453 10.3246 14.3074 9.68671C13.6695 9.04884 14.179 6.25729 14.2882 5.00195"
       variants={arrowVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PhoneIncomingIcon.displayName = "PhoneIncomingIcon";
export { PhoneIncomingIcon };
