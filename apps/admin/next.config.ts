// next.config.js
const nextConfig = {
  // ...ostale konfiguracije
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
    ];
  },
  transpilePackages: ["ui"],
  images: {
    domains: ['tailwindui.com', 'images.unsplash.com', 'bbrapi.inity.space', 'bestbrandedresidences.com', 'backend.bestbrandedresidences.com', 'bbr-bucket.s3.amazonaws.com', 'bbr-bucket.s3.eu-west-2.amazonaws.com', 'localhost'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;