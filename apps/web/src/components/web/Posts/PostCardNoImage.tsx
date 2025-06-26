import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Post } from "@/lib/wordpress/wordpress.d";
import { cn, calculateReadingTime, formatDate } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress/wordpress";
import { ArrowUpRight } from "lucide-react";

export async function PostCardNoImage({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = post.author ? await getAuthorById(post.author) : null;
  const date = formatDate(post.date);
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;
  
  const readingTime = calculateReadingTime(post.content?.rendered || "");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-8 hover:bg-zinc-800/20 transition-all hover:-translate-y-2"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
            <p className="bg-zinc-800/50 text-white px-3 py-2 rounded-md text-sm">{category?.name || "Uncategorized"}</p>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Clock className="w-3 h-3" />
                <span>{readingTime} min read</span>
                </div>
            </div>
        </div>
        <h3
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-xl text-white font-medium transition-all"
        ></h3>
        <div
          className="text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.split(" ").slice(0, 32).join(" ").trim() +
                "..."
              : "No excerpt available",
          }}
        ></div>
      </div>
    </Link>
  );
}