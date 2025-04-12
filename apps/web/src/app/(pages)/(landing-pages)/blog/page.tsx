import { getPosts } from '@/lib/wordpress/queries';
import { WPPost } from '@/lib/wordpress/types';
import Link from 'next/link';

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: WPPost) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="flex flex-col gap-4 p-6 rounded-xl blog-card relative transition-transform duration-300 ease-in-out transform hover:-translate-y-2">
                        {post.featuredImage && (
                            <img
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.featuredImage.node.altText}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-3xl mb-2" dangerouslySetInnerHTML={{ __html: post.title }} />
                            <div className="text-white/80 text-lg mb-4" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}