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
        description="The premier ecological quiz of the season. Test your knowledge of biodiversity, conservation, flora, fauna, and environmental science. (Registration: 9:30 AM – 10:00 AM | Preliminary: 10:00 AM – 10:30 AM | Final: 11:00 AM – 12:30 PM)"
        details={[
          { icon: '📍', label: 'Auditorium' },
          { icon: '💰', label: '₹100 per head' },
          { icon: '👥', label: 'Team of 2 or individual' },
        ]}
        prizes="1st: ₹3,000 · 2nd: ₹2,000 · 3rd: ₹1,000"
        image="/quiz1.jpg"
        layout="row"
        onRegisterClick={() => onRegisterClick('The Big Quiz')}
      />

      <EventCard
        badge="DAY 2 · 10:00 AM – 12:30 PM · ART COMPETITION"
        title="Vegetable Printing"
        titleSerif="Impressa "
        description="Transform vegetables into stamps. Print your ecological imagination onto fabric. Bring your own vegetables, paint, and carving materials. Cloth will be provided."
        details={[
          { icon: '⏰', label: '10:00 AM – 12:30 PM' },
          { icon: '📍', label: 'Botany Classroom R-04' },
          { icon: '💰', label: '₹50 entry fee' },
        ]}
        prizes="1st: ₹750 · 2nd: ₹500 · 3rd: ₹250"
        image="vegprint.jpg"
        onRegisterClick={() => onRegisterClick('Vegetable Printing')}
      />

      <EventCard
        badge="DAY 2 · 1:00 PM – 3:00 PM · FREE TO ALL"
        title="Valedictory Function"
        description="Celebrating the day's achievements, prize distribution, and reflection."
        details={[
          { icon: '⏰', label: '1:00 PM – 3:00 PM' },
          { icon: '📍', label: 'Auditorium' },
          { icon: '🎓', label: 'Free to all' },
        ]}
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"
        layout="row"
        hideRegister={true}
      />
    </motion.div>
  );
}
