import { WPPostsResponse, WPPost } from './types';
import { fetchGraphQL } from './api';

export const GET_POSTS = `
    query GetPosts($first: Int = 10) {
        posts(first: $first) {
            edges {
                node {
                    id
                    title(format: RENDERED)
                    content(format: RENDERED)
                    excerpt(format: RENDERED)
                    date
                    slug
                    featuredImage {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                    categories {
                        nodes {
                            name
                            slug
                        }
                    }
                }
            }
        }
    }
`;

export async function getPosts(first: number = 10): Promise<WPPost[]> {
    try {
        const response = await fetchGraphQL<WPPostsResponse>(GET_POSTS, { first });
        console.log(response);
        
        if (!response.data?.posts?.edges) {
            console.error('Invalid response structure:', response);
            return [];
        }

        return response.data.posts.edges.map(edge => edge.node);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
} 