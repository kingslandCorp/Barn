import Link from 'next/link';
import { Mail } from 'lucide-react';
import { navLinks, siteConfig } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl italic">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-cream/60">{siteConfig.fullName}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <p className="eyebrow text-xs font-semibold uppercase text-gold">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-cream/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guests" className="hover:text-cream">
                  Guests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-xs font-semibold uppercase text-gold">Get in touch</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 flex items-center gap-2 text-sm text-cream/70 hover:text-cream"
            >
              <Mail size={16} />
              {siteConfig.email}
            </a>
            <p className="mt-4 text-xs text-cream/40">{siteConfig.region}</p>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-6 text-xs text-cream/40">
          © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
