import '@/styles/globals.css';

import { ReactNode } from 'react';

import { cookies } from 'next/headers';

import { GeistSans } from 'geist/font/sans';

import { ensureStartsWith } from '@/lib/utils';

import { getCart } from '@/lib/shopify';

import { Providers } from '@/providers/providers';

import { Toaster } from '@/components/ui/sonner';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { WelcomeToast } from '@/components/welcome-toast';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  const cart = cartId ? await getCart(cartId) : undefined;

  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground min-h-screen flex flex-col">
        <Providers cart={cart}>
          <Navbar />
          <main className="flex-1">
            {children}
            <Toaster />
            <WelcomeToast />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
