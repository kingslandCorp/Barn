import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.fullName} handles your data.`,
  robots: { index: false, follow: false },
};

const sections = [
  {
    heading: 'What we collect',
    body: (
      <>
        When you sign in to the Guests area, we ask for the email address you used for your
        booking. We store that email address together with the date and time you signed in.
      </>
    ),
  },
  {
    heading: 'Why we collect it',
    body: (
      <>
        This lets us confirm that whoever is viewing house rules, pool safety information and
        arrival details is an actual registered guest, and helps us keep that information secure.
        We do not use it for marketing.
      </>
    ),
  },
  {
    heading: "Where it's stored",
    body: (
      <>
        Sign-in records are stored securely in our website host&rsquo;s (Cloudflare) database
        infrastructure. We don&rsquo;t sell, share or pass this information to any third party.
      </>
    ),
  },
  {
    heading: 'On your device',
    body: (
      <>
        Your browser also saves the email address locally (in localStorage) so you&rsquo;re not
        asked to sign in again on the same device. Clearing your browser&rsquo;s site data for
        this website removes it.
      </>
    ),
  },
  {
    heading: 'How long we keep it',
    body: (
      <>
        We keep sign-in records for up to 12 months, then delete them. You can ask us to delete
        your record sooner at any time.
      </>
    ),
  },
  {
    heading: 'Analytics',
    body: (
      <>
        We use Google Analytics to understand how the site is used, which may set cookies in your
        browser. This is separate from the guest sign-in records above.
      </>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <>
        You can ask us what we hold about you, or ask us to delete it, at any time by emailing us
        at{' '}
        <a href={`mailto:${siteConfig.email}`} className="text-coast underline">
          {siteConfig.email}
        </a>
        .
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 pb-24 sm:px-8 sm:py-24 lg:px-12">
      <Reveal>
        <p className="eyebrow mb-3 text-xs font-semibold uppercase text-gold-deep">
          Privacy Policy
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          How we handle your data
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
          A short, plain-language explanation of the little bit of data we collect when you use
          this site.
        </p>
      </Reveal>

      <div className="mt-14 max-w-2xl space-y-10">
        {sections.map((section) => (
          <Reveal key={section.heading}>
            <h2 className="font-display text-xl text-ink sm:text-2xl">{section.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">
              {section.body}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
