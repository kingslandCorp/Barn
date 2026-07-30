'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, KeyRound } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/content';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-base tracking-wide text-ink sm:text-2xl"
        >
          {siteConfig.name}
          <span className="ml-2 hidden text-sm italic text-coast sm:inline">
            {siteConfig.fullName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-ink/80 transition-colors hover:text-coast"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/guests"
            className="flex items-center gap-2 rounded-full bg-coast px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-coast-dark"
          >
            <KeyRound size={16} />
            Guests
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden bg-cream md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink/80 hover:bg-sand-light"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/guests"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-xl bg-coast px-3 py-3 text-base font-medium text-cream"
              >
                <KeyRound size={16} />
                Guests
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
