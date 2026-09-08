import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.fullName} handles your data.`,
  robots: { index: false, follow: false },
};

type Section = {
  heading: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    heading: 'Who we are',
    body: (
      <>
        Kingsland Barn (trading as {siteConfig.name} {siteConfig.fullName}) is the data
        controller for the personal data described in this policy. We&rsquo;re based in the{' '}
        {siteConfig.region}. You can contact us about anything on this page at{' '}
        <a href={`mailto:${siteConfig.email}`} className="text-coast underline">
          {siteConfig.email}
        </a>{' '}
        or{' '}
        <a href="mailto:booking@kingslandbarn.co.uk" className="text-coast underline">
          booking@kingslandbarn.co.uk
        </a>
        .
      </>
    ),
  },
  {
    heading: 'The personal data we collect',
    body: (
      <>
        <p>Depending on how you use the site, we may collect:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Guest sign-in:</strong> the email address you use to sign in to the Guests
            area, plus the date and time you signed in.
          </li>
          <li>
            <strong>Direct booking &amp; enquiry details:</strong> if you book or enquire directly
            (rather than through Airbnb), your name, email address, phone number, postal address
            and any details about your stay that you give us.
          </li>
          <li>
            <strong>Payment information:</strong> if you pay a booking balance or the check-in
            damage deposit online, your card and payment details are entered directly into
            Stripe&rsquo;s own secure payment page &mdash; we never see or store your full card
            number.
          </li>
          <li>
            <strong>Messages you send us:</strong> if you use one of the WhatsApp links on the
            site (for example to arrange a reflexology session or send us a message at checkout),
            we receive that message and your WhatsApp number in the same way as any WhatsApp
            conversation.
          </li>
          <li>
            <strong>Website analytics:</strong> Google Analytics collects standard technical data
            about your visit &mdash; pages viewed, approximate location, device and browser type
            &mdash; using cookies. This isn&rsquo;t linked to your name or booking.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Why we collect it, and our legal basis',
    body: (
      <>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Administering your stay and booking</strong> (name, contact details, payment)
            &mdash; necessary to perform our contract with you, or to take steps you ask for
            before entering into one.
          </li>
          <li>
            <strong>Guest sign-in</strong> &mdash; to confirm that whoever is viewing house rules,
            pool safety information and arrival details is an actual registered guest, and to keep
            that information secure. This is our legitimate interest in protecting guest safety
            information; we don&rsquo;t use it for marketing.
          </li>
          <li>
            <strong>Replying to messages and enquiries</strong> &mdash; our legitimate interest in
            responding to you, or to perform our contract with you if you&rsquo;ve already booked.
          </li>
          <li>
            <strong>Site analytics</strong> &mdash; our legitimate interest in understanding how
            the site is used so we can improve it. You can control analytics cookies through your
            browser settings at any time (see &ldquo;Cookies&rdquo; below).
          </li>
          <li>
            <strong>Accounting and tax records</strong> &mdash; a legal obligation, where a direct
            booking involves a payment.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Payments',
    body: (
      <>
        Online payments (booking balances and the check-in damage deposit) are handled by{' '}
        <a href="https://stripe.com/gb/privacy" className="text-coast underline">
          Stripe
        </a>
        , a PCI-compliant payment processor. Stripe processes your payment details under its own
        privacy policy and security arrangements &mdash; we receive confirmation that a payment
        was made, not your full card details.
      </>
    ),
  },
  {
    heading: 'WhatsApp',
    body: (
      <>
        The WhatsApp links on the site open a chat with our WhatsApp Business number. Messages you
        send us this way are also handled by WhatsApp (Meta) under its own privacy policy, and we
        keep that conversation history the same way you would for any WhatsApp chat, so we can
        respond to you and handle your stay.
      </>
    ),
  },
  {
    heading: 'Cookies and analytics',
    body: (
      <>
        <p>
          We use Google Analytics to understand how the site is used, which sets cookies in your
          browser to recognise repeat visits and measure site traffic. It doesn&rsquo;t identify
          you personally.
        </p>
        <p className="mt-3">
          Your browser also saves your Guests-area sign-in email locally (in localStorage, not a
          cookie) so you&rsquo;re not asked to sign in again on the same device. Clearing your
          browser&rsquo;s site data for this website removes it.
        </p>
        <p className="mt-3">
          You can block or delete cookies at any time through your browser settings, or install a
          Google Analytics opt-out add-on. Blocking cookies won&rsquo;t stop you using the site,
          including the Guests area.
        </p>
      </>
    ),
  },
  {
    heading: 'Who we share data with',
    body: (
      <>
        <p>We don&rsquo;t sell your data. We share it only where needed to run the site and your stay:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Cloudflare</strong> &mdash; our website host, which stores guest sign-in
            records and serves the site.
          </li>
          <li>
            <strong>Stripe</strong> &mdash; processes online payments (see above).
          </li>
          <li>
            <strong>Google</strong> &mdash; Analytics (site traffic) and our Google Business
            Profile (if you leave us a review via the link we provide, that review is public on
            Google, not something we control).
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong> &mdash; if you message us via a WhatsApp link.
          </li>
          <li>
            <strong>Airbnb</strong> &mdash; only if you book through Airbnb, in which case Airbnb
            is its own separate data controller under its own privacy policy.
          </li>
        </ul>
        <p className="mt-3">
          Some of these providers may process data outside the UK/EEA. Where they do, they operate
          under their own adequacy arrangements or standard contractual clauses.
        </p>
      </>
    ),
  },
  {
    heading: 'How long we keep it',
    body: (
      <>
        <ul className="list-disc space-y-1 pl-5">
          <li>Guest sign-in records: up to 12 months, then deleted.</li>
          <li>
            Direct booking and payment records: kept as long as required for accounting and tax
            purposes (normally up to 6 years, per HMRC record-keeping requirements).
          </li>
          <li>WhatsApp messages: until you or we delete the conversation.</li>
        </ul>
        <p className="mt-3">You can ask us to delete data sooner where we&rsquo;re not legally required to keep it.</p>
      </>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <>
        <p>Under UK GDPR, you have the right to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>ask what personal data we hold about you, and get a copy of it;</li>
          <li>ask us to correct inaccurate data;</li>
          <li>ask us to delete your data, where we don&rsquo;t need to keep it for a legal reason;</li>
          <li>ask us to restrict or object to certain processing;</li>
          <li>ask for your data in a portable format, where relevant; and</li>
          <li>withdraw consent at any time, where we rely on consent.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these, email{' '}
          <a href={`mailto:${siteConfig.email}`} className="text-coast underline">
            {siteConfig.email}
          </a>
          . We&rsquo;ll respond within one month.
        </p>
      </>
    ),
  },
  {
    heading: 'Complaints',
    body: (
      <>
        If you&rsquo;re unhappy with how we&rsquo;ve handled your data, please tell us first so we
        can put it right &mdash; but you also have the right to complain to the UK&rsquo;s data
        protection regulator, the{' '}
        <a href="https://ico.org.uk" className="text-coast underline">
          Information Commissioner&rsquo;s Office (ICO)
        </a>{' '}
        at ico.org.uk or on 0303 123 1113.
      </>
    ),
  },
  {
    heading: 'Changes to this policy',
    body: (
      <>
        We may update this policy from time to time to reflect how the site and our booking
        process actually work. The current version is always the one published on this page.
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
          Last updated: September 2026. A plain-language explanation of the data we collect when
          you use this site or book a stay with us, in line with UK GDPR.
        </p>
      </Reveal>

      <div className="mt-14 max-w-2xl space-y-10">
        {sections.map((section) => (
          <Reveal key={section.heading}>
            <h2 className="font-display text-xl text-ink sm:text-2xl">{section.heading}</h2>
            <div className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">
              {section.body}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
