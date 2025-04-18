import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight, MapPin, Banknote } from "lucide-react";

import { Post } from "@/lib/wordpress/wordpress.d";
import { cn, calculateReadingTime } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
} from "@/lib/wordpress/wordpress";

export async function CareerCard({ career }: { career: Post }) {
  const media = career.featured_media
    ? await getFeaturedMediaById(career.featured_media)
    : null;
  
  const date = new Date(career.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const careerCategory = career._embedded?.['wp:term']?.[0]?.[0]?.name || "Uncategorized";
  const location = career.acf?.location || "Remote";  
  const salaryFrom = career.acf?.salary?.from || "Not specified";
  const salaryTo = career.acf?.salary?.to || "Not specified";
  const description = career.acf?.about_the_role || "No description available";

  return (
    <Link
      href={`/careers/${career.slug}`}
      className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-4 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2"
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-row gap-2 items-center">
          <p className="bg-zinc-800/50 text-white px-3 py-2 rounded-md text-sm">
            {careerCategory}
          </p>
        </div>
        <h3
          dangerouslySetInnerHTML={{
            __html: career.title?.rendered || "Untitled Position",
          }}
          className="text-xl text-white font-medium transition-all"
        ></h3>
        <div className="flex items-center gap-4 flex-wrap">
          {location && (
            <p className="text-md text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Location:</span>
              <span className="text-white">{location}</span>
            </p>
          )}

          {salaryFrom && (
            <p className="text-md text-muted-foreground flex items-center gap-1">
              <Banknote className="w-4 h-4" />
              <span>Salary:</span>
              <span className="text-white">{salaryFrom}</span>
              <span>-</span>
              <span className="text-white">{salaryTo}</span>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 w-full my-2"></div>
      {typeof description === 'string' && description.split(" ").length > 20 && (
        <p
          dangerouslySetInnerHTML={{
            __html: description.split(" ").slice(0, 20).join(" ") + "...",
          }}
          className="text-md text-muted-foreground"
        ></p>
      )}

      <span className="bg-[#151b1e] hover:bg-[#192024]  border text-white py-3 px-5 rounded-lg transition-colors contact-button text-center flex items-center gap-2 justify-center">
        Learn More
      </span>
    </Link>
  );
}