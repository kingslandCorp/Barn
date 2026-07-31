'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, BookOpen, LogOut } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Photo from '@/components/Photo';
import DepartureChecklist from '@/components/DepartureChecklist';
import {
  arrivalSteps,
  afterDarkInfo,
  sitePhotos,
  siteConfig,
  stayHighlights,
} from '@/lib/content';

type TabId = 'finding-us' | 'handbook' | 'before-you-leave';

const tabs: { id: TabId; label: string; icon: typeof MapPin }[] = [
  { id: 'finding-us', label: 'Finding us', icon: MapPin },
  { id: 'handbook', label: 'Welcome handbook', icon: BookOpen },
  { id: 'before-you-leave', label: 'Before You Leave', icon: LogOut },
];

export default function GuestTabs() {
  const [active, setActive] = useState<TabId>('finding-us');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 border-b border-stone/20 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-ink text-cream' : 'bg-white/70 text-ink/70 hover:bg-white'
              }`}
            >
              <Icon size={15} strokeWidth={1.75} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-10">
        {active === 'finding-us' && (
          <div>
            <Reveal>
              <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">Arrival</p>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Finding the barn</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {arrivalSteps.map((step) => (
                <Reveal
                  key={step.step}
                  delay={step.step * 0.06}
                  className="rounded-3xl bg-white/70 p-6 shadow-card"
                >
                  <p className="font-display text-3xl text-gold-deep">
                    {String(step.step).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 font-display text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.description}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-14 grid items-center gap-10 sm:grid-cols-2">
              <Reveal>
                <p className="eyebrow mb-2 text-xs font-semibold uppercase text-coast">
                  {afterDarkInfo.title}
                </p>
                <p className="text-base leading-relaxed text-ink/70">
                  {afterDarkInfo.description}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <Photo
                  src={sitePhotos.directionsAfterDark.src}
                  alt={sitePhotos.directionsAfterDark.alt}
                  width={sitePhotos.directionsAfterDark.width}
                  height={sitePhotos.directionsAfterDark.height}
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
                A quick reference for while you're here — the essentials, all in one place.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stayHighlights.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06} className="rounded-3xl bg-white/70 p-6 shadow-card">
                  <h3 className="font-display text-lg text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <p className="mt-8 rounded-3xl bg-sand-light/50 px-6 py-5 text-sm text-ink/60">
                This handbook is a starting point — let us know what else you'd like added here
                (Wi-Fi password, appliance guides, local emergency contacts, anything else worth
                including) and we'll build it out properly.
              </p>
            </Reveal>
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
                No rush — just a few small things before you head off, so the Barn is ready for
                whoever's coming next. Tap each one off as you go.
              </p>
            </Reveal>
            <div className="mt-10">
              <DepartureChecklist />
            </div>
            <Reveal delay={0.2} className="mt-10 rounded-3xl bg-ink px-8 py-8 text-cream">
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
