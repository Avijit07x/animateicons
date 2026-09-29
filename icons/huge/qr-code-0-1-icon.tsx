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
export interface QrCode01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface QrCode01IconProps extends Omit<
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

const QrCode01Icon = forwardRef<QrCode01IconHandle, QrCode01IconProps>(
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

  const moduleVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.3, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
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
       d="M6.79289 6.79289C6.5 7.08579 6.5 7.55719 6.5 8.5C6.5 9.44281 6.5 9.91421 6.79289 10.2071C7.08579 10.5 7.55719 10.5 8.5 10.5C9.44281 10.5 9.91421 10.5 10.2071 10.2071C10.5 9.91421 10.5 9.44281 10.5 8.5C10.5 7.55719 10.5 7.08579 10.2071 6.79289C9.91421 6.5 9.44281 6.5 8.5 6.5C7.55719 6.5 7.08579 6.5 6.79289 6.79289Z"
       variants={moduleVariants(0)}
       style={{ transformBox: "view-box", originX: "8.5px", originY: "8.5px" }}
      />
      <m.path
       d="M13.5 10.5C14.4428 10.5 14.9142 10.5 15.2071 10.2071C15.5 9.91421 15.5 9.44281 15.5 8.5C15.5 7.55719 15.5 7.08579 15.7929 6.79289C16.0858 6.5 16.5572 6.5 17.5 6.5"
       variants={moduleVariants(0.1)}
       style={{ transformBox: "view-box", originX: "15.5px", originY: "8.5px" }}
      />
      <m.path
       d="M6.5 13.5H8.5C9.44281 13.5 9.91421 13.5 10.2071 13.7929C10.5 14.0858 10.5 14.5572 10.5 15.5V17.5"
       variants={moduleVariants(0.2)}
       style={{ transformBox: "view-box", originX: "8.5px", originY: "15.5px" }}
      />
      <m.path
       d="M6.875 17.25H6.75M7 17.25C7 17.3881 6.88807 17.5 6.75 17.5C6.61193 17.5 6.5 17.3881 6.5 17.25C6.5 17.1119 6.61193 17 6.75 17C6.88807 17 7 17.1119 7 17.25Z"
       variants={moduleVariants(0.3)}
       style={{
        transformBox: "view-box",
        originX: "6.75px",
        originY: "17.25px",
       }}
      />
      <m.path
       d="M13.7929 13.7929C13.5 14.0858 13.5 14.5572 13.5 15.5C13.5 16.4428 13.5 16.9142 13.7929 17.2071C14.0858 17.5 14.5572 17.5 15.5 17.5C16.4428 17.5 16.9142 17.5 17.2071 17.2071C17.5 16.9142 17.5 16.4428 17.5 15.5C17.5 14.5572 17.5 14.0858 17.2071 13.7929C16.9142 13.5 16.4428 13.5 15.5 13.5C14.5572 13.5 14.0858 13.5 13.7929 13.7929Z"
       variants={moduleVariants(0.4)}
       style={{
        transformBox: "view-box",
        originX: "15.5px",
        originY: "15.5px",
       }}
      />
      <path d="M6.5 21.5C6.03563 21.5 5.80344 21.5 5.60812 21.478C3.98545 21.2952 2.70484 20.0145 2.52201 18.3919C2.5 18.1966 2.5 17.9644 2.5 17.5M17.5 21.5C17.9644 21.5 18.1966 21.5 18.3919 21.478C20.0145 21.2952 21.2952 20.0145 21.478 18.3919C21.5 18.1966 21.5 17.9644 21.5 17.5M6.5 2.5C6.03563 2.5 5.80344 2.5 5.60812 2.52201C3.98545 2.70484 2.70484 3.98545 2.52201 5.60812C2.5 5.80344 2.5 6.03563 2.5 6.5M17.5 2.5C17.9644 2.5 18.1966 2.5 18.3919 2.52201C20.0145 2.70484 21.2952 3.98545 21.478 5.60812C21.5 5.80344 21.5 6.03563 21.5 6.5" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

QrCode01Icon.displayName = "QrCode01Icon";
export { QrCode01Icon };
