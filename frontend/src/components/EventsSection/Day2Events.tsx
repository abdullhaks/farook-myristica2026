import EventCard from './EventCard';
import { motion } from 'framer-motion';

interface Day2EventsProps {
  onRegisterClick: (eventName: string) => void;
}

export default function Day2Events({ onRegisterClick }: Day2EventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mt-12"
    >
      <EventCard
        badge="DAY 2 · FLAGSHIP EVENT · QUIZ"
        title="The Big Quiz"
        description="The premier ecological quiz of the season. Test your knowledge of biodiversity, conservation, flora, fauna, and environmental science across two rounds. (Preliminary: 9:00 AM – 10:30 AM | Final: 11:00 AM – 12:30 PM)"
        details={[
          { icon: '📍', label: 'Auditorium' },
          { icon: '💰', label: '₹100 per head' },
          { icon: '👥', label: 'Team of 2 or individual' },
        ]}
        prizes="1st: ₹3,000 · 2nd: ₹2,000 · 3rd: ₹1,000"
        image="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&q=80"
        layout="row"
        onRegisterClick={() => onRegisterClick('The Big Quiz')}
      />

      <EventCard
        badge="DAY 2 · 1:00 PM – 2:00 PM · DEBATE"
        title="The Ecological Debate"
        titleSerif="Samaram"
        description="Individual participants clash over pressing ecological and environmental questions. Sharpen your arguments — this is intellectual warfare for the planet."
        details={[
          { icon: '⏰', label: '1:00 PM – 2:00 PM' },
          { icon: '📍', label: 'Golden Jubilee Hall, Botany Department' },
          { icon: '💰', label: '₹50 entry' },
          { icon: '👤', label: 'Individual participation' },
        ]}
        image="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80"
        onRegisterClick={() => onRegisterClick('The Ecological Debate')}
      />

      {/* Short Film Screening */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-3xl overflow-hidden relative w-full group cursor-pointer mt-6"
      >
        <div className="absolute inset-0 bg-black/60 z-[1] transition-colors group-hover:bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=80"
          alt="Cinematic background"
          className="w-full h-full min-h-[400px] object-cover"
        />
        <div className="absolute inset-0 z-10 p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <div className="text-xs tracking-[2px] uppercase text-white/70 mb-4">
            DAY 2 · SCREENING · FREE TO ALL
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
              ⏰ 1:30 PM – 2:30 PM
            </div>
            <div className="liquid-glass rounded-full px-4 py-2 text-sm text-white">
              📍 Auditorium
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
    </motion.div>
  );
}
