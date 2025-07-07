import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Post } from "@/lib/wordpress/wordpress.d";
import { calculateReadingTime, formatDate } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
  getNewsroomCategoryById,
} from "@/lib/wordpress/wordpress";

export async function NewsroomPostCard({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const date = formatDate(post.date);
  const category = post.newsroom_categories?.[0]
    ? await getNewsroomCategoryById(post.newsroom_categories[0])
    : null;
  const readingTime = calculateReadingTime(post.content?.rendered || "");

  return (
    <Link
      href={`/newsroom/${post.slug}`}
      className="group flex flex-col bg-white border border-[#E0E0E0] rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full"
    >
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={post.title?.rendered || "Post thumbnail"}
            fill
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
            No image available
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <div className="flex flex-row gap-2 items-center text-xs text-muted-foreground mb-1">
          <span>{date}</span>
          <span className="mx-1">•</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime} min read</span>
        </div>
        <div className="text-primary uppercase text-xs font-semibold tracking-wide mb-1">{category?.name || "Uncategorized"}</div>
        <h3
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-lg font-bold text-black group-hover:text-primary transition-colors line-clamp-2"
        ></h3>
        <div
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.split(" ").slice(0, 32).join(" ").trim() + "..."
              : "No excerpt available",
          }}
        ></div>
      </div>
    </Link>
  );
} 