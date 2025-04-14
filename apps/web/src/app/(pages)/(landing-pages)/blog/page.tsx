
import Link from 'next/link';
import { getPosts } from '@/lib/wordpress/api';

export default async function BlogPage() {
    const posts = await getPosts();
    console.log(posts);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
            </div>
        </div>
    );
}