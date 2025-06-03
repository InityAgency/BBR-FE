import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
  getCategoryBySlug,
} from "@/lib/wordpress/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { PostCard } from "@/components/web/Posts/PostCard";
import { Tabs } from "@/components/web/Posts/Tabs";
import { SearchInput } from "@/components/web/Posts/SearchInput";

import type { Metadata } from "next";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import Link from "next/link";
import { Post } from "@/lib/wordpress/wordpress.d";
import { PostCardNoImage } from "@/components/web/Posts/PostCardNoImage";
import SectionLayout from "@/components/web/SectionLayout";

export const dynamic = 'force-dynamic';
export const revalidate = 600;

import { generatePageMetadata } from '@/lib/metadata'

export async function generateMetadata({ searchParams }: {
  searchParams: {
    author?: string;
    tag?: string; 
    category?: string;
    page?: string;
    search?: string;
  };
}): Promise<Metadata> {
  const baseMetadata = {
    title: 'Discover Exclusive Insights and Trends in the Luxury Market from BBR',
    description: 'Trends and Insights in Luxury Living by Best Brand Residences. Explore expert analysis, trends, and stories shaping luxury branded residences.',
  };

  // Ako imamo filtere, dodajemo ih u title
  if (searchParams.category || searchParams.author || searchParams.tag || searchParams.search) {
    return generatePageMetadata({
      type: 'blog',
      data: {
        search: searchParams.search,
        category: searchParams.category,
        author: searchParams.author,
        tag: searchParams.tag,
        page: searchParams.page ? parseInt(searchParams.page) : undefined
      }
    });
  }

  // Za glavnu blog stranicu koristimo base metadata
  return {
    ...baseMetadata,
    openGraph: {
      title: baseMetadata.title,
      description: baseMetadata.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: baseMetadata.title,
      description: baseMetadata.description,
    }
  };
}

// Featured post card with image
const FeaturedPostWithImage = ({ post }: { post: Post }) => {
  const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Market trends';
  const readingTime = '5 min read'; // Postavite odgovarajući property ako imate čitanje vremena u postu
  
  return (
    <PostCard post={post} />
  );
};

// Featured post card without image
const FeaturedPostNoImage = ({ post }: { post: Post }) => {
  const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Market trends';
  
  return (
    <PostCardNoImage post={post} />
  );
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: {
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  };
}) {
  try {
    const { author, tag, category: categorySlug, page: pageParam, search } = searchParams;

    // Fetch all posts for featured section
    const allPosts = await getAllPosts();
    
    // Get the latest 4 posts for the featured section
    const featuredPosts = allPosts.slice(0, 4);
    
    // Get the IDs of the featured posts
    const featuredPostIds = featuredPosts.map(post => post.id);
    
    // Convert category slug to ID if needed
    let categoryId = undefined;
    if (categorySlug) {
      const category = await getCategoryBySlug(categorySlug);
      if (category) {
        categoryId = category.id.toString();
      }
    }
    
    // Fetch filtered posts based on search parameters
    const [posts, authors, tags, categories] = await Promise.all([
      getAllPosts({ author, tag, category: categoryId, search }),
      search ? searchAuthors(search) : getAllAuthors(),
      search ? searchTags(search) : getAllTags(),
      getAllCategories(),
    ]);
    
    // Only filter out featured posts if no category, author, tag or search is specified
    const isAllPostsView = !categorySlug && !author && !tag && !search;
    
    // Filter out featured posts only if viewing "All" posts
    const filteredPosts = isAllPostsView 
      ? posts.filter(post => !featuredPostIds.includes(post.id))
      : posts;

    // Filter categories that have posts
    const categoriesWithPosts = categories.filter(cat => 
      allPosts.some(post => post.categories?.includes(cat.id))
    );

    // Handle pagination
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const postsPerPage = 9;
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const paginatedPosts = filteredPosts.slice(
      (page - 1) * postsPerPage,
      page * postsPerPage
    );

    // Create pagination URL helper
    const createPaginationUrl = (newPage: number) => {
      const params = new URLSearchParams();
      if (newPage > 1) params.set("page", newPage.toString());
      if (categorySlug) params.set("category", categorySlug);
      if (author) params.set("author", author);
      if (tag) params.set("tag", tag);
      if (search) params.set("search", search);
      return `/blog${params.toString() ? `?${params.toString()}` : ""}`;
    };

    return (
      <>  
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
          <div className="page-header flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto">
            <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[50%] mx-auto">Discover Exclusive Insights and Trends in the Luxury Market</h1>
          </div>
        </div>
        
        {/* Featured posts section */}
        <SectionLayout>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 w-full">Dive into this week's trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First two posts with images */}
              <div className="lg:col-span-1">
                {featuredPosts[0] && <FeaturedPostWithImage post={featuredPosts[0]} />}
              </div>
              <div className="lg:col-span-1">
                {featuredPosts[1] && <FeaturedPostWithImage post={featuredPosts[1]} />}
              </div>
              
              {/* Right column with two posts without images */}
              <div className="lg:col-span-1 flex flex-col gap-2 border rounded-lg border-white/10 px-4 py-4 justify-between">
                {featuredPosts[2] && <FeaturedPostNoImage post={featuredPosts[2]} />}
                <div className="border-t border-white/10 w-full"></div>
                {featuredPosts[3] && <FeaturedPostNoImage post={featuredPosts[3]} />}
              </div>
            </div>
          </div>
        </SectionLayout>
        
        {/* Main posts section */}
        <SectionLayout>
    
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between items-center w-full mb-6 lg:mb-0 xl:max-w-[1600px] mx-auto">
              <h2 id="latest-articles" className="text-4xl font-bold text-left w-full">Latest Articles</h2>
              <SearchInput />
            </div>
            <div className="w-full xl:max-w-[1600px] mx-auto">
              <Tabs categories={categoriesWithPosts} />
            </div>
            <div className="w-full xl:max-w-[1600px] mx-auto">
            {paginatedPosts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="h-24 w-full border rounded-lg bg-secondary flex items-center justify-center">
                <p className="text-white text-lg">No posts found</p>
              </div>
            )}
            </div>
    
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                      href={createPaginationUrl(page - 1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href={createPaginationUrl(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      className={
                        page >= totalPages ? "pointer-events-none opacity-50" : ""
                      }
                      href={createPaginationUrl(page + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
        </SectionLayout>
        <NewsletterBlock />
      </>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] ">
        <h1 className="text-2xl font-bold text-red-500">Error loading blog posts</h1>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }
}