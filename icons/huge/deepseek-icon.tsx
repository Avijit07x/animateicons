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
export interface DeepseekIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DeepseekIconProps extends Omit<
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

const DeepseekIcon = forwardRef<DeepseekIconHandle, DeepseekIconProps>(
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

  const hopVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0.4, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const blinkVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: 0.3 * duration,
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
      <m.g variants={hopVariants}>
       <path d="M20.7251 6.16595C19.5974 6.16595 18.9538 6.95202 18.9538 6.95202C18.7384 5.92858 18.095 5.6278 17.3608 5.28691C16.8965 5.07135 16.702 4.59085 16.6387 4.2437C16.6146 4.11149 16.5055 4.00308 16.3711 4.00308C16.237 4.00308 16.1093 4.05921 16.0445 4.17662C15.9059 4.42748 15.6911 4.97621 15.672 5.98711C15.6435 7.48962 16.8825 8.64855 17.5056 9.04019C17.4415 9.41048 17.216 9.98242 17.1112 10.2221C16.7962 10.1096 15.9376 9.74732 15.2402 8.98763C14.2834 7.94536 13.5027 7.20684 12.4854 6.4845C11.4681 5.76216 12.1483 4.90154 12.5757 4.69688C13.003 4.49221 12.678 4.28196 11.6125 4.31808C10.7602 4.34697 9.54607 4.84808 9.04556 5.09502C8.53523 4.93292 7.47442 4.90065 7.00781 4.90478C2.42529 4.90478 1.0006 8.98014 1.0006 11.0006C1.0006 17.0868 5.87378 20.0006 9.37378 20.0006C13.3324 20.0006 14.7193 18.3865 14.7193 18.3865C14.8826 18.4882 15.4787 18.7032 16.5574 18.749C17.9058 18.8062 18.4082 18.4246 18.4464 18.1321C18.4845 17.8395 18.2683 17.7314 18.0775 17.6423C17.8867 17.5533 17.5878 17.3816 17.0217 17.1971C16.5689 17.0496 16.3652 16.889 16.3199 16.8272C19.0501 14.3553 19.5503 10.8921 19.473 9.4203C21.5848 9.33823 22.4164 7.93216 22.69 7.22092C22.9696 6.49381 23.1441 5.50412 22.8541 5.27981C22.6221 5.10036 22.4281 5.31649 22.3601 5.44699C21.9885 5.84344 21.7159 6.16595 20.7251 6.16595Z" />
       <m.path
        d="M11.9998 10.5684C11.9998 10.5684 12.8758 10.2982 13.6446 10.823C14.6861 11.5338 14.9998 12.4988 14.9998 12.4988"
        variants={blinkVariants}
        style={{
         transformBox: "view-box",
         originX: "13.5px",
         originY: "11.5px",
        }}
       />
       <path d="M13.5 16.4987C13.5 16.4987 12.4587 15.9918 10.8957 13.9604C9.01763 11.5195 7.24873 8.88553 3.52945 9.7468C3.52945 9.7468 3.50015 14.9979 8.50002 16.4987" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DeepseekIcon.displayName = "DeepseekIcon";
export { DeepseekIcon };
