import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./global.css";
import "@/styles/global.scss";
import Footer from "@/components/web/Footer/Footer";
import MiniNav from "@/components/web/Nav/MiniNav";
import PrimaryNav from "@/components/web/Nav/PrimaryNav";
import ClientLayout from "@/components/web/ClientLayout"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Best Branded Residences',
    default: 'Best Branded Residences - Luxury Branded Residences'
  },
  description: 'Discover the world\'s finest luxury branded residences',
  keywords: ['luxury residences', 'branded residences', 'real estate'],
  authors: [{ name: 'BBR Team' }],
  creator: 'Best Branded Residences',
  publisher: 'Best Branded Residences',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bestbrandedresidences.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    title: 'Best Branded Residences',
    description: 'Luxury branded residences worldwide',
    url: 'https://bestbrandedresidences.com',
    siteName: 'Best Branded Residences',
    images: [
      {
        url: 'https://bestbrandedresidences.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Branded Residences',
    description: 'Luxury branded residences worldwide',
    creator: '@bbr_residences',
    images: ['https://bestbrandedresidences.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientLayout> 
            <MiniNav />
            <PrimaryNav />
            {children}
            <Toaster position="top-center" visibleToasts={9} richColors closeButton theme="dark" />
            <Footer />
          </ClientLayout> 
        </ThemeProvider>
      </body>
    </html>
  );
}