import { generatePageMetadata } from "@/lib/metadata";
import SingleExclusiveDealsClient from "./SingleExclusiveDealsClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
  const res = await fetch(`${baseUrl}/api/${apiVersion}/public/units/slug/${params.slug}`, { cache: "no-store" });
  const data = await res.json();
  const unit = data.data;

  const title = unit?.name || "Exclusive Deal";
  const description = unit?.about?.slice(0, 160) || "Discover exclusive deals on luxury residences.";
  const image = unit?.featureImage?.id
    ? `${baseUrl}/api/${apiVersion}/media/${unit.featureImage.id}/content`
    : "/bbr-cover.png"; // fallback na default

  return generatePageMetadata({
  type: 'page',
  data: {
      title,
      description,
      slug: `exclusive-deals/${params.slug}`,
      keywords: ['exclusive deal', 'luxury residences', 'branded residences', title],
      image
  }
  });
}

export default function SingleUnit() {
  return <SingleExclusiveDealsClient />
}