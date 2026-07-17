import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Hls from 'hls.js';
import { fadeUp } from '../lib/utils';

interface CTASectionProps {
  onRegisterClick?: () => void;
};

let The_torch_bearers = [
  'Adila Farisa K.M','Adila K','Adirsha K M','Afna P','Aisha Fehmin','Aiswarya','Akshay S','Kumar Amar P','Amrutha Ramesh K','Anamika C.S','Anamika P','Aswin C','Athira P','  Athulya','Aysha Fehmin','Dilsha P M','Farhana Sherin','  Farhath E','Fathima Bisriya PP','Fathima Shajrin KE','Favas Muhammed AF','Febina Thasneem K','Fidha M. K','Hanan P.T','Hanoona KT','Haroonsha I','Jabin Farsana','Janeena Parveen','Jaseela Abdul Jaleel','Jaseem KP','Jebin Farsana','Jithin V','Liyana','Haseen M','Malavika','Meher Sameeh N','Midhuna','Mridul M','Mahesh','Muhammad Adhil','Muhammed Hashir KM','Murshida Thasni PN','Nidha K K','Nimra Mubarak','Nishana AP','Noorul Haque','Pranav','Jayaraj','Raheema Ruby','Reshma TT','Rifas Muhammed','Rincy','Rinsha','Riya Fathima','Rumaiza','Rushda E. P','Shahana Shereena','Shahma','Shajrin E','Shasna C. P','Shelly E. P','Shibila CK','Shinin','Fidha','Soja','Fathish KP','Sudev Krishna M','Thasneema','Theertha','Suresh','Vismaya','Dr. K Kishore Kumar','Dr Anjana S','Dr Naseeha CP','Prof EP Imbichikoya','Dr AP Rashiba','Midhun Shah','Sajid Aboobacker PP',' Mirshad','Dr. K. M. Naseer','Vijesh Vallikkunnu','Abdul Riyas K','Dr. Sumathi',' P. T. Nushiba Nasar'
];

let SPONSORS  = [
  'Sahyadri Club','Apollo Tyres','Amana Toyota','Darussalam Mall','K-Hills','SBI Foundation','Goalway Academy','CRM Hospital','Digitech Medias','Wildlife Trust of India (WTI)','Kannur Kandal Project','Mr. Azeem : Qatar','Illikal Family'
]

export default function CTASection({ onRegisterClick }: CTASectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Autoplay prevented', e));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log('Autoplay prevented', e));
      });
    }
  }, []);

  return (
    <section id="register" className="py-20 md:py-28 border-t border-[hsl(var(--border))]/30 overflow-hidden relative min-h-[600px] flex items-center justify-center">
      {/* Background HLS Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 z-[1]" />

      <div className="relative z-10 px-6 md:px-28 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-center mb-2 ">
            <img 
              src="/Myristica_Icon.png" 
              alt="Myristica Logo" 
              className="h-16 transition-transform duration-1000 hover:scale-105 "
            />
          </div>
          <div className="tracking-[3px] text-xs uppercase text-white/70 mb-6 font-semibold">
            MYRISTICA SEASON 5
          </div>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl font-medium tracking-[-2px] mb-8"
        >
          <span className="block text-white">Be part of the</span>
          <span className="block font-serif italic font-normal text-white">
            ecological movement.
          </span>
        </motion.h2>

        {/* Premium Glowing Grids */}
        <motion.div 
          {...fadeUp(0.15)} 
          className="w-[95vw] md:w-[90vw] max-w-6xl relative  mb-16 flex flex-col items-center"
        >
          <div className="flex flex-col gap-12 w-full mt-6">
            {/* Sponsors */}
            <div className="flex flex-col items-center w-full">
              <span className="text-emerald-400 text-xs tracking-[0.4em] uppercase mb-8 font-semibold drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Season 1-4 Official Sponsors</span>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full">
                {SPONSORS.map((name, i) => (
                  <div key={i} className="px-5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:border-emerald-400/50 transition-all duration-300 cursor-default">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-100 to-cyan-300 text-xs md:text-xs font-bold tracking-wide drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] uppercase">
                      {name.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Torch Bearers */}
            <div className="flex flex-col items-center w-full">
              <span className="text-white text-xs tracking-[0.4em] uppercase mb-8 font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">Season 1-4 Torch Bearers</span>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full">
                {The_torch_bearers.map((name, i) => (
                  <div key={i} className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-default">
                    <span className="text-white/90 text-sm md:text-base font-medium drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                      {name.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          {...fadeUp(0.2)}
          className="text-white/80 text-lg max-w-lg mx-auto mb-4"
        >
          Join 500+ students, researchers, and nature enthusiasts at Farook
          College on August 18 & 19, 2026.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="text-sm text-white/60 tracking-wide mb-12"
        >
          18 & 19 August 2026 · Farook College, Kozhikode
        </motion.div>

        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto"
        >
          <motion.button
            onClick={onRegisterClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto bg-white text-black rounded-lg px-8 py-3.5 font-semibold transition-colors text-center cursor-pointer"
          >
            REGISTER NOW
          </motion.button>
          <motion.a
            href="#events"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto liquid-glass rounded-lg px-8 py-3.5 text-white transition-colors text-center"
          >
            VIEW ALL EVENTS
          </motion.a>
        </motion.div>

        <motion.p
          {...fadeUp(0.5)}
          className="text-xs text-white/50 tracking-wider"
        >
          Organized by Department of Botany, Farook College · Season 5 · August
          2026
        </motion.p>
      </div>
    </section>
  );
}
