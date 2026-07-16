import { motion } from 'framer-motion';
import { MapPin, Users, School, Calendar } from 'lucide-react';
import { fadeUp, container, item } from '../lib/utils';
import AnimatedCounter from './AnimatedCounter';

const totals = [
  { label: 'Districts Reached', value: 13, suffix: '', icon: MapPin },
  { label: 'Students Engaged', value: 700, suffix: '+', icon: Users },
  { label: 'Institutions', value: 78, suffix: '', icon: School },
  { label: 'Events Hosted', value: 13, suffix: '', icon: Calendar },
];

const milestones = [
  {
    season: 'SEASON 1 · 2016-2017',
    title: 'The Beginning',
    desc: "The first Ecological Fiesta at Farook College. A student's dream becomes a departmental reality.",
    stats: {
      institutions: 1,
      events: 2,
      students: 100,
      districts: 1,
      isUpcoming: false,
    },
    side: 'left',
  },
  {
    season: 'SEASON 2 · 2017-2018',
    title: 'Going National',
    desc: 'Featured on the UN CBD Global Action Map. Farook College recognized internationally.',
    stats: {
      institutions: 16,
      events: 8,
      students: 165,
      districts: 6,
      isUpcoming: false,
    },
    side: 'right',
  },
  {
    season: 'SEASON 3 · 2018-2019',
    title: 'Deepening Roots',
    desc: "Ministry of Environment features Myristica's success story on the official GoI website.",
    stats: {
      institutions: 37,
      events: 5,
      students: 185,
      districts: 10,
      isUpcoming: false,
    },
    side: 'left',
  },
  {
    season: 'SEASON 4 · 2019-2020',
    title: 'The Last Before Silence',
    desc: 'Deepening ecological consciousness across institutions before the pandemic pause.',
    stats: {
      institutions: 36,
      events: 6,
      students: 199,
      districts: 10,
      isUpcoming: false,
    },
    side: 'right',
  },
  {
    season: 'SEASON 5 · 2026',
    title: 'The Return',
    desc: 'Five years later. The ecological fiesta returns — with new urgency and the same unshakeable spirit.',
    stats: {
      isUpcoming: true,
    },
    side: 'left',
  },
];

export default function LegacySection() {
  return (
    <section
      id="legacy"
      className="py-32 md:py-44 border-t border-[hsl(var(--border))]/30 px-6 md:px-28"
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          {...fadeUp(0)}
          className="text-xs tracking-[3px] uppercase text-[hsl(var(--muted-foreground))] mb-4"
        >
          LEGACY & IMPACT
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl tracking-[-1px] mb-6"
        >
          <span className="block">Four seasons.</span>
          <span className="block font-serif italic font-normal">
            One unbroken thread.
          </span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mb-16"
        >
          From a bold student initiative to a UN-recognized ecological movement —
          this is how Myristica grew.
        </motion.p>

        {/* Cumulative Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
          {totals.map((total, i) => {
            const Icon = total.icon;
            return (
              <motion.div
                key={i}
                {...fadeUp(0.3 + i * 0.1)}
                className="liquid-glass rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-white/[0.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
                  <AnimatedCounter end={total.value} suffix={total.suffix} />
                </div>
                <p className="text-[hsl(var(--muted-foreground))] text-[10px] md:text-xs uppercase tracking-[1px]">
                  {total.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-20 md:mb-32">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[hsl(var(--border))]/40 -translate-x-1/2" />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col gap-12"
          >
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                variants={item}
                className={`relative flex items-center ${
                  milestone.side === 'right' ? 'md:justify-end' : 'md:justify-start'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-foreground border-4 border-background -translate-x-1/2 z-10" />

                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    milestone.side === 'right' ? 'md:pl-12' : 'md:pr-12'
                  }`}
                >
                  <div className="liquid-glass rounded-2xl p-6 md:p-8 hover:bg-white/[0.02] transition-colors flex flex-col h-full justify-between">
                    <div>
                      <div className="text-xs tracking-[2px] uppercase text-[hsl(var(--muted-foreground))] mb-2">
                        {milestone.season}
                      </div>
                      <h4 className="text-xl font-semibold mb-3">
                        {milestone.title}
                      </h4>
                      <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-6">
                        {milestone.desc}
                      </p>
                    </div>

                    {/* Season sub-stats grid */}
                    {!milestone.stats.isUpcoming && (
                      <div className="grid grid-cols-2 gap-4 border-t border-[hsl(var(--border))]/20 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-white/40 shrink-0" />
                          <div>
                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-light uppercase tracking-wider">Institutions</p>
                            <p className="text-xs font-semibold text-white/90">
                              {milestone.stats.institutions?.toString().padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/40 shrink-0" />
                          <div>
                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-light uppercase tracking-wider">Events</p>
                            <p className="text-xs font-semibold text-white/90">
                              {milestone.stats.events?.toString().padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-white/40 shrink-0" />
                          <div>
                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-light uppercase tracking-wider">Students</p>
                            <p className="text-xs font-semibold text-white/90">
                              {milestone.stats.students?.toString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                          <div>
                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-light uppercase tracking-wider">Districts</p>
                            <p className="text-xs font-semibold text-white/90">
                              {milestone.stats.districts?.toString().padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Memory Gallery */}
        <motion.div
          {...fadeUp(0.2)}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-4xl font-serif italic mb-4">Past Memories</h3>
          <p className="text-[hsl(var(--muted-foreground))] text-sm">Glimpses from previous seasons of Myristica.</p>
        </motion.div>

        <motion.div
          {...fadeUp(0.3)}
          className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pb-20"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="break-inside-avoid rounded-xl overflow-hidden group">
              <img
                src={`/src/assets/gallary/img (${i + 1}).jpeg`}
                alt={`Myristica Memory ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
