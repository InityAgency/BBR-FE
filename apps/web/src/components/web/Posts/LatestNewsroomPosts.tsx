"use client";

import { useState, useEffect } from "react";
import { getAllNewsroomPosts } from "@/lib/wordpress/wordpress";
import { Post } from "@/lib/wordpress/wordpress.d";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";

// Client-side PostCard komponenta
const ClientPostCard = ({ post }: { post: Post }) => {
  const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  
  // Simulacija reading time kalkulacije
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };
  
  const readingTime = calculateReadingTime(post.content?.rendered || "");
  
  return (
    <Link
      href={`/newsroom/${post.slug}`}
      className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-8 hover:bg-secondary transition-all h-full hover:-translate-y-2"
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          {featuredImage ? (
            <>
              <Image
                className="h-full w-full object-cover"
                src={featuredImage}
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
          <p className="bg-zinc-800/50 text-white px-3 py-2 rounded-md text-sm">{categoryName}</p>
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
              ? post.excerpt.rendered.split(" ").slice(0, 32).join(" ").trim() + "..."
              : "No excerpt available",
          }}
        ></div>
      </div>
    </Link>
  );
};

export default function LatestNewsroomPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postsData = await getAllNewsroomPosts();
        
        if (postsData && Array.isArray(postsData)) {
          // Take only the first 3 posts
          setPosts(postsData.slice(0, 3));
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching latest newsroom posts:', err);
        setError('Failed to load latest news');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border p-4 bg-secondary/30 rounded-lg animate-pulse">
            <div className="h-72 bg-secondary/50 rounded-md mb-4"></div>
            <div className="h-4 bg-secondary/50 rounded mb-2"></div>
            <div className="h-6 bg-secondary/50 rounded mb-2"></div>
            <div className="h-4 bg-secondary/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No latest news available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ClientPostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 