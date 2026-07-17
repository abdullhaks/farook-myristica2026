import EventCard from './EventCard';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

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
      <motion.div onViewportEnter={() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }} viewport={{ once: true, margin: "-50px" }}>
        <EventCard
          badge="DAY 1 · 9:00 AM – 10:30 AM · INAUGURATION"
          title="Inauguration"
          description="The grand opening ceremony of Myristica Season 5. Join us as we commence this ecological journey."
          details={[
            { icon: '⏰', label: '9:00 AM – 10:30 AM' },
            { icon: '📍', label: 'Auditorium' },
            { icon: '🎉', label: 'Open to all' },
          ]}
          layout="row"
          hideRegister={true}
        />
      </motion.div>

      {/* Short Film Screening */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-3xl overflow-hidden relative w-full group cursor-pointer mt-6"
      >
        <div className="absolute inset-0 bg-black/60 z-[1] transition-colors group-hover:bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=80"
          alt="Cinematic background"
          className="w-full h-full min-h-[250px] object-cover"
        />
        <div className="absolute inset-0 z-10 p-6 md:p-8 flex flex-col items-center justify-center text-center">
          <div className="text-xs tracking-[2px] uppercase text-white/70 mb-2 md:mb-4">
            DAY 1 · SHORT FILM SCREENING
          </div>
          <h3 className="text-4xl md:text-5xl font-medium mb-4">
            <span className="font-serif italic font-normal">
              "A Million Dreams"
            </span>
          </h3>
          <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto mb-8">
            Environmental awareness · Plastic usage · Tree conservation ·
            Biodiversity conservation
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="liquid-glass rounded-full px-4 py-2 text-sm text-white">
              ⏰ 10:30 AM – 12:30 PM
            </div>
            <div className="liquid-glass rounded-full px-4 py-2 text-sm text-white">
              📍 AVT
            </div>
            <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
              FREE TO ALL
            </div>
          </div>

          <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-1"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
        </div>
      </motion.div>

      <EventCard
        badge="DAY 1 · 1:00 PM – 2:00 PM · DEBATE"
        title="The Ecological Debate"
        titleSerif="Ecoverse"
        description="Individual participants clash over pressing ecological and environmental questions. Sharpen your arguments — this is intellectual warfare for the planet."
        details={[
          { icon: '⏰', label: '1:00 PM – 2:00 PM' },
          { icon: '📍', label: 'Golden Jubilee Hall, Botany Department' },
          { icon: '💰', label: '₹50 entry' },
          { icon: '👤', label: 'Individual participation' },
        ]}
        prizes="1st: ₹1,000 · 2nd: ₹500"
        image="debate.jpg"
        onRegisterClick={() => onRegisterClick('The Ecological Debate')}
      />

      <EventCard
        badge="DAY 1 · 1:30 PM – 3:30 PM · FAROOKIANS ONLY"
        title="Treasure Hunt"
        titleSerif="Mystic Hunt"
        description="Race through the college surroundings in a team of 4 — solving ecological riddles, tracking flora, and chasing clues hidden in plain sight."
        details={[
          { icon: '⏰', label: '1:30 PM – 3:30 PM' },
          { icon: '📍', label: 'College Surroundings' },
          { icon: '👥', label: 'Team of 4' },
          { icon: '💰', label: '₹100 per team' },
        ]}
        restrictionFee="₹100 per team"
        prizes="1st Prize: ₹1,000"
        restriction="FAROOKIANS ONLY"
        image="tressure.jpg"
        onRegisterClick={() => onRegisterClick('Treasure Hunt')}
      />
    </motion.div>
  );
}
