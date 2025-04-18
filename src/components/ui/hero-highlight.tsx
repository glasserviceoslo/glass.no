import { cn } from '@/lib/utils';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div
      className={cn(
        'relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group',
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800  pointer-events-none" />
      <motion.div
        className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500   absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className={cn('relative z-20', className)}>{children}</div>
    </div>
  );
};

const highlightVariants = cva('relative inline-block pb-1 px-1 rounded-lg', {
  variants: {
    variant: {
      default: 'bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-500 dark:to-purple-500',
      fluro: 'bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-700 dark:to-blue-700',
      minimal: 'bg-yellow-200 dark:bg-yellow-700',
      brutalist: 'bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
interface HighlightProps extends VariantProps<typeof highlightVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Highlight: React.FC<HighlightProps> = ({ children, className, variant }) => {
  return (
    <motion.span
      initial={{
        backgroundSize: '0% 100%',
      }}
      animate={{
        backgroundSize: '100% 100%',
      }}
      transition={{
        duration: 2,
        ease: 'linear',
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
      }}
      className={cn(highlightVariants({ variant }), className)}
    >
      {children}
    </motion.span>
  );
};
