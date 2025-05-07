import { getAllPosts } from "@/lib/wordpress/wordpress";
import { PostCard } from "./PostCard";

export const revalidate = 86400; // 24 hours

export async function LatestPosts() {
  try {
    const posts = await getAllPosts();
    const latestPosts = posts.slice(0, 3);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return null;
  }
} 