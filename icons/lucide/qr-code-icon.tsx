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
export interface QrCodeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface QrCodeIconProps extends Omit<
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

const QrCodeIcon = forwardRef<QrCodeIconHandle, QrCodeIconProps>(
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

  const finderVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, 1.12, 0.96, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: i * 0.06 * duration,
    },
   }),
  };

  const moduleVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, 1.6, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: (0.1 + i * 0.04) * duration,
    },
   }),
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
      <m.rect
       width="5"
       height="5"
       x="3"
       y="3"
       rx="1"
       custom={0}
       variants={finderVariants}
       style={{ transformBox: "view-box", originX: "5.5px", originY: "5.5px" }}
      />
      <m.rect
       width="5"
       height="5"
       x="16"
       y="3"
       rx="1"
       custom={1}
       variants={finderVariants}
       style={{ transformBox: "view-box", originX: "18.5px", originY: "5.5px" }}
      />
      <m.rect
       width="5"
       height="5"
       x="3"
       y="16"
       rx="1"
       custom={2}
       variants={finderVariants}
       style={{ transformBox: "view-box", originX: "5.5px", originY: "18.5px" }}
      />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <m.path
       d="M12 3h.01"
       custom={0}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "3px" }}
      />
      <m.path
       d="M3 12h.01"
       custom={1}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "3px", originY: "12px" }}
      />
      <m.path
       d="M16 12h1"
       custom={2}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "16.5px", originY: "12px" }}
      />
      <m.path
       d="M21 12v.01"
       custom={3}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "21px", originY: "12px" }}
      />
      <m.path
       d="M12 16v.01"
       custom={4}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "16px" }}
      />
      <m.path
       d="M12 21v-1"
       custom={5}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "20.5px" }}
      />
      <m.path
       d="M21 21v.01"
       custom={6}
       variants={moduleVariants}
       style={{ transformBox: "view-box", originX: "21px", originY: "21px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

QrCodeIcon.displayName = "QrCodeIcon";
export { QrCodeIcon };
