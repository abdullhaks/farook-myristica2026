const navLinks = ['Home', 'About', 'Events', 'Legacy', 'Founder', 'Register'];

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

        <div className="flex flex-col md:items-end gap-6">
          <div className="flex items-center gap-3">
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
          <div className="flex flex-col md:items-end gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <p>© 2026 Myristica · Farook College</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
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
