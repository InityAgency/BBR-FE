// components/seo/StructuredData.tsx

interface StructuredDataProps {
    type: 'residence' | 'organization' | 'breadcrumb'
    data: any
}

// Helper funkcija za kreiranje media URL-a
function getMediaUrl(mediaId: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${mediaId}/content`;
}

// Helper funkcija za pravilno spajanje URL-ova
function joinUrls(baseUrl: string, path: string): string {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
}

export function StructuredData({ type, data }: StructuredDataProps) {
    const generateSchema = () => {
        switch (type) {
            case 'residence':
                // Proveravamo da li postoje potrebni podaci
                if (!data) return {}

                return {
                    "@context": "https://schema.org",
                    "@type": "RealEstateAgent",
                    "name": data.name || '',
                    "description": data.description || '',
                    "address": data.city && data.country ? {
                        "@type": "PostalAddress",
                        "addressLocality": data.city?.name || '',
                        "addressCountry": data.country?.name || '',
                        "streetAddress": data.address || ''
                    } : undefined,
                    "geo": data.latitude && data.longitude ? {
                        "@type": "GeoCoordinates",
                        "latitude": data.latitude,
                        "longitude": data.longitude
                    } : undefined,
                    "image": data.featuredImage?.id ? getMediaUrl(data.featuredImage.id) : '',
                    "priceRange": data.budgetStartRange && data.budgetEndRange
                        ? `$${data.budgetStartRange} - $${data.budgetEndRange}`
                        : undefined,
                    "brand": data.brand?.name ? {
                        "@type": "Brand",
                        "name": data.brand.name
                    } : undefined
                }

            case 'organization':
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestbrandedresidences.com";
                return {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Best Branded Residences",
                    "url": siteUrl,
                    "logo": joinUrls(siteUrl, "/logo.png"),
                    "sameAs": [
                        "https://twitter.com/bestbrandedresidences",
                        "https://linkedin.com/company/best-branded-residences"
                    ]
                }

            case 'breadcrumb':
                if (!data || !Array.isArray(data)) return {}

                return {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": data.map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.name,
                        "item": item.url
                    }))
                }

            default:
                return {}
        }
    }

    const schema = generateSchema()

    // Ne renderuj ništa ako nema schema podataka
    if (!schema || Object.keys(schema).length === 0) {
        return null
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
            }}
        />
    )
}