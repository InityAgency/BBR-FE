"use client";

import { useState, useEffect, useRef } from "react";
import { getAllPosts, getAllCategories } from "@/lib/wordpress/wordpress";
import { SearchInput } from "@/components/web/Posts/SearchInput";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import { Post } from "@/lib/wordpress/wordpress.d";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";    

interface Category {
    id: number;
    name: string;
    slug: string;
}

// Loading komponenta
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    <span className="ml-2 text-white">Loading...</span>
  </div>
);

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
      href={`/blog/${post.slug}`}
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

// Client-side PostCardNoImage komponenta
const ClientPostCardNoImage = ({ post }: { post: Post }) => {
  const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  
  // Simulacija reading time kalkulacije
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };
  
  const readingTime = calculateReadingTime(post.content?.rendered || "");
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-8 hover:bg-zinc-800/20 transition-all hover:-translate-y-2"
    >
      <div className="flex flex-col gap-4">
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
          className="text-sm text-muted-foreground"
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

// Tabs komponenta
const Tabs = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: Category[], 
  activeCategory: string, 
  onCategoryChange: (slug: string) => void 
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (categorySlug: string) => {
    onCategoryChange(categorySlug);
    
    // Scroll to tabs after category change
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }, 100);
  };

  return (
    <div ref={tabsRef} className="flex gap-2 flex-wrap border-b border-border w-full mb-6">
      <button
        className={!activeCategory ? "active-tab" : "classic-tab"}
        onClick={() => handleTabClick("")}
        type="button"
      >
        All
      </button>   
      {categories.map((category) => (
        <button
          key={category.id}
          className={activeCategory === category.slug ? "active-tab" : "classic-tab"}
          onClick={() => handleTabClick(category.slug)}
          type="button"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};


export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const postsPerPage = 9;

  // Učitavanje početnih podataka
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching initial data...');
        
        const [postsData, categoriesData] = await Promise.all([
          getAllPosts(),
          getAllCategories()
        ]);
        
        console.log('Posts fetched:', postsData?.length || 0);
        console.log('Categories fetched:', categoriesData?.length || 0);
        
        if (postsData && Array.isArray(postsData)) {
          setAllPosts(postsData);
        } else {
          console.error('Invalid posts data:', postsData);
          setAllPosts([]);
        }
        
        if (categoriesData && Array.isArray(categoriesData)) {
          // Filter categories that have posts
          const categoriesWithPosts = categoriesData.filter(cat => 
            postsData?.some(post => post.categories?.includes(cat.id))
          );
          setCategories(categoriesWithPosts);
        } else {
          console.error('Invalid categories data:', categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load blog data. Please try again later.');
        setAllPosts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter posts based on active filters
  const getFilteredPosts = () => {
    if (!Array.isArray(allPosts)) return [];
    
    let filtered = [...allPosts];

    // Filter by category
    if (activeCategory) {
      const selectedCategory = categories.find(cat => cat.slug === activeCategory);
      if (selectedCategory) {
        filtered = filtered.filter(post => 
          post.categories?.includes(selectedCategory.id)
        );
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title?.rendered?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.rendered?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Get featured posts (first 4 from all posts)
  const featuredPosts = Array.isArray(allPosts) ? allPosts.slice(0, 4) : [];
  const featuredPostIds = featuredPosts.map(post => post.id);

  // Get filtered posts (exclude featured if showing all)
  const filteredPosts = getFilteredPosts();
  const postsToShow = !activeCategory && !searchQuery 
    ? filteredPosts.filter(post => !featuredPostIds.includes(post.id))
    : filteredPosts;

  // Pagination
  const totalPages = Math.ceil(postsToShow.length / postsPerPage);
  const paginatedPosts = postsToShow.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setPostsLoading(true);
    setActiveCategory(categorySlug);
    setCurrentPage(1);
    
    // Simulate loading delay
    setTimeout(() => {
      setPostsLoading(false);
    }, 300);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>  
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
        <div className="page-header flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[50%] mx-auto">
            Discover Exclusive Insights and Trends in the Luxury Market
          </h1>
        </div>
      </div>
      
      {/* Featured posts section */}
      {featuredPosts.length > 0 && (
        <SectionLayout>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 w-full">
              Dive into this week's trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {featuredPosts[0] && <ClientPostCard post={featuredPosts[0]} />}
              </div>
              <div className="lg:col-span-1">
                {featuredPosts[1] && <ClientPostCard post={featuredPosts[1]} />}
              </div>
              
              <div className="lg:col-span-1 flex flex-col gap-2 border rounded-lg border-white/10 px-4 py-4 justify-between">
                {featuredPosts[2] && <ClientPostCardNoImage post={featuredPosts[2]} />}
                <div className="border-t border-white/10 w-full"></div>
                {featuredPosts[3] && <ClientPostCardNoImage post={featuredPosts[3]} />}
              </div>
            </div>
          </div>
        </SectionLayout>
      )}
      
      {/* Main posts section */}
      <SectionLayout>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between items-center w-full mb-6 lg:mb-0 xl:max-w-[1600px] mx-auto">
          <h2 className="text-4xl font-bold text-left w-full">Latest Articles</h2>
          <SearchInput onSearch={handleSearch} />
        </div>
        
        <div className="w-full xl:max-w-[1600px] mx-auto">
          <Tabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <div className="w-full xl:max-w-[1600px] mx-auto">
          {postsLoading ? (
            <LoadingSpinner />
          ) : paginatedPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {paginatedPosts.map((post) => (
                <ClientPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-secondary flex items-center justify-center">
              <p className="text-white text-lg">No posts found</p>
            </div>
          )}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </SectionLayout>
      
      <NewsletterBlock />
    </>
  );
}