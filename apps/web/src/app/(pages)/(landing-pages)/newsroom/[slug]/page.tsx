import { getNewsroomPostBySlug, getNewsroomCategoryById, getAuthorById, getFeaturedMediaById, getNewsroomPostsByCategory } from "@/lib/wordpress/wordpress";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, ChevronRight, ArrowUpRight } from "lucide-react";
import { calculateReadingTime, formatDate } from "@/lib/utils";
import Link from "next/link";
import TableOfContents from "@/components/web/TableOfContents/TableOfContents";
import { NewsroomPostCard } from "@/components/web/Posts/NewsroomPostCard";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import SectionLayout from "@/components/web/SectionLayout";
import { Post } from "@/lib/wordpress/wordpress";

interface NewsroomPostPageProps {
    params: {
        slug: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}


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
            className="border text-black p-4 bg-white border-[#E0E0E0] rounded-lg group flex justify-between flex-col not-prose gap-8 hover:bg-black/5 transition-all h-full hover:-translate-y-2"
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
                            <span className="absolute right-2 bottom-2 z-10 bg-primary text-white w-10 h-10 rounded-md flex items-center justify-center hover:bg-primary transition-all">
                                <ArrowUpRight className="w-6 h-6" />
                            </span>
                        </>
                    ) : (
                        <div className="flex border border-[#E0E0E0] rounded-lg items-center justify-center w-full h-full text-muted-foreground">
                            No image available
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 items-start text-black">
                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-sm text-muted-foreground">{formatDate(post.date)} | </p>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <Clock className="w-3 h-3" />
                                <span>{readingTime} min read</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-primary uppercase rounded-md text-sm">{categoryName}</p>

                </div>
                <h3
                    dangerouslySetInnerHTML={{
                        __html: post.title?.rendered || "Untitled Post",
                    }}
                    className="text-xl text-black font-medium transition-all"
                ></h3>
                <div
                    className="text-md text-black/60"
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

export async function generateMetadata({ params }: NewsroomPostPageProps): Promise<Metadata> {
    try {
        const post = await getNewsroomPostBySlug(params.slug);

        if (!post) {
            return {
                title: 'News Not Found | Luxury Insights',
                description: 'The requested news article could not be found.',
            }
        }

        // Get featured image
        const media = post.featured_media ? await getFeaturedMediaById(post.featured_media) : null;
        const featuredImage = media?.source_url || '/og-default.jpg';

        // Get category
        const category = post.newsroom_categories?.[0] ? await getNewsroomCategoryById(post.newsroom_categories[0]) : null;

        // Clean HTML from title and excerpt
        const cleanTitle = post.title?.rendered?.replace(/<[^>]*>/g, '') || 'News Article';
        const cleanExcerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) ||
            post.content?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) ||
            'Read this latest news about luxury real estate market and industry updates.';

        return {
            title: `${cleanTitle} | Latest News`,
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
                canonical: `https://bestbrandedresidences.com/newsroom/${params.slug}`,
            },
        };
    } catch (error) {
        console.error('Error generating newsroom post metadata:', error)
        return {
            title: 'News Article | Latest News',
            description: 'Read latest news about luxury real estate market and industry updates.',
        }
    }
}

export default async function NewsroomPostPage({ params, searchParams }: NewsroomPostPageProps) {
    const post = await getNewsroomPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // Fetch additional data
    const [media, author, category] = await Promise.all([
        post.featured_media ? getFeaturedMediaById(post.featured_media) : null,
        post.author ? getAuthorById(post.author) : null,
        post.newsroom_categories?.[0] ? getNewsroomCategoryById(post.newsroom_categories[0]) : null,
    ]);

    // Fetch related posts from the same category
    const relatedPosts = category ? await getNewsroomPostsByCategory(category.id) : [];
    const filteredRelatedPosts = relatedPosts
        .filter(relatedPost => relatedPost.id !== post.id)
        .slice(0, 3);

    // Pre-fetch all data for related posts
    const relatedPostsWithData = await Promise.all(
        filteredRelatedPosts.map(async (relatedPost) => {
            await Promise.all([
                relatedPost.featured_media ? getFeaturedMediaById(relatedPost.featured_media) : null,
                relatedPost.author ? getAuthorById(relatedPost.author) : null,
                relatedPost.categories?.[0] ? getNewsroomCategoryById(relatedPost.categories[0]) : null,
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
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-6">
                    <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full  lg:max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto lg:px-4 py-4 ">
                            <Link href="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/about-us" className="hover:text-primary transition-colors">
                                About us
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/newsroom" className="hover:text-primary transition-colors text-white">
                                Newsroom
                            </Link>
                        </div>
                        <div className="w-full mx-auto items-center flex flex-col gap-6 lg:px-12 mb-12">
                            <div className="uppercase text-primary w-full lg:w-[70%] text-left lg:text-center">
                                {category?.name || "NEWS & UPDATES"}
                            </div>
                            <h1
                                className="text-3xl lg:text-4xl font-medium w-full xl:w-[70%] text-left lg:text-center"
                                dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
                            />
                            <div className="flex w-full lg:w-[70%] items-start lg:items-center justify-start lg:justify-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{readingTime} min read</span>
                                </div>
                                <span>•</span>
                                <span>{date}</span>
                            </div>
                        </div>
                        {media?.source_url && (
                            <div className="relative w-full h-[250px] rounded-lg">
                                <div className="absolute top-0 left-0 w-full h-[400px]">
                                    <img
                                        src={media.source_url}
                                        alt={post.title?.rendered || "Post thumbnail"}
                                        className="absolute top-0 left-0 w-full h-full object-cover border border-4 border-white rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white bg-white border-t border-t border-t-4 border-primary ">
                <div className="pt-[100px] flex flex-col items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 gap-4 xl:gap-8 single-blog-content">
                    <div className="w-full text-black flex gap-4 mx-auto space-y-8 relative xl:max-w-[1600px] mx-auto">


                        <div
                            className="prose prose-lg prose-headings:font-medium prose-h1:text-4xl prose-h2:text-3xl 
                            prose-h3:text-2xl prose-h4:text-xl prose-headings:my-6 prose-headings:text-foreground 
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-lg prose-img:my-8 w-full lg:w-[70%] mx-auto pb-8"
                            dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
                        />
                    </div>

                </div>
                <SectionLayout>

                    <div className="w-full xl:max-w-[1600px] mx-auto text-black ">
                        <h2 className="text-4xl font-medium">Read more Technology & Innovation releases</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {relatedPostsWithData.map((relatedPost) => (
                                <ClientPostCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>

            <NewsletterBlock />
        </>
    );
} 