import { getPostBySlug, getCategoryById, getAuthorById, getFeaturedMediaById, getPostsByCategory } from "@/lib/wordpress/wordpress";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import { calculateReadingTime, formatDate } from "@/lib/utils";
import Link from "next/link";
import TableOfContents from "@/components/web/TableOfContents/TableOfContents";
import { PostCard } from "@/components/web/Posts/PostCard";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found | Luxury Insights',
        description: 'The requested blog post could not be found.',
      }
    }

    // Get featured image
    const media = post.featured_media ? await getFeaturedMediaById(post.featured_media) : null;
    const featuredImage = media?.source_url || '/og-default.jpg';

    // Get category
    const category = post.categories?.[0] ? await getCategoryById(post.categories[0]) : null;

    // Clean HTML from title and excerpt
    const cleanTitle = post.title?.rendered?.replace(/<[^>]*>/g, '') || 'Blog Post';
    const cleanExcerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) || 
                        post.content?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) || 
                        'Read this insightful article about luxury real estate market trends.';

    return {
      title: `${cleanTitle} | Luxury Insights`,
      description: cleanExcerpt,
      authors: [{ name: 'Best Branded Residences' }],
      openGraph: {
        title: cleanTitle,
        description: cleanExcerpt,
        type: 'article',
        publishedTime: new Date(post.date).toISOString(),
        modifiedTime: post.modified ? new Date(post.modified).toISOString() : undefined,
        authors: ['Best Branded Residences'],
        section: category?.name,
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: cleanTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: cleanTitle,
        description: cleanExcerpt,
        images: [featuredImage],
      },
      alternates: {
        canonical: `https://bestbrandedresidences.com/blog/${params.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating blog post metadata:', error)
    return {
      title: 'Blog Post | Luxury Insights', 
      description: 'Read insights about luxury real estate market trends.',
    }
  }
}

interface BlogPostPageProps {
    params: {
        slug: string;
    };
    searchParams?: Record<string, string | string[]>;
}
export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // Fetch additional data
    const [media, author, category] = await Promise.all([
        post.featured_media ? getFeaturedMediaById(post.featured_media) : null,
        post.author ? getAuthorById(post.author) : null,
        post.categories?.[0] ? getCategoryById(post.categories[0]) : null,
    ]);

    // Fetch related posts from the same category
    const relatedPosts = category ? await getPostsByCategory(category.id) : [];
    const filteredRelatedPosts = relatedPosts
        .filter(relatedPost => relatedPost.id !== post.id)
        .slice(0, 3);

    // Pre-fetch all data for related posts
    const relatedPostsWithData = await Promise.all(
        filteredRelatedPosts.map(async (relatedPost) => {
            await Promise.all([
                relatedPost.featured_media ? getFeaturedMediaById(relatedPost.featured_media) : null,
                relatedPost.author ? getAuthorById(relatedPost.author) : null,
                relatedPost.categories?.[0] ? getCategoryById(relatedPost.categories[0]) : null,
            ]);

            return relatedPost;
        })
    );

    const date = formatDate(post.date);

    const readingTime = calculateReadingTime(post.content?.rendered || "");


    return (
        <>
            {/* Hero Section */}
            <div className="single-blog-hero">
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
                    <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 py-4 ">
                            <Link href="/blog" className="hover:text-primary transition-colors">
                                Luxury Insights
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-foreground line-clamp-1" dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }} />
                        </div>
                        <div className="w-full mx-auto items-center flex flex-col gap-6 px-12 mb-12">
                            <div className="uppercase text-primary">
                                {category?.name || "HOME DESIGN & DECOR"}
                            </div>
                            <h1
                                className="text-4xl font-medium w-[70%] text-center"
                                dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
                            />
                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{readingTime} min read</span>
                                </div>
                                <span>•</span>
                                <span>{date}</span>
                            </div>
                        </div>
                        {media?.source_url && (
                            <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
                                <Image
                                    src={media.source_url}
                                    alt={post.title?.rendered || "Post thumbnail"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 gap-4 xl:gap-8 mb-12 single-blog-content">
                <div className="w-full flex gap-4 mx-auto space-y-8 relative xl:max-w-[1600px] mx-auto">
                    {/* Table of Contents */}
                    <TableOfContents
                        contentSelector=".prose"
                        maxDepth={2}
                    />

                    <div
                        className="prose prose-lg prose-headings:font-medium prose-h1:text-4xl prose-h2:text-3xl 
                        prose-h3:text-2xl prose-h4:text-xl prose-headings:my-6 prose-headings:text-foreground 
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-lg prose-img:my-8 w-full mx-auto pb-8"
                        dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
                    />
                </div>
            </div>


            <div className="bg-secondary">
                <div className="flex flex-col lg:flex-col gap-4 max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-24 gap-4 xl:gap-8">
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <h2 className="text-4xl font-medium">Explore More Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {relatedPostsWithData.map((relatedPost) => (
                                <PostCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <NewsletterBlock />
        </>
    );
}