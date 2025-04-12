const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{
        message: string;
    }>;
}

export async function fetchGraphQL<T>(
    query: string,
    variables: Record<string, unknown> = {}
): Promise<GraphQLResponse<T>> {
    try {
        if (!WP_API_URL) {
            throw new Error('WordPress GraphQL endpoint URL is not defined');
        }

        const response = await fetch(WP_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error(result.errors[0].message);
        }

        return result;
    } catch (error) {
        console.error('Error fetching GraphQL data:', error);
        throw error;
    }
} 