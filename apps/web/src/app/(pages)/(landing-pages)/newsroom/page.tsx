"use client";

import { useState, useEffect, useRef } from "react";
import { getAllNewsroomPosts, getNewsroomCategories } from "@/lib/wordpress/wordpress";
import { SearchInput } from "@/components/web/Posts/SearchInput";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import { Post } from "@/lib/wordpress/wordpress.d";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";    
import { formatDate } from "@/lib/utils";

interface Category {
    id: number;
    name: string;
    slug: string;
    count: number;
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
      href={`/newsroom/${post.slug}`}
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
  onCategoryChange,
  isWhite
}: { 
  categories: Category[], 
  activeCategory: string, 
  onCategoryChange: (slug: string) => void,
  isWhite: boolean
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
    <div ref={tabsRef} className={`flex gap-2 flex-wrap border-b border-border w-full mb-6 ${isWhite ? "border-b border-b-[#E7D6C6]" : ""}`}>
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

export default function NewsroomPage() {
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
        
        console.log('Fetching initial newsroom data...');
        
        const [postsData, categoriesData] = await Promise.all([
          getAllNewsroomPosts(),
          getNewsroomCategories()
        ]);
        
        console.log('Newsroom posts fetched:', postsData?.length || 0);
        console.log('Newsroom categories fetched:', categoriesData?.length || 0);
        console.log('Posts with categories:', postsData?.map(post => ({ id: post.id, categories: post.categories })));
        console.log('Categories with count:', categoriesData?.map(cat => ({ id: cat.id, name: cat.name, count: cat.count })));
        
        if (postsData && Array.isArray(postsData)) {
          setAllPosts(postsData);
        } else {
          console.error('Invalid newsroom posts data:', postsData);
          setAllPosts([]);
        }
        
        if (categoriesData && Array.isArray(categoriesData)) {
          // Filter categories that have posts (count > 0)
          const categoriesWithPosts = categoriesData.filter(cat => cat.count > 0);
          setCategories(categoriesWithPosts);
        } else {
          console.error('Invalid newsroom categories data:', categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching newsroom data:', error);
        setError('Failed to load newsroom data. Please try again later.');
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
        console.log('Filtering by category:', selectedCategory.name, 'ID:', selectedCategory.id);
        console.log('All posts categories:', allPosts.map(post => ({ id: post.id, categories: post.categories })));
        
        filtered = filtered.filter(post => {
          console.log('Post:', post);
          // Probaj oba polja
          const catField = post.newsroom_categories || post.categories;
          const hasCategory = catField?.includes(selectedCategory.id);
          console.log(`Post ${post.id} has category ${selectedCategory.id}:`, hasCategory, 'catField:', catField);
          return hasCategory;
        });
        
        console.log('Filtered posts count:', filtered.length);
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

  // Get filtered posts
  const filteredPosts = getFilteredPosts();
  const postsToShow = filteredPosts;

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
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 lg:mb-12">
        <div className="page-header flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-bold text-left lg:text-left w-full lg:w-[50%] mx-auto ms-0">
            Explore our latest news and announcements
          </h1>
          <p className="text-md text-white/70 w-full lg:w-[50%] mx-auto ms-0">
          Dive into our latest news and announcements to stay informed, inspired, and up-to-date with everything happening across our community, projects, and initiatives.
          </p>
        </div>
      </div>
      <div className="bg-white text-black">
        {/* Main posts section */}
        <SectionLayout>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between items-center w-full mb-6 lg:mb-0 xl:max-w-[1600px] mx-auto">
            <h2 className="text-4xl font-bold text-left w-full">Press releases</h2>
            <SearchInput onSearch={handleSearch} isWhite={true} />
          </div>
          
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <Tabs 
              isWhite={true}
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
              <div className="h-24 w-full border border-[#E0E0E0] rounded-lg bg-white flex items-center justify-center">
                <p className="text-black text-lg">No news found</p>
              </div>
            )}
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </SectionLayout>
      </div>
      
      
      <NewsletterBlock />
    </>
  );
} 