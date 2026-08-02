'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Waves, Flame, Trees, Wifi, PawPrint } from 'lucide-react';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';
import BookingEnquiry from '@/components/BookingEnquiry';
import Lightbox, { type LightboxPhoto } from '@/components/Lightbox';
import { stayHighlights, galleryItems, sitePhotos, siteConfig, poolPhotos } from '@/lib/content';

const iconMap = { Waves, Flame, Trees, Wifi, PawPrint };

function HighlightPhotoTile({
  src,
  alt,
  width,
  height,
  label,
  caption,
  icon,
  onClick,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  caption: string;
  icon: string;
  onClick?: () => void;
}) {
  const Icon = iconMap[icon as keyof typeof iconMap];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${label} full size`}
      className="group relative block h-64 w-full cursor-pointer appearance-none overflow-hidden rounded-3xl border-0 bg-stone/20 p-0 text-left"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0" />
      <div className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-coast shadow-sm">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-display text-lg italic text-cream">{label}</p>
        <p className="text-xs text-cream/80">{caption}</p>
      </div>
    </button>
  );
}

function WoodlandArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe8c8" />
          <stop offset="100%" stopColor="#eef6e6" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#skyGrad)" />
      <circle cx="320" cy="60" r="34" className="fill-gold/60" />
      {[70, 150, 230, 310].map((x, i) => (
        <g key={x}>
          <rect x={x - 6} y={120 + (i % 2) * 10} width="12" height={180 - (i % 2) * 10} className="fill-stone/60" />
          <ellipse cx={x} cy={110 + (i % 2) * 10} rx="55" ry="70" className="fill-sage/70" />
        </g>
      ))}
      <ellipse cx="200" cy="120" rx="90" ry="60" className="fill-sage/50" />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={40 + i * 35} cy={90 + (i % 3) * 14} r="3" className="fill-gold/50" />
      ))}
      <rect x="0" y="270" width="400" height="30" className="fill-sage/30" />
    </svg>
  );
}

function IconTile({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  const Icon = iconMap[icon as keyof typeof iconMap];
  return (
    <Reveal delay={delay}>
      <div className="flex h-full flex-col rounded-3xl bg-white/80 p-6 shadow-card">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coast/10 text-coast">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{description}</p>
      </div>
    </Reveal>
  );
}

export default function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dayVideoRef = useRef<HTMLVideoElement>(null);
  const dayBlurRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const nightBlurRef = useRef<HTMLVideoElement>(null);

  // Keep the two videos locked to the same clock. The day video (near the top)
  // buffers fast; the night video sits further down the page and browsers are
  // slower to fetch video that isn't near the viewport yet — so we let the day
  // video start on its own as soon as it's ready (no dead black box up top),
  // then hard-resync both to frame 0 together the moment the night video catches
  // up. After that, every loop boundary forces both back to 0 in lockstep.
  // Each blurred background copy just tags along with its sharp counterpart —
  // it's a soft, blurred fill, so it doesn't need frame-perfect alignment.
  useEffect(() => {
    const day = dayVideoRef.current;
    const dayBlur = dayBlurRef.current;
    const night = nightVideoRef.current;
    const nightBlur = nightBlurRef.current;
    if (!day || !night || !dayBlur || !nightBlur) return;

    let dayReady = false;
    let nightReady = false;

    const syncBoth = () => {
      [day, dayBlur, night, nightBlur].forEach((v) => {
        v.currentTime = 0;
      });
      [day, dayBlur, night, nightBlur].forEach((v) => v.play().catch(() => {}));
    };

    const onDayReady = () => {
      dayReady = true;
      if (nightReady) {
        syncBoth();
      } else {
        day.play().catch(() => {});
        dayBlur.play().catch(() => {});
      }
    };
    const onNightReady = () => {
      nightReady = true;
      if (dayReady) syncBoth();
    };
    const resync = () => syncBoth();

    day.addEventListener('canplay', onDayReady, { once: true });
    night.addEventListener('canplay', onNightReady, { once: true });
    day.addEventListener('ended', resync);

    return () => {
      day.removeEventListener('canplay', onDayReady);
      night.removeEventListener('canplay', onNightReady);
      day.removeEventListener('ended', resync);
    };
  }, []);

  const lightboxPhotos: LightboxPhoto[] = useMemo(() => {
    const photos: LightboxPhoto[] = [];

    photos.push({
      src: sitePhotos.warmWelcome.src,
      alt: sitePhotos.warmWelcome.alt,
      width: sitePhotos.warmWelcome.width,
      height: sitePhotos.warmWelcome.height,
      label: sitePhotos.warmWelcome.label,
    });

    stayHighlights.forEach((item) => {
      if (item.image) {
        photos.push({
          src: item.image.src,
          alt: item.image.alt,
          width: item.image.width,
          height: item.image.height,
          label: item.title,
          caption: item.description,
        });
        // Extra pool angles aren't shown as their own tile on the page, but
        // browsing forward from the pool photo in the gallery reveals them.
        if (item.image.src === poolPhotos.main.src) {
          poolPhotos.minor.forEach((extra) => {
            photos.push({
              src: extra.src,
              alt: extra.alt,
              width: extra.width,
              height: extra.height,
              label: item.title,
              caption: 'Another angle of the pool',
            });
          });
        }
      }
    });

    galleryItems.forEach((item) => {
      photos.push({
        src: item.src,
        alt: item.label,
        width: item.width,
        height: item.height,
        label: item.label,
        caption: item.caption,
      });
    });

    photos.push({
      src: sitePhotos.discoverTheVale.src,
      alt: sitePhotos.discoverTheVale.alt,
      width: sitePhotos.discoverTheVale.width,
      height: sitePhotos.discoverTheVale.height,
      label: sitePhotos.discoverTheVale.label,
    });

    return photos;
  }, []);

  const photoIndex = (src: string) => lightboxPhotos.findIndex((p) => p.src === src);

  return (
    <>
      <Hero />

      {/* Day video — full-bleed, full frame visible, blurred stretched copy fills the sides */}
      <section className="w-full">
        <div className="relative h-[205px] w-full overflow-hidden sm:h-[256px] md:h-[368px]">
          <video
            ref={dayBlurRef}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-[12px]"
            src="/videos/day-to-sunset.mp4"
            preload="auto"
            muted
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={dayVideoRef}
              className="h-full w-auto"
              style={{
                transform: 'scaleX(1.265)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
              src="/videos/day-to-sunset.mp4"
              preload="auto"
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      {/* A Warm Welcome — height now driven by the text, photo reduced and unlabelled */}
      <section className="relative overflow-hidden py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={sitePhotos.warmWelcome.src}
            alt=""
            fill
            className="scale-150 object-cover opacity-65 blur-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream from-10% via-cream/35 via-45% to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-content items-center gap-8 px-5 sm:px-8 md:grid-cols-[3fr_2fr] md:gap-12 lg:px-12">
          <SectionHeading
            eyebrow="A Warm Welcome"
            title="Somewhere to properly switch off"
            subtitle="There's a particular kind of quiet that settles over the Vale of Glamorgan in summer — long evenings, warm stone, and a sky that turns gold long before it thinks about getting dark. The Barn was made for exactly that: mornings by the pool, afternoons on the coast, and evenings that ask nothing of you at all."
          />
          <Reveal delay={0.1}>
            <Photo
              src={sitePhotos.warmWelcome.src}
              alt={sitePhotos.warmWelcome.alt}
              width={sitePhotos.warmWelcome.width}
              height={sitePhotos.warmWelcome.height}
              className="max-h-[220px]"
              onClick={() => setLightboxIndex(photoIndex(sitePhotos.warmWelcome.src))}
            />
          </Reveal>
        </div>
      </section>

      {/* Night video — full-bleed, sits right after "Somewhere to properly switch off" */}
      <section className="w-full">
        <div className="relative h-[205px] w-full overflow-hidden sm:h-[256px] md:h-[368px]">
          <video
            ref={nightBlurRef}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-[12px]"
            src="/videos/sunset-to-night.mp4"
            preload="auto"
            muted
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={nightVideoRef}
              className="h-full w-auto"
              style={{
                transform: 'scaleX(1.265)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
              src="/videos/sunset-to-night.mp4"
              preload="auto"
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      {/* Stay Highlights */}
      <section className="bg-white/50 py-8 sm:py-14">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Stay Highlights"
            title="Everything you need, nothing you don't"
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {stayHighlights.map((item, i) => {
              if (item.image) {
                return (
                  <Reveal key={item.title} delay={i * 0.06}>
                    <HighlightPhotoTile
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      label={item.title}
                      caption={item.description}
                      icon={item.icon}
                      onClick={() => setLightboxIndex(photoIndex(item.image!.src))}
                    />
                  </Reveal>
                );
              }
              if (item.useArt) {
                return (
                  <Reveal key={item.title} delay={i * 0.06}>
                    <div className="relative h-64 w-full overflow-hidden rounded-3xl">
                      <WoodlandArt />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-display text-lg italic text-cream">{item.title}</p>
                        <p className="text-xs text-cream/80">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              }
              return (
                <IconTile
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  delay={i * 0.06}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-content px-5 py-8 sm:px-8 sm:py-14 lg:px-12">
        <SectionHeading eyebrow="Gallery" title="A closer look inside" />

        <div className="mt-14 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
          {galleryItems.slice(0, 2).map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <Photo
                src={item.src}
                alt={item.label}
                width={item.width}
                height={item.height}
                label={item.label}
                caption={item.caption}
                onClick={() => setLightboxIndex(photoIndex(item.src))}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          {galleryItems.slice(2, 6).map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <Photo
                src={item.src}
                alt={item.label}
                width={item.width}
                height={item.height}
                label={item.label}
                caption={item.caption}
                className="h-56 sm:h-64"
                onClick={() => setLightboxIndex(photoIndex(item.src))}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          {galleryItems.slice(6, 9).map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <Photo
                src={item.src}
                alt={item.label}
                width={item.width}
                height={item.height}
                label={item.label}
                caption={item.caption}
                className="h-56 sm:h-64"
                onClick={() => setLightboxIndex(photoIndex(item.src))}
              />
            </Reveal>
          ))}
          <div className="flex flex-col gap-3 sm:gap-4">
            {galleryItems.slice(9, 11).map((item, i) => (
              <Reveal key={item.label} delay={i * 0.05}>
                <Photo
                  src={item.src}
                  alt={item.label}
                  width={item.width}
                  height={item.height}
                  label={item.label}
                  caption={item.caption}
                  className="h-[106px] sm:h-[120px]"
                  onClick={() => setLightboxIndex(photoIndex(item.src))}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="mx-auto max-w-content px-5 py-8 text-center sm:px-8 sm:py-14 lg:px-12">
        <Reveal>
          <SectionHeading eyebrow="Book Your Stay" title="Check your dates" align="center" />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-8 max-w-xl text-left">
          <BookingEnquiry />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-md text-sm text-ink/60">
            Already booked? Find house and pool guidance in the Guests section, or reach us
            directly at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-coast underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </Reveal>
      </section>

      {/* Discover the Vale */}
      <section className="bg-coast py-8 text-cream sm:py-14">
        <div className="mx-auto grid max-w-content gap-12 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
          <Reveal>
            <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-light">
              Discover the Vale
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Beyond the Barn, a whole coastline is waiting
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
              Dramatic cliffs, surf beaches, sleepy market towns, cosy pubs and some of the best
              sunsets in Wales — the Vale of Glamorgan rewards guests who venture just a little
              further than the garden gate.
            </p>
            <Link
              href="/explore"
              className="mt-8 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Explore The Area
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Photo
              src={sitePhotos.discoverTheVale.src}
              alt={sitePhotos.discoverTheVale.alt}
              width={sitePhotos.discoverTheVale.width}
              height={sitePhotos.discoverTheVale.height}
              label={sitePhotos.discoverTheVale.label}
              onClick={() => setLightboxIndex(photoIndex(sitePhotos.discoverTheVale.src))}
            />
          </Reveal>
        </div>
      </section>

      <Lightbox
        photos={lightboxPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
