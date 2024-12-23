import { getCollection } from '@/lib/shopify';

import OpengraphImage from '@/components/opengraph-image';

// This disables static generation warning since it's expected for OpenGraph images
export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await getCollection(params.collection);
  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
