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
export interface IdVerifiedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface IdVerifiedIconProps extends Omit<
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

const IdVerifiedIcon = forwardRef<IdVerifiedIconHandle, IdVerifiedIconProps>(
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

  const badgeVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.2, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };

  const personVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.15, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
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
       d="M16.177 18.4559C16.4776 18.6002 16.8504 18.973 17.0308 19.2737C17.0909 19.6945 17.3916 18.0711 18.8586 17.1091M21.5 18.001C21.5 20.2101 19.7091 22.001 17.5 22.001C15.2909 22.001 13.5 20.2101 13.5 18.001C13.5 15.7918 15.2909 14.001 17.5 14.001C19.7091 14.001 21.5 15.7918 21.5 18.001Z"
       variants={badgeVariants}
       style={{ transformBox: "view-box", originX: "17.5px", originY: "18px" }}
      />
      <m.circle
       cx="11.0078"
       cy="12.001"
       r="2"
       variants={personVariants}
       style={{
        transformBox: "view-box",
        originX: "11.0078px",
        originY: "12px",
       }}
      />
      <path d="M7.50765 18.001C8.45765 17.101 9.25765 16.601 11.0327 16.501M19.5077 11.501C19.5077 10.701 19.5327 8.25098 19.4077 7.25098C19.3327 6.42598 19.1077 5.30098 18.0827 4.65098C17.4577 4.32598 16.8577 4.02598 13.9827 4.00098M7.95765 4.00098C5.80765 4.00098 4.13265 4.17598 3.30766 5.20098C2.60766 6.15764 2.64932 7.25098 2.58265 7.60098C2.43265 9.47598 2.53265 16.026 2.53265 17.126C2.53265 18.276 2.45765 20.6135 4.03265 21.401C5.38265 22.076 6.78265 21.976 11.5327 22.001" />
      <path d="M10.8577 2.00105C10.2577 2.00105 9.75765 2.00105 9.25765 2.52605C8.83265 2.92605 8.89859 3.27928 8.73265 3.90105C8.49913 4.77605 8.38241 5.23753 8.70766 5.60105C9.00582 5.99135 9.50697 5.99262 9.9495 5.99373L9.95766 5.99376C10.3827 6.02385 11.8112 6.01007 12.2327 5.99376C12.6855 5.97622 13.05 5.95105 13.3577 5.55105C13.6327 5.19355 13.4696 4.59861 13.3077 3.97605C13.1479 3.36181 13.2077 3.05105 12.7827 2.52605C12.1827 1.92605 11.4577 2.00105 10.8577 2.00105Z" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

IdVerifiedIcon.displayName = "IdVerifiedIcon";
export { IdVerifiedIcon };
