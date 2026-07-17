import { motion } from 'framer-motion';

export interface EventCardProps {
  badge: string;
  title: string;
  titleSerif?: string; // Word(s) to render in Instrument Serif italic
  description: string;
  details: Array<string | { icon: string; label: string }>;
  prizes?: string;
  fee?: string;
  restrictionFee?:string;
  restriction?: string;
  image?: string;
  registerUrl?: string;
  layout?: 'row' | 'col';
  onRegisterClick?: () => void;
  hideRegister?: boolean;
}

export default function EventCard({
  badge,
  title,
  titleSerif,
  description,
  details,
  prizes,
  fee,
  restrictionFee,
  restriction,
  image,
  registerUrl = '#register',
  layout = 'col',
  onRegisterClick,
  hideRegister = false,
}: EventCardProps) {
  const CardContent = () => {
    const isExternal = registerUrl.startsWith('http');
    
    return (
      <>
        <div className="text-xs tracking-[2px] uppercase text-[hsl(var(--muted-foreground))] mb-3">
          {badge}
        </div>
        <h3 className="text-2xl md:text-3xl font-medium mb-3">
          {titleSerif ? (
            <>
              <span className="font-serif italic font-normal mr-2">
                {titleSerif}
              </span>
              {title && <span>— {title}</span>}
            </>
          ) : (
            title
          )}
        </h3>
        <p className="text-[hsl(var(--muted-foreground))] text-base leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {details.map((detail, i) => (
            <div
              key={i}
              className="liquid-glass rounded-full px-4 py-2 text-sm flex items-center gap-2"
            >
              {typeof detail === 'string' ? (
                detail
              ) : (
                <>
                  <span>{detail.icon}</span> {detail.label}
                </>
              )}
            </div>
          ))}
        </div>

        {(prizes || restriction || fee || restrictionFee) && (
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {prizes && <div className="text-lg font-semibold">{prizes}</div>}
            {restriction && (
              <div className="bg-white/5 text-white/60 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {restriction}
              </div>
            )}
            {(fee || restrictionFee) && (
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                {fee || restrictionFee}
              </div>
            )}
          </div>
        )}

        {!hideRegister && (
          <motion.a
            href={isExternal ? registerUrl : undefined}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (onRegisterClick) {
                e.preventDefault();
                onRegisterClick();
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block bg-foreground text-background rounded-lg px-6 py-2.5 text-sm font-semibold transition-transform cursor-pointer text-center"
          >
            REGISTER
          </motion.a>
        )}
      </>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="liquid-glass rounded-3xl p-8 md:p-10 mb-6 group transition-all"
    >
      {layout === 'row' && image ? (
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <CardContent />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col-reverse md:flex-row gap-10">
          <div className="flex-1">
            <CardContent />
          </div>
          {image && (
            <div className="w-full md:w-1/3 rounded-2xl overflow-hidden aspect-video md:aspect-square">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
