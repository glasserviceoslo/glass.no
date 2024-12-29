import { cn } from '@/lib/utils';
import type { Review } from '@/types/reviews';
import React, { useEffect, useState } from 'react';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: (Review & { starRating: number })[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow' | 'slower';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      // Clone items for infinite scroll
      const scrollerContent = Array.from(scrollerRef.current.children);
      for (const item of scrollerContent) {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      }

      // Set animation properties
      const animationDuration = {
        fast: '20s',
        normal: '40s',
        slow: '80s',
        slower: '500s',
      }[speed];

      containerRef.current.style.setProperty('--animation-duration', animationDuration);
      containerRef.current.style.setProperty('--animation-direction', direction === 'left' ? 'forwards' : 'reverse');

      setStart(true);
    }
  }, [speed, direction]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_80%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((item) => (
          <li
            className="w-[350px] max-w-full relative flex-shrink-0  px-8 py-6 md:w-[450px]
            
            rounded-3xl border border-gray-100 bg-white bg-opacity-50 p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
            // style={{
            //   background: 'linear-gradient(180deg, var(--slate-800), var(--slate-900)',
            // }}
            key={item.reviewer.displayName}
          >
            <blockquote>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={item.reviewer.profilePhotoUrl}
                    alt={item.reviewer.displayName}
                    className="w-10 h-10 rounded-full"
                    loading="lazy"
                  />
                  <span className="font-semibold text-gray-800 dark:text-white">{item.reviewer.displayName}</span>
                </div>
                <div className="text-yellow-600 text-xl">{'★'.repeat(item.starRating)}</div>
              </div>
              <span className="relative z-20 leading-[1.6] text-gray-600 dark:text-gray-300 font-normal">
                {item.comment}
              </span>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
