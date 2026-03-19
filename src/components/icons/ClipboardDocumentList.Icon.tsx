import { motion, useAnimation, type Variants } from 'framer-motion';
import { forwardRef, type HTMLAttributes, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { cn } from '@/lib/utils';

export interface ClipboardDocumentListIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface ClipboardDocumentListIconProps extends HTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const DOT_DURATION = 0.2;
const LINE_DURATION = 0.4;
const LOOP_DELAY = 1;

const CREATE_DOT_VARIANTS = (delay: number): Variants => ({
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: [0, 1, 1, 0],
    transition: {
      duration: DOT_DURATION + LINE_DURATION + LOOP_DELAY,
      times: [0, 0.1, 0.8, 1],
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  },
});

const CREATE_LINE_VARIANTS = (delay: number): Variants => ({
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    pathLength: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: DOT_DURATION + LINE_DURATION + LOOP_DELAY,
      times: [0, 0.3, 0.8, 1],
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  },
});

const LIST_ITEMS = [
  { y: 12, dotPath: 'M6.75 12h.008v.008H6.75V12Z', linePath: 'M9 12h3.75' },
  { y: 15, dotPath: 'M6.75 15h.008v.008H6.75V15Z', linePath: 'M9 15h3.75' },
  { y: 18, dotPath: 'M6.75 18h.008v.008H6.75V18Z', linePath: 'M9 18h3.75' },
] as const;

export const ClipboardDocumentListIcon = forwardRef<ClipboardDocumentListIconHandle, ClipboardDocumentListIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    // Initial animation if not controlled by hover
    useEffect(() => {
      controls.start('animate');
    }, [controls]);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start('animate');
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start('normal');
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <UnstyledButton className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>ClipboardDocumentList</title>
          <path d="M15.75 18.75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
          {LIST_ITEMS.map((item, index) => {
            const dotDelay = index * (DOT_DURATION + LINE_DURATION);
            const lineDelay = dotDelay + DOT_DURATION;

            return (
              <g key={item.y}>
                <motion.path animate={controls} d={item.dotPath} initial="normal" variants={CREATE_DOT_VARIANTS(dotDelay)} />
                <motion.path animate={controls} d={item.linePath} initial="normal" variants={CREATE_LINE_VARIANTS(lineDelay)} />
              </g>
            );
          })}
        </svg>
      </UnstyledButton>
    );
  },
);

ClipboardDocumentListIcon.displayName = 'ClipboardDocumentListIcon';
