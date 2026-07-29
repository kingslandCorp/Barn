'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Icon from './Icon';
import Reveal from './Reveal';
import { departureChecklist } from '@/lib/content';

export default function DepartureChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = departureChecklist.length;
  const done = Object.values(checked).filter(Boolean).length;

  const toggle = (title: string) => {
    setChecked((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-ink/60">
          {done} of {total} done
        </p>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-sand-light sm:w-56">
          <div
            className="h-full rounded-full bg-sage transition-all duration-500"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {departureChecklist.map((item, i) => {
          const isChecked = !!checked[item.title];
          return (
            <Reveal key={item.title} delay={i * 0.05}>
              <button
                type="button"
                onClick={() => toggle(item.title)}
                aria-pressed={isChecked}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left shadow-card transition-colors ${
                  isChecked
                    ? 'border-sage bg-sage/10'
                    : 'border-transparent bg-white/70 hover:border-sage/40'
                }`}
              >
                <div
                  className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl transition-colors ${
                    isChecked ? 'bg-sage text-cream' : 'bg-sand-light text-ink/60'
                  }`}
                >
                  {isChecked ? <Check size={20} /> : <Icon name={item.icon} size={20} strokeWidth={1.5} />}
                </div>
                <div>
                  <p
                    className={`font-display text-lg ${
                      isChecked ? 'text-sage-dark line-through decoration-2' : 'text-ink'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-ink/60">{item.description}</p>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
