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
export interface PrinterOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PrinterOffIconProps extends Omit<
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

const PrinterOffIcon = forwardRef<PrinterOffIconHandle, PrinterOffIconProps>(
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

  const bodyVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.4, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const slashVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [30, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
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
      <m.g variants={bodyVariants}>
       <path d="M7 17H5.33333C4.08718 17 3.4641 17 3 16.7321C2.69596 16.5565 2.44349 16.304 2.26795 16C2 15.5359 2 14.9128 2 13.6667C2 11.1744 2 9.9282 2.5359 9C2.88697 8.39192 3.39192 7.88697 4 7.5359C4.69486 7.13472 5.56789 7.03387 7.00851 7.00851M11 7H15.3333C17.8256 7 19.0718 7 20 7.5359C20.6081 7.88697 21.113 8.39192 21.4641 9C22 9.9282 22 11.1744 22 13.6667C22 14.9128 22 15.5359 21.732 16C21.5565 16.304 21.304 16.5565 21 16.7321C20.9426 16.7652 20.8828 16.7942 20.8197 16.8197" />
       <path d="M16.9995 7V5C16.9995 3.58579 16.9995 2.87868 16.5602 2.43934C16.1209 2 15.4137 2 13.9995 2H9.99954C8.58532 2 7.87822 2 7.43888 2.43934C7.26785 2.61037 7.1634 2.82197 7.09961 3.10007" />
       <path d="M17 17V19C17 20.4142 17 21.1213 16.5607 21.5607C16.1213 22 15.4142 22 14 22H10C8.58579 22 7.87868 22 7.43934 21.5607C7 21.1213 7 20.4142 7 19V14H14" />
       <path d="M18.875 10.25H18.75M19 10.25C19 10.3881 18.8881 10.5 18.75 10.5C18.6119 10.5 18.5 10.3881 18.5 10.25C18.5 10.1119 18.6119 10 18.75 10C18.8881 10 19 10.1119 19 10.25Z" />
      </m.g>
      <m.path
       d="M2 2L22 22"
       strokeDasharray="30"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PrinterOffIcon.displayName = "PrinterOffIcon";
export { PrinterOffIcon };
