import { motion } from 'framer-motion';
import { fadeUp } from '../lib/utils';

export default function FounderSection() {
  return (
    <section
      id="founder"
      className="py-32 md:py-44 border-t border-[hsl(var(--border))]/30 px-6 md:px-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          {...fadeUp(0)}
          className="text-xs tracking-[3px] uppercase text-[hsl(var(--muted-foreground))] mb-8"
        >
          ORIGIN STORY
        </motion.p>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left Text */}
          <div>
            <motion.h2
              {...fadeUp(0.1)}
              className="text-4xl md:text-5xl font-medium tracking-[-1px] mb-12"
            >
              <span className="block">It started with</span>
              <span className="block font-serif italic font-normal">
                one student's idea.
              </span>
            </motion.h2>

            <motion.div
              {...fadeUp(0.2)}
              className="text-2xl font-medium text-[hsl(var(--muted-foreground))] italic leading-snug mb-10 border-l-2 border-[hsl(var(--border))] pl-6"
            >
              "What if Farook College became the place where Kerala talked about
              its own ecology?"
            </motion.div>

            <motion.div
              {...fadeUp(0.3)}
              className="text-[hsl(var(--muted-foreground))] text-base leading-relaxed space-y-6 mb-10"
            >
              <p>
                Myristica was founded by <strong className="text-white font-semibold">Jithin</strong>, a former student
                of the Department of Botany at Farook College. Where most students
                saw coursework, Jithin saw an opportunity — to turn ecological
                education into ecological action.
              </p>
              <p>
                In 2016, he built the first Ecological Fiesta from the ground up,
                rallying fellow students, faculty, and the community around a
                simple but radical idea: that a college festival could actually
                matter for the planet.
              </p>
              <p>
                What began as a student initiative has since been recognized by
                the United Nations, the Government of India, and the global
                biodiversity community. Myristica is Jithin's most lasting gift to
                the institution — and to Kerala's ecological future.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.4)}
              className="liquid-glass rounded-full px-5 py-2.5 inline-block text-sm text-[hsl(var(--muted-foreground))]"
            >
              JITHIN · Founder, Myristica · Dept. of Botany 2016-19, Farook College.
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col items-center justify-center relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 overflow-hidden group">
              <img
                src="jithin.jpeg"
                alt="Jithin"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-90  group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              {/* <span className="font-serif italic font-normal text-9xl text-white/10 z-10 select-none">
                J
              </span> */}
            </div>

            <p className="text-sm text-[hsl(var(--muted-foreground))] tracking-wide pb-2">
              Jithin · Founder, Myristica
            </p>

            <p className="text-sm text-white/90 tracking-wide text-center">
              Doctoral Researcher, Department of Biodiversity Sciences, University of Turku, Finland.
            </p>

            {/* Floating decorative leaves */}
            <motion.div
              className="absolute top-10 right-10 md:right-20 opacity-40 animate-pulse"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                 <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s.5 4.5-1.5 10.2A7 7 0 0 1 11 20z" />
              </svg>
            </motion.div>
            
            <motion.div
              className="absolute bottom-20 left-10 md:left-16 opacity-30 animate-pulse"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="rotate-45">
                 <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 .5 20 .5s.5 4.5-1.5 10.2A7 7 0 0 1 11 20z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
