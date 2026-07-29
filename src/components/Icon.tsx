import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type IconMap = Record<string, React.ComponentType<LucideProps>>;

export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const map = Icons as unknown as IconMap;
  const Cmp = map[name];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
