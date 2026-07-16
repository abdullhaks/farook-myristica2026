import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { InstagramOutlined } from '@ant-design/icons';

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
    icon: <InstagramOutlined style={{ fontSize: '16px' }} />,
    link:'https://instagram.com/myristica_season.5'
  },
  {
    label: 'Email',
    icon: <Mail size={16} />,
    link:'mailto:myristicafc@gmail.com'

  }
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
        scrolled ? 'backdrop-blur-[5px] bg-black/10' : ''
      }`}
    >
      {/* Logo */}
      <a href="#hero" className="flex items-center gap-1 group">
        <img 
          src="/Myristica_Logo.png" 
          alt="Myristica Logo" 
          className="h-10 transition-transform duration-1000 hover:scale-105 "
        />
        {/* <span className="font-serif italic text-lg font-normal tracking-wide">
          Myristica
        </span> */}
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
        {SocialIcons.map(({ icon, label,link }) => (
          <a
            key={label}
            href={link}
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
              {SocialIcons.map(({ icon, label, link }) => (
                <a
                  key={label}
                  href={link}
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
