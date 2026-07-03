import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WordReveal = ({ text }: { text: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.4'],
  });

  const words = text.split(' ');

  return (
    <div ref={ref} className="leading-relaxed">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        // The prompt asked to highlight certain words in white.
        // Let's implement that based on specific keywords.
        const highlightWords = ['curiosity', 'clarity', 'worth', 'having.'];
        const isHighlight = highlightWords.some(hw =>
          word.toLowerCase().includes(hw)
        );

        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className={`inline-block mr-[0.25em] ${
              isHighlight ? 'text-white font-semibold' : 'text-[hsl(var(--hero-subtitle))]'
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
};

export default function MissionSection() {
  return (
    <section className="pt-0 pb-32 md:pb-44 px-6 md:px-28">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto rounded-3xl overflow-hidden mb-24 aspect-video relative"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="/butter.mp4"
              type="video/mp4"

            />
          </video>
        </motion.div>

        <div className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] max-w-4xl mx-auto text-center mb-10">
          <WordReveal text="We're building a space where curiosity meets clarity — where students become ecologists, classrooms become forests, and every season of Myristica becomes a conversation worth having." />
        </div>

        <div className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 max-w-3xl mx-auto text-center text-[hsl(var(--hero-subtitle))]">
          <WordReveal text="A festival where ecology, community, and action flow together — with less apathy, less silence, and more meaning for the planet and everyone on it." />
        </div>
      </div>
    </section>
  );
}
