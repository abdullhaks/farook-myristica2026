import { Globe } from 'lucide-react';
import { InstagramOutlined } from '@ant-design/icons';

const navLinks = ['Home', 'About', 'Events', 'Legacy', 'Founder', 'Register'];

const SocialIcons = [
  {
    label: 'Instagram',
    icon: <InstagramOutlined style={{ fontSize: '16px' }} />,
    link: 'https://www.instagram.com/abdullha_kalamban'
  },
  {
    label: 'Personal website',
    icon: <Globe size={16} />,
    link: 'https://www.abdullhakalamban.online'
  }
];

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-28 border-t border-[hsl(var(--border))]/30 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        
        {/* Left */}
        <div className="flex flex-col gap-6">
          <a href="#hero" className="flex items-center gap-3 group">
            <img
              src="/Myristica_Icon.png"
              alt="Myristica Logo"
              className="h-10 transition-transform duration-1000 hover:scale-105 "
            />
            <span className="font-serif italic text-xl font-normal tracking-wide">
              Myristica
            </span>
          </a>
          <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed max-w-sm">
            The Ecological Fiesta · Department of Botany, Farook College,
            Kozhikode, Kerala
          </p>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            🌿 Featured on UN CBD Global Action Map
          </div>
        </div>

        {/* Center */}

        <div className="flex flex-col md:items-center gap-6">
          <div className="flex items-center gap-3">
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
          <div className="flex flex-col md:items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <p className="text-white/80 text-[10px] font-light tracking-wider">
              © <span className='text-xs'>AKS web-solutions</span>. Made with 
              <span className="text-red-400 mx-1">♥</span> 
              and endless cups of chai
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/+918594043859" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        
         {/* Right */}
        <div className="flex flex-col md:items-center">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="text-[hsl(var(--muted-foreground))] text-sm hover:text-white transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

       
        
      </div>
    </footer>
  );
}
