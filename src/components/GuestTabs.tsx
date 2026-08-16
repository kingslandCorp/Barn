'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, BookOpen, LogOut, Map, CreditCard } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Photo from '@/components/Photo';
import DepartureChecklist from '@/components/DepartureChecklist';
import DepartureActions from '@/components/DepartureActions';
import Icon from './Icon';
import {
  arrivalSteps,
  afterDarkInfo,
  sitePhotos,
  poolPhotos,
  siteConfig,
  houseRules,
  poolRules,
  localSupermarkets,
  what3words,
  directionsMapsUrl,
  checkInDepositUrl,
} from '@/lib/content';

type TabId = 'finding-us' | 'handbook' | 'before-you-leave';

const tabs: { id: TabId; label: string; icon: typeof MapPin }[] = [
  { id: 'finding-us', label: 'Finding us', icon: MapPin },
  { id: 'handbook', label: 'Welcome handbook', icon: BookOpen },
  { id: 'before-you-leave', label: 'Before You Leave', icon: LogOut },
];

function RuleTile({
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
  return (
    <Reveal delay={delay} className="rounded-3xl bg-white/70 p-6 shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coast/10 text-coast">
        <Icon name={icon} size={18} strokeWidth={1.75} />
      </div>
      <h4 className="mt-4 font-display text-base text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">{description}</p>
    </Reveal>
  );
}

function SupermarketTile({
  name,
  mapQuery,
  image,
  delay,
}: {
  name: string;
  mapQuery: string;
  image?: { src: string; width: number; height: number; alt: string };
  delay: number;
}) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  return (
    <Reveal delay={delay}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-48 w-full overflow-hidden rounded-3xl bg-stone/20 shadow-card"
      >
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/0" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-display text-lg italic text-cream">{name}</p>
          <p className="text-xs text-cream/75">Tap to open in Maps</p>
        </div>
      </a>
    </Reveal>
  );
}

export default function GuestTabs() {
  const [active, setActive] = useState<TabId>('finding-us');

  return (
    <div>
      {/* Tab bar */}
      <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2 border-b border-stone/20 pb-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:flex-1 sm:px-6 sm:py-3 ${
                isActive ? 'bg-ink text-cream' : 'bg-white/70 text-ink/70 hover:bg-white'
              }`}
            >
              <Icon size={15} strokeWidth={1.75} />
              {tab.label}
            </button>
          );
        })}
        {/* Takes guests off-site to Stripe rather than switching tab content, so it's a
            link styled to match the bar rather than another button in the `tabs` array. */}
        <a
          href={checkInDepositUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-coast px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-coast-dark sm:flex-1 sm:px-6 sm:py-3"
        >
          <CreditCard size={15} strokeWidth={1.75} />
          Check-in
        </a>
      </div>
      <p className="mx-auto mt-3 max-w-xl text-center text-xs text-ink/50">
        Check-in requires a refundable £250 damage deposit, paid securely via Stripe.
      </p>

      {/* Tab content */}
      <div className="mt-10">
        {active === 'finding-us' && (
          <div>
            <Reveal>
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">Arrival</p>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Finding the barn</h2>
            </Reveal>

            <Reveal delay={0.05} className="mt-4 flex flex-wrap justify-center gap-x-[60px] gap-y-1.5">
              <a
                href={what3words.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-coast/10 px-6 py-3 text-base font-medium text-coast shadow-card transition-colors hover:bg-coast/15 sm:w-auto"
              >
                <MapPin size={18} strokeWidth={1.75} />
                what3words: {what3words.words}
              </a>
              <a
                href={directionsMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-coast/10 px-10 py-3 text-base font-medium text-coast shadow-card transition-colors hover:bg-coast/15 sm:w-auto"
              >
                <Map size={18} strokeWidth={1.75} />
                Open in Maps
              </a>
            </Reveal>

            <div className="mt-8 grid gap-6 md:grid-cols-2 md:items-stretch">
              <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
                {arrivalSteps.map((step) => (
                  <Reveal
                    key={step.step}
                    delay={step.step * 0.06}
                    className="w-full rounded-3xl bg-white/70 p-6 shadow-card"
                  >
                    <p className="font-display text-3xl text-gold-deep">
                      {String(step.step).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 font-display text-lg text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.description}</p>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.1} className="h-full">
                <Photo
                  src={sitePhotos.directionsTrack.src}
                  alt={sitePhotos.directionsTrack.alt}
                  width={sitePhotos.directionsTrack.width}
                  height={sitePhotos.directionsTrack.height}
                  className="h-full min-h-[320px] w-full"
                />
              </Reveal>
            </div>

            <div className="mt-14 grid items-stretch gap-6 sm:grid-cols-2">
              <Reveal>
                <div className="flex h-full min-w-0 flex-col justify-center rounded-3xl bg-white/70 p-8 shadow-card">
                  <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                    {afterDarkInfo.title}
                  </p>
                  <p className="text-base leading-relaxed text-ink/70">
                    {afterDarkInfo.description}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="min-w-0">
                <Photo
                  src={sitePhotos.directionsAfterDark.src}
                  alt={sitePhotos.directionsAfterDark.alt}
                  width={sitePhotos.directionsAfterDark.width}
                  height={Math.round(sitePhotos.directionsAfterDark.height / 2)}
                  objectPosition="top"
                  className="h-full w-full"
                />
              </Reveal>
            </div>
          </div>
        )}

        {active === 'handbook' && (
          <div>
            <Reveal>
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                Welcome Handbook
              </p>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Everything for your stay
              </h2>
              <p className="mt-3 max-w-2xl text-base text-ink/65">
                A quick reference for while you're here — the house rules, the Wi-Fi details, and
                everything you need to know about the pool.
              </p>
            </Reveal>

            {/* House Rules & Wi-Fi */}
            <div className="mt-10">
              <h3 className="font-display text-xl text-ink">House Rules &amp; Wi-Fi</h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {houseRules.map((item, i) => (
                  <RuleTile
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </div>

            {/* Supermarkets */}
            <div className="mt-14">
              <h3 className="font-display text-xl text-ink">Nearby Supermarkets</h3>
              <p className="mt-2 text-sm text-ink/60">Tap a tile to open directions in Maps.</p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {localSupermarkets.map((shop, i) => (
                  <SupermarketTile
                    key={shop.name}
                    name={shop.name}
                    mapQuery={shop.mapQuery}
                    image={shop.image}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            </div>

            {/* Pool Rules */}
            <div className="mt-14">
              <h3 className="font-display text-xl text-ink">Pool Rules</h3>
              <div className="mt-6 grid max-w-3xl grid-cols-2 gap-4">
                {/* Both forced to a shared 4:3 box (not each photo's native ratio) so the
                    two tiles render at the same height regardless of source dimensions. */}
                <Photo
                  src={sitePhotos.poolSafety.src}
                  alt={sitePhotos.poolSafety.alt}
                  width={4}
                  height={3}
                  className="max-h-[320px]"
                />
                <Photo
                  src={poolPhotos.minor[0].src}
                  alt={poolPhotos.minor[0].alt}
                  width={4}
                  height={3}
                  className="max-h-[320px]"
                />
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {poolRules.map((item, i) => (
                  <RuleTile
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    delay={i * 0.04}
                  />
                ))}
              </div>
              <div className="mt-6 rounded-3xl bg-red-50 p-6 text-sm text-red-900">
                <strong>In a genuine emergency, always call 999 first.</strong> For anything else,
                reach us at{' '}
                <a href={`mailto:${siteConfig.email}`} className="underline">
                  {siteConfig.email}
                </a>
                .
              </div>
            </div>
          </div>
        )}

        {active === 'before-you-leave' && (
          <div>
            <Reveal>
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                Before You Leave
              </p>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Leaving The Barn</h2>
              <p className="mt-3 max-w-2xl text-base text-ink/65">
                No rush — just a few small things before you head off. Please leave things as
                you found them. Feel free to tick off this checklist as you go.
              </p>
            </Reveal>
            <div className="mt-10">
              <DepartureChecklist />
            </div>
            <DepartureActions />
            <Reveal delay={0.2} className="mt-8 rounded-3xl bg-ink px-8 py-8 text-cream">
              <p className="text-sm sm:text-base">
                Safe travels — and thank you for looking after The Barn. If anything needs
                flagging on your way out, drop us a line at{' '}
                <a href={`mailto:${siteConfig.email}`} className="text-gold underline">
                  {siteConfig.email}
                </a>
                .
              </p>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
