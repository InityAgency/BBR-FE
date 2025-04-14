// api.ts
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

// Uvek proverite da li je API_URL definisan
if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
    const headers = {
        'Content-Type': 'application/json',
    }

    // Eksplicitno definišemo URL kao string da bismo zadovoljili TypeScript
    const apiUrl = API_URL as string;
    
    console.log('Šaljem zahtev na:', apiUrl);
    
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, variables }),
            mode: 'cors',
            credentials: 'same-origin',
        });
        
        if (!res.ok) {
            throw new Error(`API odgovor nije uspešan: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json();
        
        if (json.errors) {
            throw new Error('GraphQL greške: ' + JSON.stringify(json.errors));
        }
        
        return json.data;
    } catch (error) {
        console.error('Greška pri fetching-u API-ja:', error);
        throw error;
    }
}

export async function getPosts() {
    const query = `
        query getBlogPosts {
            posts {
                edges {
                    node {
                        id
                        title
                        date
                        excerpt
                        slug
                    }
                }
            }
        }
    `;

    try {
        const data = await fetchAPI(query, {});
        return data.posts.edges.map((edge: any) => edge.node);
    } catch (error) {
        console.error('Greška pri dohvatanju postova:', error);
        return [];
    }
}