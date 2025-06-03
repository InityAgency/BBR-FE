import SingleBrandClient from "./SingleBrandClient";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Fetchuj podatke o brendu na serveru
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
  const res = await fetch(`${baseUrl}/api/${apiVersion}/public/brands/slug/${params.slug}`, { cache: "no-store" });
  const data = await res.json();
  const brand = data.data;

  const brandName = brand?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  // Pravi logo URL
  const logoUrl = brand?.logo?.id
    ? `${baseUrl}/api/${apiVersion}/media/${brand.logo.id}/content`
    : undefined;

  return generatePageMetadata({
    type: 'page',
    data: {
      title: `Rankings of the Best Branded Residences by ${brandName}`,
      description: `Explore the rankings of the Best Branded Residences by ${brandName}. Experience luxury homes with exceptional service and timeless elegance in prime locations.`,
      slug: `brands/${params.slug}`,
      keywords: ['brands', 'luxury residences', 'branded residences', brandName],
      image: logoUrl // koristi pravi logo
    }
  });
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  return <SingleBrandClient />
}