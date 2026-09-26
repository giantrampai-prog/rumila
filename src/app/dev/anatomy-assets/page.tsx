import { notFound } from 'next/navigation';
import { AnatomyAssetReview } from '@/components/anatomy/asset-review';

export default function AnatomyAssetReviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <AnatomyAssetReview />;
}
