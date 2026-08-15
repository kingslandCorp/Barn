'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { siteConfig, sitePhotos } from '@/lib/content';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Slow parallax: the photo drifts and eases up slightly slower than the scroll,
  // the text fades and settles first — the site's signature golden-hour moment.
  const imageY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, prefersReduced ? 1.04 : 1.16]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 60]);

  return (
    <div ref={ref} className="relative h-[92svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src={sitePhotos.hero.src}
          alt={sitePhotos.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Golden-hour scrim so the headline stays readable over the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative flex h-full flex-col items-start justify-end pb-16 px-5 sm:px-8 sm:pb-20 lg:px-16"
      >
        <div className="max-w-content w-full">
          <p className="eyebrow mb-4 text-xs font-semibold uppercase text-cream/80 sm:text-sm">
            {siteConfig.region}
          </p>
           <h1 className="max-w-2xl font-display text-5xl leading-[1.05] text-cream sm:text-6xl md:text-7xl">
            Welcome to
            <br />
            <span className="italic text-gold-light">{siteConfig.name}</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-cream/85 sm:text-lg">
            {siteConfig.tagline}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/guests"
              className="flex items-center gap-2 rounded-full bg-coast px-7 py-3.5 text-sm font-medium text-cream transition-transform hover:-translate-y-0.5 hover:bg-coast-dark"
            >
              <KeyRound size={16} />
              Already Booked? Guest Login
            </Link>
            <Link
              href="/directions"
              className="rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:bg-white"
            >
              Plan Your Stay
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-cream/40 bg-cream/10 px-7 py-3.5 text-sm font-medium text-cream backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-cream/20"
            >
              Explore The Area
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
