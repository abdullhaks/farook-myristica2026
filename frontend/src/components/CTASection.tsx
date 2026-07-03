import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Hls from 'hls.js';
import { fadeUp } from '../lib/utils';

interface CTASectionProps {
  onRegisterClick?: () => void;
}

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
    <section id="register" className="py-32 md:py-44 border-t border-[hsl(var(--border))]/30 overflow-hidden relative min-h-[600px] flex items-center justify-center">
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

        <motion.p
          {...fadeUp(0.2)}
          className="text-white/80 text-lg max-w-lg mx-auto mb-4"
        >
          Join 500+ students, researchers, and nature enthusiasts at Farook
          College on August 5 & 6, 2026.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="text-sm text-white/60 tracking-wide mb-12"
        >
          5 & 6 August 2026 · Farook College, Kozhikode
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
