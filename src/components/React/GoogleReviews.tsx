import { useMemo } from 'react';
import { cleanComment, getStarRating } from '@/lib/utils';
import type { ReviewsData } from '@/types/reviews';
import { InfiniteMovingCards } from '../ui/infinite-moving-cards';

interface Props {
  reviews: ReviewsData;
}

export function GoogleReviews({ reviews }: Props) {
  if (!reviews?.reviews?.length) return null;

  const filteredReviews = useMemo(
    () =>
      reviews.reviews
        .filter((review) => getStarRating(review.starRating) >= 4)
        .map((review) => ({
          ...review,
          comment: cleanComment(review.comment),
          starRating: getStarRating(review.starRating),
        }))
        .sort(() => Math.random() - 0.5),
    [reviews],
  ); // Only recompute when reviews change

  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-background dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <h2 className="pb-14 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Hva sier våre kunder</h2>
      <InfiniteMovingCards items={filteredReviews} speed="slower" />
    </div>
  );
}
