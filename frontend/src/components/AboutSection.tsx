import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const StaggeredFade = ({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const characters = text.split('');

  return (
    <span ref={ref} className="inline-block">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{
            duration: 0.1,
            delay: delayOffset + i * 0.07,
            ease: 'easeOut',
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-[120vh] overflow-hidden bg-[#010101] py-32 md:py-44 px-6 md:px-28"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay gradient to blend bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-[3px] uppercase text-[hsl(var(--muted-foreground))] mb-8"
        >
          ABOUT
        </motion.p>

        <h2 className="font-garamond text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-normal text-white leading-[1.08] tracking-tight mb-6 sm:mb-8 flex flex-col items-center">
          <StaggeredFade text="Kerala's most unique" delayOffset={0} />
          <StaggeredFade text="ecological festival" delayOffset={0.6} />
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-col items-center gap-6 mt-6 max-w-3xl"
        >
          <div className="text-white/70 font-light text-sm sm:text-base md:text-lg leading-relaxed space-y-6">
            <p>
              Myristica — The Ecological Fiesta is a state-level ecological
              festival organized by the students of Department of Botany, Farook College, Kozhikode, in collaboration with the Malabar Natural History Society. Named after the threatened tree Myristica malabarica in the IUCN Redlist, this festival roots itself in Kerala's rich biodiversity.
            </p>
            <p>
              After four successful seasons between 2016 and 2020, Myristica
              Season 5 makes its long-awaited return on 18 & 19 August 2026 —
              bigger, bolder, and more urgent than ever.
            </p>
            <p>
              Myristica is Kerala's only event and one of just two from South
              India featured on the{' '}
              <strong className="text-white font-medium">
                United Nations Convention on Biological Diversity (CBD) Global
                Action Map
              </strong>
              . Through this recognition, Farook College has been officially acknowledged as an Actor in the Worldwide Network on the UN CBD platform, as part of the United Nations Decade on Biodiversity (2011–2020).
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <div className="liquid-glass rounded-full px-7 sm:px-10 py-3.5 sm:py-4 text-white/90 uppercase tracking-[0.18em] sm:tracking-[0.2em] text-xs sm:text-sm whitespace-nowrap">
              🇺🇳 UN CBD Global Action Map · 2018
            </div>
            <div className="liquid-glass rounded-full px-7 sm:px-10 py-3.5 sm:py-4 text-white/90 uppercase tracking-[0.18em] sm:tracking-[0.2em] text-xs sm:text-sm whitespace-nowrap">
              🇮🇳 Ministry of Environment, GoI
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
