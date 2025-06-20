// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'

async function getAllResidences() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences?limit=1000`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching residences:', error)
    return []
  }
}

async function getAllCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/ranking-categories?limit=1000`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getAllBrands() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/brands?limit=1000`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bestbrandedresidences.com'
  const residences = await getAllResidences()
  const categories = await getAllCategories()
  const brands = await getAllBrands()

  // Definišemo statične URL-ove sa prioritetima i frekvencijama
  const staticUrls = [
    // Glavne stranice (prioritet 1.0, dnevno ažuriranje)
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/residences', priority: '0.9', changefreq: 'daily' },
    { url: '/best-residences', priority: '0.9', changefreq: 'daily' },
    { url: '/brands', priority: '0.8', changefreq: 'weekly' },
    
    // Landing stranice (prioritet 0.7-0.8, nedeljno ažuriranje)
    { url: '/about-us', priority: '0.7', changefreq: 'weekly' },
    { url: '/careers', priority: '0.6', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    
    // Legal stranice (prioritet 0.3-0.4, mesečno ažuriranje)
    { url: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
    { url: '/terms-of-service', priority: '0.3', changefreq: 'monthly' },
    { url: '/user-agreement', priority: '0.3', changefreq: 'monthly' },
    { url: '/cookie-policy', priority: '0.3', changefreq: 'monthly' },
    { url: '/gdpr-compliance', priority: '0.3', changefreq: 'monthly' },
    { url: '/accessibility-statement', priority: '0.3', changefreq: 'monthly' },
    { url: '/license-info', priority: '0.3', changefreq: 'monthly' },
    { url: '/corporate-responsibility-legal', priority: '0.3', changefreq: 'monthly' },
    
    // FAQ stranice (prioritet 0.5, mesečno ažuriranje)
    { url: '/faq-buyer', priority: '0.5', changefreq: 'monthly' },
    
    // Business stranice (prioritet 0.6-0.7, nedeljno ažuriranje)
    { url: '/b2b-about-us', priority: '0.6', changefreq: 'weekly' },
    { url: '/developer-solutions', priority: '0.7', changefreq: 'weekly' },
    { url: '/marketing-solutions', priority: '0.7', changefreq: 'weekly' },
    { url: '/investor-relations', priority: '0.6', changefreq: 'weekly' },
    { url: '/pricing', priority: '0.7', changefreq: 'weekly' },
    { url: '/how-it-works', priority: '0.6', changefreq: 'weekly' },
    { url: '/why-choose-us', priority: '0.6', changefreq: 'weekly' },
    { url: '/schedule-a-demo', priority: '0.6', changefreq: 'weekly' },
    
    // Developer stranice (prioritet 0.5-0.6, nedeljno ažuriranje)
    { url: '/developer/onboarding', priority: '0.6', changefreq: 'weekly' },
    { url: '/developer/choose-plan', priority: '0.6', changefreq: 'weekly' },
    { url: '/developer/dashboard', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/residences', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/leads', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/settings', priority: '0.4', changefreq: 'monthly' },
    { url: '/developer/marketing', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/marketing-collateral', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/reviews', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/ranking', priority: '0.5', changefreq: 'weekly' },
    { url: '/developer/billing', priority: '0.4', changefreq: 'monthly' },
    { url: '/developer/billing/upgrade', priority: '0.4', changefreq: 'monthly' },
    { url: '/developer/billing/success', priority: '0.3', changefreq: 'monthly' },
    { url: '/developer/billing/cancel', priority: '0.3', changefreq: 'monthly' },
    
    // Ostale stranice (prioritet 0.4-0.6, nedeljno ažuriranje)
    { url: '/buyer', priority: '0.6', changefreq: 'weekly' },
    { url: '/criteria', priority: '0.5', changefreq: 'weekly' },
    { url: '/exclusive-deals', priority: '0.7', changefreq: 'daily' },
    { url: '/leave-a-review', priority: '0.5', changefreq: 'weekly' },
    { url: '/report-issue', priority: '0.4', changefreq: 'monthly' },
    { url: '/suggest-feature', priority: '0.4', changefreq: 'monthly' },
    { url: '/request-consultation', priority: '0.6', changefreq: 'weekly' },
    { url: '/unsubscribe-confirmation', priority: '0.3', changefreq: 'monthly' },
  ]

  // Dinamički URL-ovi sa prioritetima
  const dynamicUrls = [
    // Rezidencije (visok prioritet, dnevno ažuriranje)
    ...residences.map((r: any) => ({
      url: `/residences/${r.slug}`,
      priority: '0.8',
      changefreq: 'daily'
    })),
    // Kategorije (visok prioritet, nedeljno ažuriranje)
    ...categories.map((c: any) => ({
      url: `/best-residences/${c.slug}`,
      priority: '0.8',
      changefreq: 'weekly'
    })),
    // Brendovi (srednji prioritet, nedeljno ažuriranje)
    ...brands.map((b: any) => ({
      url: `/brands/${b.slug}`,
      priority: '0.7',
      changefreq: 'weekly'
    }))
  ]

  const allUrls = [...staticUrls, ...dynamicUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `<url>
  <loc>${baseUrl}${item.url}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>${item.changefreq}</changefreq>
  <priority>${item.priority}</priority>
</url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
