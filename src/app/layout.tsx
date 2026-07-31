import type { Metadata } from 'next';
import { Fraunces, Work_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { siteConfig, sitePhotos } from '@/lib/content';
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});
const siteUrl = 'https://kingslandbarn.co.uk';
const businessName = `${siteConfig.name} ${siteConfig.fullName}`;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — Luxury Countryside Holiday Let, ${siteConfig.region}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  keywords: [
    'Vale of Glamorgan holiday cottage',
    'luxury holiday let Wales',
    'Kingsland Barn',
    'holiday cottage with pool Wales',
    'Welsh coast holiday let',
    'South Wales holiday cottage',
    'dog friendly holiday cottage Wales',
    'self catering Vale of Glamorgan',
  ],
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: `${siteConfig.name} — Luxury Countryside Holiday Let`,
    description: siteConfig.metaDescription,
    url: siteUrl,
    siteName: siteConfig.name,
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: sitePhotos.hero.src,
        width: sitePhotos.hero.width,
        height: sitePhotos.hero.height,
        alt: sitePhotos.hero.alt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.region}`,
    description: siteConfig.metaDescription,
    images: [sitePhotos.hero.src],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: businessName,
  description: siteConfig.metaDescription,
  url: siteUrl,
  image: `${siteUrl}${sitePhotos.hero.src}`,
  email: siteConfig.email,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Vale of Glamorgan',
    addressCountry: 'GB',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Heated outdoor pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wood burner', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Woodland walks', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Countryside views', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Dog friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
  ],
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-body antialiased bg-cream text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
