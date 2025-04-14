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
export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all our blog posts",
};

export const dynamic = "auto";
export const revalidate = 600;

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
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12">
          <div className="page-header flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold text-center w-[50%] mx-auto">Discover Exclusive Insights and Trends in the Luxury Market</h1>
          </div>
        </div>
        
        {/* Featured posts section */}
        <div className="flex flex-col items-start lg:items-center rounded-b-xl max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 pt-12 pb-16 gap-4 xl:gap-8 mb-12">
        
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
              <div className="lg:col-span-1 flex flex-col gap-2 border rounded-lg border-white/10 px-4 py-2">
                {featuredPosts[2] && <FeaturedPostNoImage post={featuredPosts[2]} />}
                <div className="border-t border-white/10 w-full"></div>
                {featuredPosts[3] && <FeaturedPostNoImage post={featuredPosts[3]} />}
              </div>
            </div>
        </div>
        
        {/* Main posts section */}
        <div className="bg-secondary">
          <div className="max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 py-20 space-y-8">
            <div className="flex justify-between items-center">
              <h2 id="latest-articles" className="text-4xl font-bold">Latest Articles</h2>
              <SearchInput />
            </div>

            <Tabs categories={categoriesWithPosts} />
            
            {paginatedPosts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
                <p>No posts found</p>
              </div>
            )}
    
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
          </div>
        </div>
        <NewsletterBlock />
      </>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-red-500">Error loading blog posts</h1>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }
}