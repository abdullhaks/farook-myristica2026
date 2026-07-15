import { motion } from 'framer-motion';

const AnimatedTitle = ({
  text,
  className = '',
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delayOffset + i * 0.03,
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{ marginRight: char === ' ' ? '0.25em' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};


interface HeroContentProps {
  onRegisterClick?: () => void;
}

export default function HeroContent({ onRegisterClick }: HeroContentProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-28 md:pt-32 -translate-y-[10%]">
      {/* College Logo & Name Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex items-center gap-2.5 mb-4 mt-28 px-4 py-1.5 rounded-full"
      >
        <img 
          src="/magnolia.jpeg" 
          alt="Magnolia" 
          className="h-8 rounded-sm "
        />
        <span className="text-[10px] font-semibold tracking-[2px] uppercase text-white/80">
          Magnolia 2.0 Association of Botany
        </span>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex items-center gap-2.5 mb-4 mt-28 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-sm"
      >
        <img 
          src="/magnolia.jpeg" 
          alt="Magnolia" 
          className="h-8 rounded-sm "
        />
        <span className="text-xs font-semibold tracking-[2px] uppercase text-white/80">
          Magnolia 2.0 Association of Botany
        </span>
      </motion.div> */}

      {/* Season badge with Program Logo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8"
      >
        <img 
          src="/clg.jpg" 
          alt="Myristica Logo" 
          className="h-8"
        />
        <span className="text-xs tracking-[3px] uppercase text-white">
          Farook college (Autonomous), Kozhikode
        </span>
      </motion.div>


      {/* Main heading */}
      <h1 
        className="text-5xl md:text-7xl lg:text-9xl tracking-[-3px] leading-[0.92] mb-1 font-serif"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        <span className="block">
          <AnimatedTitle text="Myristica" delayOffset={0.5} />
        </span>
        <span className="block text-3xl md:text-5xl lg:text-7xl">
          <AnimatedTitle text="Students’ " delayOffset={0.8} />
          <AnimatedTitle
            text="Ecological "
            className="italic font-normal"
            delayOffset={0.9}
          />
          <AnimatedTitle
            text="festival"
            className="italic font-normal"
            delayOffset={0.9}
          />
        </span>
        {/* <span className="block text-3xl md:text-5xl lg:text-7xl">
          <AnimatedTitle text="festival" delayOffset={1.2} />
        </span> */}
      </h1>

       <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8"
      >
        <img 
          src="/Myristica_Icon.png" 
          alt="Myristica Logo" 
          className="h-8"
        />
        {/* <span className="text-xs tracking-[3px] uppercase text-[hsl(var(--muted-foreground))]">
          Season 5 · Aug 18–19, 2026
        </span> */}
        <span className="text-xs tracking-[3px] uppercase text-white/90">
          Season 5 · Aug 18–19, 2026
        </span>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="text-lg max-w-2xl mx-auto mb-8"
        style={{ color: 'hsl(var(--hero-subtitle))' }}
      >
        Kerala's only event on the United Nations CBD Global Action Map. A
        state-level ecological festival from Farook College, returning for
        Season 5.
      </motion.p>

      {/* Date / Location pills */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        <div className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
          <span>📅</span> 18 & 19 August 2026
        </div>
        <div className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
          <span>📍</span> Farook College, Kozhikode
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        <motion.button
          onClick={onRegisterClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-black rounded-full px-8 py-3.5 font-semibold text-sm tracking-wide cursor-pointer text-center"
        >
          REGISTER NOW
        </motion.button>
        <motion.a
          href="#events"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="liquid-glass rounded-full px-8 py-3.5 text-sm tracking-wide cursor-pointer text-center"
        >
          EXPLORE EVENTS
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        {/* <div className="animate-pulse-down">
          <ChevronDown size={20} className="text-[hsl(var(--muted-foreground))]" />
        </div>
        <span className="text-xs text-[hsl(var(--muted-foreground))] tracking-widest uppercase">
          Scroll to explore
        </span> */}
      </motion.div>
    </div>
  );
}
