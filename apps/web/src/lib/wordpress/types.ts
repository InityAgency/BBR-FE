export interface WPPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    date: string;
    slug: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
    categories?: {
        nodes: Array<{
            name: string;
            slug: string;
        }>;
    };
}

export interface WPPostEdge {
    node: WPPost;
}

export interface WPPostsResponse {
    posts: {
        edges: WPPostEdge[];
    };
} 