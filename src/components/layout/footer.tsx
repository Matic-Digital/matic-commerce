import { Suspense } from 'react';

import Link from 'next/link';

import { getMenu } from '@/lib/shopify';

import { FooterMenu } from '@/components/layout/footer-menu';
import { LogoSquare } from '@/components/logo-square';

const { COMPANY_NAME, SITE_NAME } = process.env;

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const menu = await getMenu('footer');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 text-sm md:flex-row md:items-center md:gap-12 md:px-4 min-[1320px]:px-0">
        <Link className="flex items-center gap-2 text-black dark:text-white md:pt-1" href="/">
          <LogoSquare size="sm" />
          <span className="logotype">{SITE_NAME}</span>
        </Link>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
          <p>
            &copy; {copyrightName} {copyrightDate}
          </p>
        </Suspense>
      </div>
      {/* <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" /> */}
    </footer>
  );
}
