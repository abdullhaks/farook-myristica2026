import { motion } from 'framer-motion';
import { fadeUp } from '../lib/utils';

export default function CollegeSection() {
  return (
    <section className="py-20 border-t border-[hsl(var(--border))]/30 px-6 md:px-28">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <motion.h2
          {...fadeUp(0)}
          className="text-2xl md:text-3xl font-medium mb-6"
        >
          About Farook College (Autonomous)
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="text-[hsl(var(--muted-foreground))] text-base leading-relaxed mb-10"
        >
          Farook College, Kozhikode, is one of Kerala's premier institutions of
          higher education, established in 1948. The Department of Botany has
          been at the forefront of ecological research and environmental advocacy
          in the region, nurturing generations of ecologists, botanists, and
          nature educators.
        </motion.p>

        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-wrap justify-center gap-3"
        >
          <div className="liquid-glass rounded-full px-5 py-2 text-sm text-[hsl(var(--muted-foreground))]">
            📍 Farook College, Kozhikode, Kerala
          </div>
          <div className="liquid-glass rounded-full px-5 py-2 text-sm text-[hsl(var(--muted-foreground))]">
            🏛️ Established 1948
          </div>
        </motion.div>
      </div>
    </section>
  );
}
