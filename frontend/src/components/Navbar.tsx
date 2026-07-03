import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navLinks = ['Home', 'About', 'Legacy', 'Events', 'Register'];

const linkToId: Record<string, string> = {
  Home: '#hero',
  About: '#about',
  Events: '#events',
  Legacy: '#legacy',
  Register: '#register',
};

const SocialIcons = [
  {
    label: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      </svg>
    ),
  },
];

interface NavbarProps {
  onRegisterClick?: () => void;
}

export default function Navbar({ onRegisterClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-28 py-4 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'backdrop-blur-[10px] bg-black/20' : ''
      }`}
    >
      {/* Logo */}
      <a href="#hero" className="flex items-center gap-1 group">
        <img 
          src="/Myristica_Icon.png" 
          alt="Myristica Logo" 
          className="h-10 transition-transform duration-1000 hover:scale-105 "
        />
        <span className="font-serif italic text-lg font-normal tracking-wide">
          Myristica
        </span>
      </a>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link, i) => (
          <span key={link} className="flex items-center">
            {link === 'Register' ? (
              <button
                onClick={(e) => {
                  if (onRegisterClick) {
                    e.preventDefault();
                    onRegisterClick();
                  }
                }}
                className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors duration-300 px-2 py-1 bg-transparent border-0 cursor-pointer"
              >
                {link}
              </button>
            ) : (
              <a
                href={linkToId[link]}
                className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors duration-300 px-2 py-1"
              >
                {link}
              </a>
            )}
            {i < navLinks.length - 1 && (
              <span className="text-[hsl(var(--muted-foreground))] text-xs mx-1">
                ·
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Social Icons */}
      <div className="hidden md:flex items-center gap-2">
        {SocialIcons.map(({ icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white transition-colors duration-300"
          >
            {icon}
          </a>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-px bg-white transition-all duration-300 ${
            mobileOpen ? 'rotate-45 translate-y-[4px]' : ''
          }`}
        />
        <span
          className={`w-6 h-px bg-white transition-all duration-300 ${
            mobileOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`w-6 h-px bg-white transition-all duration-300 ${
            mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''
          }`}
        />
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-[hsl(var(--border))]/30 md:hidden"
        >
          <div className="flex flex-col items-center py-8 gap-4">
            {navLinks.map((link) => {
              const isRegister = link === 'Register';
              return isRegister ? (
                <button
                  key={link}
                  onClick={() => {
                    setMobileOpen(false);
                    if (onRegisterClick) onRegisterClick();
                  }}
                  className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {link}
                </button>
              ) : (
                <a
                  key={link}
                  href={linkToId[link]}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
                >
                  {link}
                </a>
              );
            })}
            <div className="flex gap-3 mt-4">
              {SocialIcons.map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
