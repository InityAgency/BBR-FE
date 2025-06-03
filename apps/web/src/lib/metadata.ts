// lib/seo/metadata.ts
import type { Metadata } from 'next'

// Helper funkcija za kreiranje media URL-a
export function getMediaUrl(mediaId: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${mediaId}/content`;
}

// Base metadata konfiguracija
const baseConfig = {
  siteName: 'Best Branded Residences',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://bestbrandedresidences.com',
  defaultImage: '/bbr-cover.png',
  twitterHandle: '@bbr_residences',
}

// Tipovi za različite stranice
export interface ResidenceMetadata {
  type: 'residence'
  data: {
    name: string
    subtitle?: string
    description?: string
    slug: string
    featuredImage?: { id: string }
    city?: { name: string }
    country?: { name: string }
    brand?: { name: string }
    budgetStartRange?: string
    budgetEndRange?: string
  }
}

export interface CategoryMetadata {
  type: 'category'
  data: {
    name: string
    title: string
    description?: string
    slug: string
    featuredImage?: { id: string }
    residenceLimitation?: number
  }
}

export interface PageMetadata {
  type: 'page'
  data: {
    title: string
    description?: string
    slug?: string
    image?: string
    keywords?: string[]
  }
}

export interface BlogMetadata {
  type: 'blog'
  data: {
    search?: string
    category?: string
    author?: string
    tag?: string
    page?: number
  }
}

export interface BlogPostMetadata {
  type: 'blogPost'
  data: {
    title: { rendered: string }
    excerpt?: { rendered: string }
    content?: { rendered: string }
    slug: string
    date: string
    modified?: string
    featured_media?: number
    author?: number
    categories?: number[]
    _embedded?: {
      'wp:featuredmedia'?: Array<{ source_url: string }>
      'wp:term'?: Array<Array<{ name: string }>>
      author?: Array<{ name: string }>
    }
  }
}

export interface CareerMetadata {
  type: 'career'
  data: {
    search?: string
    category?: string
    page?: number
  }
}

export interface CareerPostMetadata {
  type: 'careerPost'
  data: {
    title: { rendered: string }
    excerpt?: { rendered: string }
    content?: { rendered: string }
    slug: string
    date: string
    modified?: string
    featured_media?: number
    class_list?: string[]
    acf?: {
      location?: string
      salary?: {
        from?: string
        to?: string
      }
      about_the_role?: string
      key_responsibilities?: string
      qualifications?: string
    }
    _embedded?: {
      'wp:featuredmedia'?: Array<{ source_url: string }>
    }
  }
}

export type MetadataConfig = ResidenceMetadata | CategoryMetadata | PageMetadata | BlogMetadata | BlogPostMetadata | CareerMetadata | CareerPostMetadata

// Glavna funkcija za generisanje metadata
export function generatePageMetadata(config: MetadataConfig): Metadata {
  const { type, data } = config
  
  switch (type) {
    case 'residence':
      return generateResidenceMetadata(data)
    case 'category': 
      return generateCategoryMetadata(data)
    case 'page':
      return generateBasicPageMetadata(data)
    case 'blog':
      return generateBlogMetadata(data)
    case 'blogPost':
      return generateBlogPostMetadata(data)
    case 'career':
      return generateCareerMetadata(data)
    case 'careerPost':
      return generateCareerPostMetadata(data)
    default:
      return getDefaultMetadata()
  }
}

// Residence metadata
function generateResidenceMetadata(residence: ResidenceMetadata['data']): Metadata {
  const title = residence.name
  const description = residence.subtitle || residence.description?.slice(0, 160) || `Luxury residence in ${residence.city?.name || 'premium location'}`
  const url = `/residences/${residence.slug}`
  const image = residence.featuredImage?.id ? getMediaUrl(residence.featuredImage.id) : baseConfig.defaultImage
  
  const keywords = [
    residence.name,
    residence.city?.name,
    residence.country?.name,
    'luxury residence',
    'branded residences',
    residence.brand?.name
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} - Luxury Residence${residence.city?.name ? ` in ${residence.city.name}` : ''}`,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: baseConfig.twitterHandle,
      images: [image],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Category metadata  
function generateCategoryMetadata(category: CategoryMetadata['data']): Metadata {
  const title = `Best Branded Residences in ${category.title}`
  const description = category.description || `Discover the top ${category.residenceLimitation || 10} luxury branded residences in ${category.title}. Exclusive rankings and detailed insights.`
  const url = `/best-residences/${category.slug}`
  const image = category.featuredImage?.id ? getMediaUrl(category.featuredImage.id) : baseConfig.defaultImage
  
  const keywords = [
    `best residences ${category.title}`,
    `luxury residences ${category.title}`,
    'branded residences',
    'luxury real estate',
    category.name
  ]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: baseConfig.twitterHandle,
      images: [image],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Basic page metadata
function generateBasicPageMetadata(page: PageMetadata['data']): Metadata {
  const title = `${page.title} | ${baseConfig.siteName}`
  const description = page.description || `${page.title} - Discover luxury branded residences worldwide`
  const url = page.slug ? `/${page.slug}` : '/'
  const image = page.image || baseConfig.defaultImage
  
  const keywords = page.keywords || [
    'luxury residences',
    'branded residences', 
    'real estate',
    'luxury real estate'
  ]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: baseConfig.twitterHandle,
      images: [image],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Blog listing metadata
function generateBlogMetadata(blog: BlogMetadata['data']): Metadata {
  let title = 'Luxury Insights - Latest Articles'
  let description = 'Discover exclusive insights and trends in the luxury real estate market. Expert analysis, market trends, and industry news.'
  let url = '/blog'
  
  // Customize based on filters
  if (blog.category) {
    title = `${blog.category} Articles - Luxury Insights`
    description = `Latest articles about ${blog.category} in luxury real estate. Expert insights and market analysis.`
    url = `/blog?category=${blog.category}`
  }
  
  if (blog.search) {
    title = `Search Results for "${blog.search}" - Luxury Insights`
    description = `Search results for "${blog.search}" in luxury real estate articles and insights.`
    url = `/blog?search=${blog.search}`
  }
  
  if (blog.author) {
    title = `Articles by ${blog.author} - Luxury Insights`
    description = `Latest articles and insights by ${blog.author} about luxury real estate market.`
    url = `/blog?author=${blog.author}`
  }
  
  if (blog.page && blog.page > 1) {
    title = `${title} - Page ${blog.page}`
    url = `${url}${url.includes('?') ? '&' : '?'}page=${blog.page}`
  }

  const keywords = [
    'luxury real estate blog',
    'market insights',
    'luxury market trends',
    'real estate analysis',
    'luxury property news',
    blog.category,
    blog.search
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: baseConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: baseConfig.twitterHandle,
      images: [baseConfig.defaultImage],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Blog post metadata
function generateBlogPostMetadata(post: BlogPostMetadata['data']): Metadata {
  const title = post.title?.rendered?.replace(/<[^>]*>/g, '') || 'Blog Post'
  const description = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) || 
                     post.content?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) || 
                     'Read this insightful article about luxury real estate market trends and analysis.'
  
  const url = `/blog/${post.slug}`
  const publishedDate = new Date(post.date).toISOString()
  const modifiedDate = post.modified ? new Date(post.modified).toISOString() : publishedDate
  
  // Get featured image
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || baseConfig.defaultImage
  
  // Get category and author
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name
  const author = post._embedded?.author?.[0]?.name
  
  const keywords = [
    title.toLowerCase(),
    'luxury real estate',
    'market analysis',
    'luxury insights',
    category,
    'luxury property trends'
  ].filter(Boolean) as string[]

  return {
    title: `${title} | Luxury Insights`,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: author ? [author] : undefined,
      section: category,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: baseConfig.twitterHandle,
      images: [featuredImage],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Career listing metadata
function generateCareerMetadata(career: CareerMetadata['data']): Metadata {
  let title = 'Career Opportunities - Join Our Team'
  let description = 'Explore exciting career opportunities at Best Branded Residences. Join our team and help shape the future of luxury real estate.'
  let url = '/careers'
  
  // Customize based on filters
  if (career.category) {
    title = `${career.category} Jobs - Career Opportunities`
    description = `Find ${career.category} positions at Best Branded Residences. Exciting opportunities in luxury real estate.`
    url = `/careers?category=${career.category}`
  }
  
  if (career.search) {
    title = `Search Results for "${career.search}" - Career Opportunities`
    description = `Job search results for "${career.search}" at Best Branded Residences.`
    url = `/careers?search=${career.search}`
  }
  
  if (career.page && career.page > 1) {
    title = `${title} - Page ${career.page}`
    url = `${url}${url.includes('?') ? '&' : '?'}page=${career.page}`
  }

  const keywords = [
    'career opportunities',
    'luxury real estate jobs',
    'join our team',
    'employment opportunities',
    'real estate careers',
    career.category,
    career.search
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: baseConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: baseConfig.twitterHandle,
      images: [baseConfig.defaultImage],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Helper funkcija za dohvatanje kategorije iz class_list-a
function getCategoryFromClassList(classList?: string[]): string {
  if (!Array.isArray(classList)) return "General";
  
  const categoryClass = classList.find(cls => cls.startsWith('career_category-'));
  if (!categoryClass) return "General";
  
  return categoryClass
    .replace('career_category-', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Career post metadata
function generateCareerPostMetadata(post: CareerPostMetadata['data']): Metadata {
  const title = post.title?.rendered?.replace(/<[^>]*>/g, '') || 'Career Opportunity'
  const category = getCategoryFromClassList(post.class_list)
  const location = post.acf?.location || 'Remote'
  const salaryFrom = post.acf?.salary?.from || ''
  const salaryTo = post.acf?.salary?.to || ''
  
  let description = `Join our team as ${title} in ${location}. `
  if (salaryFrom && salaryTo) {
    description += `Salary: ${salaryFrom} - ${salaryTo}. `
  }
  description += 'Explore this exciting opportunity in luxury real estate.'
  
  const url = `/careers/${post.slug}`
  const publishedDate = new Date(post.date).toISOString()
  const modifiedDate = post.modified ? new Date(post.modified).toISOString() : publishedDate
  
  // Get featured image
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || baseConfig.defaultImage
  
  const keywords = [
    title.toLowerCase(),
    `${title} job`,
    `${category} position`,
    `${location} jobs`,
    'career opportunity',
    'luxury real estate jobs',
    'employment'
  ].filter(Boolean) as string[]

  return {
    title: `${title} - Career Opportunity | ${baseConfig.siteName}`,
    description,
    keywords,
    openGraph: {
      title: `${title} - ${location}`,
      description,
      url: `${baseConfig.siteUrl}${url}`,
      siteName: baseConfig.siteName,
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      section: category,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${location}`,
      description,
      creator: baseConfig.twitterHandle,
      images: [featuredImage],
    },
    alternates: {
      canonical: `${baseConfig.siteUrl}${url}`,
    },
  }
}

// Default fallback metadata
function getDefaultMetadata(): Metadata {
  return {
    title: baseConfig.siteName,
    description: 'Discover the world\'s finest luxury branded residences',
    keywords: ['luxury residences', 'branded residences', 'real estate'],
  }
}

// Async verzija za API pozive
export async function generateAsyncMetadata(
  fetchFunction: () => Promise<any>,
  config: Omit<MetadataConfig, 'data'> & { slug?: string }
): Promise<Metadata> {
  try {
    const data = await fetchFunction()
    
    if (!data) {
      return getDefaultMetadata()
    }
    
    return generatePageMetadata({
      ...config,
      data: { ...data, slug: config.slug || data.slug }
    } as MetadataConfig)
    
  } catch (error) {
    console.error('Error generating metadata:', error)
    return getDefaultMetadata()
  }
}

// Dodati strukturnu data za bolje razumevanje sadržaja od strane pretraživača
export const generateStructuredData = (data: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "BestBrandedResidences",
    "name": data.name,
    "description": data.description,
    "url": `${baseConfig.siteUrl}${data.slug}`,
    "image": data.featuredImage?.id ? getMediaUrl(data.featuredImage.id) : baseConfig.defaultImage,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": data.city?.name,
      "addressCountry": data.country?.name
    }
  }
}

// Dodati dinamički robots.txt generator
export async function generateRobotsTxt() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: 'https://bestbrandedresidences.com/sitemap.xml',
  }
}