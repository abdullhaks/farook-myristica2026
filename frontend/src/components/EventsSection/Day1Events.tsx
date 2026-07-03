import EventCard from './EventCard';
import { motion } from 'framer-motion';

interface Day1EventsProps {
  onRegisterClick: (eventName: string) => void;
}

export default function Day1Events({ onRegisterClick }: Day1EventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mt-12"
    >
      <EventCard
        badge="PRE-EVENT · PHOTOGRAPHY"
        title="The Lens Speaks"
        description="Capture the world as you see it. Submit your ecological photographic essay before the festival begins."
        details={[
          { icon: '📸', label: 'Open ecological theme' },
          { icon: '📅', label: 'Submit before Aug 5' },
        ]}
        prizes="1st Prize: ₹1,000"
        image="photography.jpg"
        layout="row"
        registerUrl="https://forms.gle/mockPhotographyForm"
      />

      <EventCard
        badge="DAY 1 · 10:00 AM – 12:00 PM · FAROOKIANS ONLY"
        title="Treasure Hunt"
        titleSerif="Settaakkanam"
        description="Race through the college surroundings in a team of 4 — solving ecological riddles, tracking flora, and chasing clues hidden in plain sight."
        details={[
          { icon: '⏰', label: '10:00 AM – 12:00 PM' },
          { icon: '📍', label: 'College Surroundings' },
          { icon: '👥', label: 'Team of 4' },
          { icon: '💰', label: '₹100 per team' },
        ]}
        prizes="1st Prize: ₹1,000"
        restriction="FAROOKIANS ONLY"
        image="tressure.jpg"
        onRegisterClick={() => onRegisterClick('Treasure Hunt')}
      />

      <EventCard
        badge="DAY 1 · 1:00 PM – 2:30 PM · WORKSHOP"
        title="Terrarium Making Workshop"
        description="Build a miniature ecosystem in a glass container. Learn the art of designing self-sustaining micro-worlds under expert guidance."
        details={[
          { icon: '⏰', label: '1:00 PM – 2:30 PM' },
          { icon: '📍', label: 'R-07 (pending)' },
          { icon: '🌿', label: 'Hands-on Workshop' },
        ]}
        fee="Details TBA"
        image="terrarium.jpg"
        onRegisterClick={() => onRegisterClick('Terrarium Making Workshop')}
      />

      <EventCard
        badge="DAY 1 · 1:00 PM – 2:30 PM · ART COMPETITION"
        title="Vegetable Printing"
        titleSerif="Settaakkanam"
        description="Transform vegetables into stamps. Print your ecological imagination onto fabric — each piece a unique intersection of nature and art. Bring your own vegetables, paint, and carving materials. Cloth will be provided."
        details={[
          { icon: '⏰', label: '1:00 PM – 2:30 PM' },
          { icon: '📍', label: 'Botany Classroom R-04' },
          { icon: '💰', label: '₹50 entry fee' },
        ]}
        prizes="1st: ₹750 · 2nd: ₹500 · 3rd: ₹250"
        image="vegprint.jpg"
        onRegisterClick={() => onRegisterClick('Vegetable Printing')}
      />

      <div className="border border-[hsl(var(--border))]/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black">
        <div>
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-2">
            <span>🎓</span> Valedictory Function
          </div>
          <p className="text-white text-base">
            Celebrating the day's achievements, prize distribution, and
            reflection.
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-2 text-sm">
          <div className="liquid-glass rounded-full px-4 py-1">
            3:00 PM – 4:00 PM · Auditorium
          </div>
          <div className="bg-white/5 text-white/60 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Free to all
          </div>
        </div>
      </div>
    </motion.div>
  );
}
