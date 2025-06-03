import SingleBestResidencesClient from "./SingleBestResidencesClient";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
  const res = await fetch(`${baseUrl}/api/${apiVersion}/ranking-categories/slug/${params.slug}`, { cache: "no-store" });
  const data = await res.json();
  const category = data.data;

  const title = category?.title
    ? `Best Branded Residences: ${category.title}`
    : 'Best Branded Residences Rankings';

  const typeName = category?.rankingCategoryType?.name || '';
  const description = category?.title
    ? `Explore the top ${typeName ? typeName.toLowerCase() + ' ' : ''}residences in ${category.title}. Discover exclusive rankings, premium properties, and luxury real estate opportunities worldwide.`
    : 'Explore rankings of the Best Branded Residences by top brands, featuring luxury properties with premium lifestyles and exclusive real estate worldwide.';

  const featuredImage = category?.featuredImage?.id
    ? `${baseUrl}/api/${apiVersion}/media/${category.featuredImage.id}/content`
    : undefined;

  return generatePageMetadata({
    type: 'page',
    data: {
      title,
      description,
      slug: `best-residences/${params.slug}`,
      keywords: ['best residences', 'luxury residences', 'branded residences', category?.title, typeName],
      image: featuredImage
    }
  });
}

export default function CategoryPage() {
  return <SingleBestResidencesClient />
}
