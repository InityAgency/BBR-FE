import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Post } from "@/lib/wordpress/wordpress.d";
import { cn, calculateReadingTime } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress/wordpress";
import { ArrowUpRight } from "lucide-react";

export async function PostCard({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = post.author ? await getAuthorById(post.author) : null;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;
  
  const readingTime = calculateReadingTime(post.content?.rendered || "");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-8 hover:bg-secondary transition-all h-full hover:-translate-y-2"
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          {media?.source_url ? (
            <>
                <Image
              className="h-full w-full object-cover"
              src={media.source_url}
              alt={post.title?.rendered || "Post thumbnail"}
              width={400}
              height={400}
            />
            <span className="absolute right-2 bottom-2 z-10 bg-secondary text-white w-10 h-10 rounded-md flex items-center justify-center hover:bg-primary transition-all">
                <ArrowUpRight className="w-6 h-6" />
            </span>  
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No image available
            </div>
          )}
        </div>
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
          className="text-md text-muted-foreground"
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