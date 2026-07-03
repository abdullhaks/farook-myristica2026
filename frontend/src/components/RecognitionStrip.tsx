import { motion } from 'framer-motion';
import { fadeUp } from '../lib/utils';

const stats = [
  {
    title: 'UN CBD Global Action Map',
    desc: "Kerala's only event · One of 2 from South India",
  },
  {
    title: 'Ministry of Environment',
    desc: 'Featured on official GoI website',
  },
  {
    title: '4 Successful Seasons',
    desc: '2017 · 2018 · 2019 · 2020',
  },
  {
    title: 'Worldwide Network Actor',
    desc: 'Farook College recognized by UN CBD',
  },
];

export default function RecognitionStrip() {
  return (
    <section className="py-8 border-y border-[hsl(var(--border))]/30 overflow-hidden">
      <motion.div
        {...fadeUp(0)}
        className="max-w-7xl mx-auto px-6 md:px-28"
      >
        {/* Desktop: static row */}
        <div className="hidden md:flex items-center justify-center gap-0">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center">
              <div className="text-center px-8">
                <p className="text-sm font-semibold text-white tracking-wide">
                  {stat.title}
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] tracking-wide mt-1">
                  {stat.desc}
                </p>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-10 bg-[hsl(var(--border))]/40 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-6 shrink-0"
            >
              <div className="min-w-[200px]">
                <p className="text-sm font-semibold text-white tracking-wide">
                  {stat.title}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] tracking-wide mt-1">
                  {stat.desc}
                </p>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-8 bg-[hsl(var(--border))]/40 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
