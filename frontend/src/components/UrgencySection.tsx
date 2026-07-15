import { motion } from 'framer-motion';
import { fadeUp } from '../lib/utils';
import AnimatedCounter from './AnimatedCounter';

const cards = [
  {
    image:
      'Lung-shaped forest.jpg',
    number: '1000000',
    suffix: '+',
    title: 'Species at risk of extinction globally',
    desc: 'The biodiversity crisis is no longer a future problem.',
  },
  {
    image:
      'kerala.jpg',
    number: '6',
    suffix: '.5-12%',
    title: "Of Kerala's native flora threatened",
    desc: 'The land of spices is losing its ancient green wealth.',
  },
  {
    image:
      'farook.jpg',
    number: '5',
    suffix: '',
    title: 'Seasons of ecological action at Farook College',
    desc: 'Myristica turns awareness into movement.',
  },
];

export default function UrgencySection() {
  return (
    <section className="pt-52 md:pt-64 pb-6 md:pb-9 px-6 md:px-28">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl lg:text-8xl tracking-[-2px] mb-6"
        >
          <span className="block">Biodiversity is disappearing.</span>
          <span className="block font-serif italic font-normal">
            Are you paying attention?
          </span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto md:mx-0 mb-24"
        >
          The sixth mass extinction is underway. Myristica exists because
          someone has to.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-20">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.3 + i * 0.1)}
              className="liquid-glass rounded-2xl p-8 flex flex-col items-center text-center group"
            >
              <div className="w-full aspect-square max-w-[200px] mb-8 overflow-hidden rounded-xl">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="text-5xl font-semibold mb-4 tracking-tight">
                <AnimatedCounter
                  end={parseInt(card.number)}
                  suffix={card.suffix}
                  duration={2.5}
                />
              </div>

              <h3 className="font-semibold text-base mb-2">{card.title}</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...fadeUp(0.6)}
          className="text-[hsl(var(--muted-foreground))] text-sm text-center tracking-widest uppercase"
        >
          Nature doesn't negotiate deadlines.
        </motion.p>
      </div>
    </section>
  );
}
