import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { fadeUp } from '../../lib/utils';
import Day1Events from './Day1Events';
import Day2Events from './Day2Events';

interface EventsSectionProps {
  onRegisterClick: (eventName: string) => void;
}

export default function EventsSection({ onRegisterClick }: EventsSectionProps) {
  const [activeTab, setActiveTab] = useState('day1');

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

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <motion.div {...fadeUp(0.1)} className="flex justify-center mb-12">
            <Tabs.List className="flex items-center gap-4 bg-black border border-[hsl(var(--border))]/30 rounded-full p-1">
              <Tabs.Trigger
                value="day1"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'day1'
                    ? 'bg-foreground text-background'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-white'
                }`}
              >
                DAY 1 · AUG 5
              </Tabs.Trigger>
              <Tabs.Trigger
                value="day2"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'day2'
                    ? 'bg-foreground text-background'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-white'
                }`}
              >
                DAY 2 · AUG 6
              </Tabs.Trigger>
            </Tabs.List>
          </motion.div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'day1' && (
                <Tabs.Content key="day1" value="day1" forceMount>
                  <Day1Events onRegisterClick={onRegisterClick} />
                </Tabs.Content>
              )}
              {activeTab === 'day2' && (
                <Tabs.Content key="day2" value="day2" forceMount>
                  <Day2Events onRegisterClick={onRegisterClick} />
                </Tabs.Content>
              )}
            </AnimatePresence>
          </div>
        </Tabs.Root>
      </div>
    </section>
  );
}
