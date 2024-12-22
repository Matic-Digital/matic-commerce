import { Suspense } from 'react';

import Link from 'next/link';

import { getMenu } from '@/lib/shopify';

import { CartModal } from '@/components/cart/modal';
import { MobileMenu } from '@/components/layout/navbar/mobile-menu';
import Search, { SearchSkeleton } from '@/components/layout/navbar/search';
import { LogoSquare } from '@/components/logo-square';
import { ThemeToggle } from '@/components/theme-toggle';

import type { Menu } from '@/types/shopify-types';

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu('main-menu');

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex gap-6">
        <Link
          href="/"
          prefetch={true}
          className="xs:flex hidden w-full items-center justify-center md:w-auto"
        >
          <LogoSquare />
          <div className="logotype ml-2 flex-none md:hidden lg:block">{SITE_NAME}</div>
        </Link>
        {/* TODO: Consider implementing shadcn navigation menu to support submenus */}
        {menu.length ? (
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex justify-end gap-6">
        <div className="hidden min-w-[325px] md:flex">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <ThemeToggle />
        <CartModal />
      </div>
    </nav>
  );
}
