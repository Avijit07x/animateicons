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
export interface WebhookOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WebhookOffIconProps extends Omit<
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

const WebhookOffIcon = forwardRef<WebhookOffIconHandle, WebhookOffIconProps>(
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
       <path d="M5.062 12.5C3.83229 13.1824 3 14.494 3 16C3 18.2091 4.79086 20 7 20C9.20914 20 11 18.2091 11 16H16" />
       <path d="M14.5 19.1227C15.1848 19.6716 16.0541 20 17 20C17.8492 20 18.6365 19.7354 19.2841 19.2841M16.1013 12.1013C16.3902 12.035 16.691 12 17 12C19.2091 12 21 13.7909 21 16C21 16.309 20.965 16.6098 20.8987 16.8987" />
       <path d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6M12 8C11.4477 8 11 7.55228 11 7C11 6.44772 11.4477 6 12 6M12 8V6" />
       <path d="M7 17C7.55228 17 8 16.5523 8 16C8 15.4477 7.55228 15 7 15M7 17C6.44772 17 6 16.5523 6 16C6 15.4477 6.44772 15 7 15M7 17V15" />
       <path d="M16 7C16 4.79086 14.2091 3 12 3C10.64 3 9.43857 3.6787 8.71586 4.71586M7 16L10.0571 10.4973" />
      </m.g>
      <m.path
       d="M3 3L21 21"
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

WebhookOffIcon.displayName = "WebhookOffIcon";
export { WebhookOffIcon };
