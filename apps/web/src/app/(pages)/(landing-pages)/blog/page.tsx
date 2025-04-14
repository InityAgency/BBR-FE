import {
    getAllPosts,
    getAllAuthors,
    getAllTags,
    getAllCategories,
    searchAuthors,
    searchTags,
    searchCategories,
  } from "@/lib/wordpress/wordpress";
  
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
//   import { Section, Container, Prose } from "@/components/craft";
  import { PostCard } from "@/components/web/Posts/PostCard";
  import { Tabs } from "@/components/web/Posts/Tabs";
  import { SearchInput } from "@/components/web/Posts/SearchInput";
  
//   import { FilterPosts } from "@/components/web/Posts/FilterPosts";
//   import { SearchInput } from "@/components/web/Posts/SearchInput";
  
  import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
  
  export const metadata: Metadata = {
    title: "Blog Posts",
    description: "Browse all our blog posts",
  };
  
  export const dynamic = "auto";
  export const revalidate = 600;
  
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
      const { author, tag, category, page: pageParam, search } = searchParams;
  
      // Fetch data based on search parameters
      const [posts, authors, tags, categories] = await Promise.all([
        getAllPosts({ author, tag, category, search }),
        search ? searchAuthors(search) : getAllAuthors(),
        search ? searchTags(search) : getAllTags(),
        getAllCategories(), // Always get all categories
      ]);
  
      // Filter categories that have posts (without considering current category filter)
      const allPosts = await getAllPosts();
      const categoriesWithPosts = categories.filter(cat => 
        allPosts.some(post => post.categories?.includes(cat.id))
      );
  
      // Handle pagination
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const postsPerPage = 9;
      const totalPages = Math.ceil(posts.length / postsPerPage);
      const paginatedPosts = posts.slice(
        (page - 1) * postsPerPage,
        page * postsPerPage
      );
  
      // Create pagination URL helper
      const createPaginationUrl = (newPage: number) => {
        const params = new URLSearchParams();
        if (newPage > 1) params.set("page", newPage.toString());
        if (category) params.set("category", category);
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
              <div className="bg-secondary">
                  <div className="max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 py-8 space-y-8">
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