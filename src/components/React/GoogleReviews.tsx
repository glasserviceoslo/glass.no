import type { Review } from '@/types/reviews';
import { InfiniteMovingCards } from '../ui/infinite-moving-cards';

interface Props {
  reviews: (Review & { starRating: number })[];
}

export function GoogleReviews({ reviews }: Props) {
  if (!reviews?.length) return null;

  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-background dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <h2 className="pb-14 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Dette sier kundene om oss</h2>
      <InfiniteMovingCards items={reviews} speed="slower" />
    </div>
  );
}
