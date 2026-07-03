import { Suspense, useRef, useEffect } from 'react';
import ParticleField from './ParticleField';
import HeroContent from './HeroContent';

interface HeroSectionProps {
  onRegisterClick?: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeAnimFrame = useRef<number | undefined>(undefined);
  const fadingOutRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fade function using requestAnimationFrame
    const fadeTo = (targetOpacity: number, duration = 500) => {
      if (fadeAnimFrame.current) cancelAnimationFrame(fadeAnimFrame.current);
      
      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing can be linear for simplicity or easeInOut
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        video.style.opacity = currentOpacity.toString();

        if (progress < 1) {
          fadeAnimFrame.current = requestAnimationFrame(animate);
        }
      };
      
      fadeAnimFrame.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      // Fade in on initial load
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeLeft = video.duration - video.currentTime;
      
      // Start fade out when 0.55s remain
      if (timeLeft <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          fadingOutRef.current = false;
          fadeTo(1, 500);
        }).catch(() => {
           // Handle play interruption if necessary
        });
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    // In case it's already loaded (e.g. HMR or fast cache)
    if (video.readyState >= 2) {
      handleLoadedData();
    } else {
       video.style.opacity = '0';
    }

    return () => {
      if (fadeAnimFrame.current) cancelAnimationFrame(fadeAnimFrame.current);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Three.js Particle Field */}
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      {/* Nature video overlay with Custom JS Fade System */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover z-[1] pointer-events-none translate-y-[17%]"
        style={{ opacity: 0, mixBlendMode: 'screen' }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          type="video/mp4"
        />
      </video>

      {/* Hero content */}
      <HeroContent onRegisterClick={onRegisterClick} />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none" />
    </section>
  );
}
