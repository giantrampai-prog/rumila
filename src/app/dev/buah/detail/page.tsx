import { notFound } from 'next/navigation';
import GardenDetailPreview from '@/components/fruits/garden/detail-preview';

export default function GardenDetailPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <GardenDetailPreview />;
}
