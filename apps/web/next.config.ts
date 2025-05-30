import path from "path";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      // SEO optimizacije
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  transpilePackages: ["ui"],
  images: {
    domains: [
      'tailwindui.com', 
      'images.unsplash.com', 
      'bbrapi.inity.space', 
      'bbrcontent.inity.space',
      'bestbrandedresidences.com',
      'flagcdn.com', 
      'upload.wikimedia.org',  
      'bbr-bucket.s3.amazonaws.com', 
      'bbr-bucket.s3.eu-west-2.amazonaws.com', 
      'backend.bestbrandedresidences.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'], // SEO optimizacija slika
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Omogući optimizaciju slika za SEO
  },
  // Kompresija za bolje performanse
  compress: true,
  
  // Optimizacija za production
  // swcMinify: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // SEO optimizacije
  experimental: {
    optimizeCss: true,
  },
  
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src')
    };
    
    // Optimizacija bundlea
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    
    return config;
  }
};

export default nextConfig;