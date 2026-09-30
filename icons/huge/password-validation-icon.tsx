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
export interface PasswordValidationIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PasswordValidationIconProps extends Omit<
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

const PasswordValidationIcon = forwardRef<
 PasswordValidationIconHandle,
 PasswordValidationIconProps
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

  const dotsVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.2, 1, 0.2, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const badgeVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.15, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
    },
   },
  };

  const checkVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [6, 0],
    transition: {
     duration: 0.35 * duration,
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
      <path d="M9.93552 12.9995H7C5.13077 12.9995 4.19615 12.9995 3.5 12.5976C3.04394 12.3343 2.66523 11.9556 2.40192 11.4995C2 10.8034 2 9.86874 2 7.99951C2 6.13028 2 5.19566 2.40192 4.49951C2.66523 4.04345 3.04394 3.66474 3.5 3.40144C4.19615 2.99951 5.13077 2.99951 7 2.99951H14C16.8284 2.99951 18.2426 2.99951 19.1213 3.87819C20 4.75687 20 6.17108 20 8.99951" />
      <m.path
       d="M17.5 20.9995C19.9853 20.9995 22 18.9848 22 16.4995C22 14.0142 19.9853 11.9995 17.5 11.9995C15.0147 11.9995 13 14.0142 13 16.4995C13 18.9848 15.0147 20.9995 17.5 20.9995Z"
       variants={badgeVariants}
       style={{
        transformBox: "view-box",
        originX: "17.5px",
        originY: "16.5px",
       }}
      />
      <m.path
       d="M11.1279 7.99951H11.0029M7.12717 7.99951H7.00217M15.1272 7.99951H15.0022M11.2529 7.99951C11.2529 8.13758 11.141 8.24951 11.0029 8.24951C10.8648 8.24951 10.7529 8.13758 10.7529 7.99951C10.7529 7.86144 10.8648 7.74951 11.0029 7.74951C11.141 7.74951 11.2529 7.86144 11.2529 7.99951ZM7.25217 7.99951C7.25217 8.13758 7.14024 8.24951 7.00217 8.24951C6.8641 8.24951 6.75217 8.13758 6.75217 7.99951C6.75217 7.86144 6.8641 7.74951 7.00217 7.74951C7.14024 7.74951 7.25217 7.86144 7.25217 7.99951ZM15.2522 7.99951C15.2522 8.13758 15.1402 8.24951 15.0022 8.24951C14.8641 8.24951 14.7522 8.13758 14.7522 7.99951C14.7522 7.86144 14.8641 7.74951 15.0022 7.74951C15.1402 7.74951 15.2522 7.86144 15.2522 7.99951Z"
       variants={dotsVariants}
      />
      <m.path
       d="M15.75 16.9995C15.75 16.9995 16.25 16.9995 16.75 17.9995C16.75 17.9995 17.8382 15.9995 19.25 15.4995"
       strokeDasharray="6"
       strokeDashoffset="0"
       variants={checkVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PasswordValidationIcon.displayName = "PasswordValidationIcon";
export { PasswordValidationIcon };
