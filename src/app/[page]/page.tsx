import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPage } from '@/lib/shopify';
import { DefaultTemplate, LandingTemplate } from '@/components/templates';

import { type Page } from '@/types/shopify-types';

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: 'article'
    }
  };
}

// Get page template from metafields
export function getPageTemplate(page: Page): string {
  return page.metafield?.value || 'default';
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  const template = getPageTemplate(page);

  // Choose template based on metafield value
  switch (template) {
    case 'landing':
      return <LandingTemplate page={page} />;
    default:
      return <DefaultTemplate page={page} />;
  }
}