import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/utils';
import Day1Events from './Day1Events';
import Day2Events from './Day2Events';

interface EventsSectionProps {
  onRegisterClick: (eventName: string) => void;
}

export default function EventsSection({ onRegisterClick }: EventsSectionProps) {
  return (
    <section
      id="events"
      className="py-32 md:py-44 border-t border-[hsl(var(--border))]/30 px-6 md:px-28"
    >
      <div className="max-w-5xl mx-auto">
        <motion.p
          {...fadeUp(0)}
          className="text-xs tracking-[3px] uppercase text-[hsl(var(--muted-foreground))] mb-8"
        >
          EVENTS
        </motion.p>

        <div className="flex flex-col gap-16 md:gap-24 relative min-h-[500px]">
          <div>
            <motion.h3 
              {...fadeUp(0.1)} 
              className="text-3xl md:text-5xl font-serif italic mb-2 tracking-tight"
            >
              Day 1
            </motion.h3>
            <motion.p 
              {...fadeUp(0.15)} 
              className="text-[hsl(var(--muted-foreground))] uppercase text-xs tracking-widest mb-8"
            >
              August 18, 2026
            </motion.p>
            <Day1Events onRegisterClick={onRegisterClick} />
          </div>
          
          <div className="w-full h-px bg-[hsl(var(--border))]/20" />

          <div>
            <motion.h3 
              {...fadeUp(0.2)} 
              className="text-3xl md:text-5xl font-serif italic mb-2 tracking-tight"
            >
              Day 2
            </motion.h3>
            <motion.p 
              {...fadeUp(0.25)} 
              className="text-[hsl(var(--muted-foreground))] uppercase text-xs tracking-widest mb-8"
            >
              August 19, 2026
            </motion.p>
            <Day2Events onRegisterClick={onRegisterClick} />
          </div>
        </div>
      </div>
    </section>
  );
}
