import { useState, useEffect } from 'react';
import { getAllNewsroomPosts, getNewsroomCategories } from '@/lib/wordpress/wordpress';
import { Post } from '@/lib/wordpress/wordpress.d';

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface UseNewsroomReturn {
  posts: Post[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNewsroom(): UseNewsroomReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postsData, categoriesData] = await Promise.all([
        getAllNewsroomPosts(),
        getNewsroomCategories()
      ]);

      if (postsData && Array.isArray(postsData)) {
        setPosts(postsData);
      } else {
        setPosts([]);
      }

      if (categoriesData && Array.isArray(categoriesData)) {
        // Filter categories that have posts (count > 0)
        const categoriesWithPosts = categoriesData.filter(cat => cat.count > 0);
        setCategories(categoriesWithPosts);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching newsroom data:', err);
      setError('Failed to load newsroom data');
      setPosts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    posts,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
} 