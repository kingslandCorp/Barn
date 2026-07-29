import Icon from './Icon';
import Reveal from './Reveal';

export default function IconCard({
  icon,
  title,
  description,
  delay = 0,
  tone = 'cream',
}: {
  icon: string;
  title: string;
  description: string;
  delay?: number;
  tone?: 'cream' | 'transparent';
}) {
  return (
    <Reveal delay={delay}>
      <div
        className={`h-full rounded-3xl p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 sm:p-7 ${
          tone === 'cream' ? 'bg-white/70' : 'bg-white'
        }`}
      >
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-light/60 text-sage-dark">
          <Icon name={icon} size={22} strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-lg text-ink sm:text-xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{description}</p>
      </div>
    </Reveal>
  );
}
