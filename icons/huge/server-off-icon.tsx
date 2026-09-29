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
export interface ServerOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ServerOffIconProps extends Omit<
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

const ServerOffIcon = forwardRef<ServerOffIconHandle, ServerOffIconProps>(
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
       <path d="M8.99219 3.99976H17.9922C19.8778 3.99976 20.8206 3.99976 21.4064 4.58554C21.9922 5.17133 21.9922 6.11414 21.9922 7.99976C21.9922 9.88537 21.9922 10.8282 21.4064 11.414C20.8206 11.9998 19.8778 11.9998 17.9922 11.9998H16.9922" />
       <path d="M11.9922 11.9998H5.99219C4.10657 11.9998 3.16376 11.9998 2.57797 11.414C1.99219 10.8282 1.99219 9.88541 1.99219 7.99979C1.99219 6.11417 1.99219 5.17136 2.57797 4.58558C2.90456 4.25899 3.34213 4.11448 3.99219 4.05054" />
       <path d="M19.4922 19.9825C19.0712 20 18.5771 20 17.9922 20H5.99219C4.10657 20 3.16376 20 2.57797 19.4142C1.99219 18.8284 1.99219 17.8855 1.99219 15.9999C1.99219 14.1142 1.99219 13.1713 2.57798 12.5855C3.16378 11.9997 4.10659 11.9997 5.99223 11.9998L11.9922 11.9998" />
       <path d="M16.9922 11.9999L17.9922 11.9999C19.8778 11.9999 20.8206 11.9999 21.4064 12.5857C21.9922 13.1715 21.9922 14.1143 21.9922 15.9999C21.9922 16.3676 21.9922 16.6995 21.9878 16.9999" />
       <path d="M6.11719 7.99976H5.99219M6.24219 7.99976C6.24219 8.13783 6.13026 8.24976 5.99219 8.24976C5.85412 8.24976 5.74219 8.13783 5.74219 7.99976C5.74219 7.86169 5.85412 7.74976 5.99219 7.74976C6.13026 7.74976 6.24219 7.86169 6.24219 7.99976Z" />
       <path d="M6.11719 15.9998H5.99219M6.24219 15.9998C6.24219 16.1378 6.13026 16.2498 5.99219 16.2498C5.85412 16.2498 5.74219 16.1378 5.74219 15.9998C5.74219 15.8617 5.85412 15.7498 5.99219 15.7498C6.13026 15.7498 6.24219 15.8617 6.24219 15.9998Z" />
       <path d="M10.1172 15.9998H9.99219M10.2422 15.9998C10.2422 16.1378 10.1303 16.2498 9.99219 16.2498C9.85412 16.2498 9.74219 16.1378 9.74219 15.9998C9.74219 15.8617 9.85412 15.7498 9.99219 15.7498C10.1303 15.7498 10.2422 15.8617 10.2422 15.9998Z" />
      </m.g>
      <m.path
       d="M1.99219 1.99976L21.9922 21.9998"
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

ServerOffIcon.displayName = "ServerOffIcon";
export { ServerOffIcon };
