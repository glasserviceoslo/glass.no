export interface Review {
  reviewId: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
  };
  starRating: string;
  comment: string;
  createTime: string;
  updateTime: string;
  name: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

export interface ReviewsData {
  reviews: Review[];
  averageRating?: number;
  totalReviewCount?: number;
}
