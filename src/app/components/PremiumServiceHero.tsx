import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Sparkles, Star } from 'lucide-react';

type PremiumServiceHeroProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  tags?: string[];
};

export function PremiumServiceHero({
  icon: Icon,
  title,
  subtitle,
  description,
  badge = 'Premium Service',
  tags = ['Certified', 'Human-reviewed', 'Confidential'],
}: PremiumServiceHeroProps) {
  const words = title.trim().split(/\s+/);
  const highlight = words.length > 1 ? words.slice(-1).join(' ') : title;
  const lead = words.length > 1 ? words.slice(0, -1).join(' ') : '';

  return (
    <section className="relative bg-gradient-to-br from-[#151249] via-[#1e1a5e] to-[#151249] text-white py-24 md:py-28 px-6 md:px-8 overflow-hidden radial-glow-overlay">
      <div className="absolute inset-0 world-map-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(0,196,255,0.16),transparent_34%),radial-gradient(circle_at_75%_30%,rgba(244,208,63,0.16),transparent_32%)]"></div>
      <div className="blur-blob w-96 h-96 bg-yellow-400/20 top-10 right-10"></div>
      <div className="blur-blob w-96 h-96 bg-[#00C4FF]/18 bottom-10 left-10"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-7">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm md:text-base font-bold text-white">{badge}</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight mb-6"
              style={{ textShadow: '0px 3px 14px rgba(0,0,0,0.45)' }}
            >
              {lead && <>{lead} </>}
              <span className="gradient-text-shine">{highlight}</span>
            </h1>

            <p className="text-xl md:text-2xl text-yellow-300 font-bold leading-snug mb-6 max-w-3xl mx-auto lg:mx-0">
              {subtitle}
            </p>

            <p
              className="text-lg md:text-xl text-white/88 leading-relaxed max-w-3xl mx-auto lg:mx-0"
              style={{ textShadow: '0px 2px 8px rgba(0,0,0,0.28)' }}
            >
              {description}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-9">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white/92">{tag}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[280px] sm:min-h-[340px] flex items-center justify-center">
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-yellow-400/25 shadow-[0_0_90px_rgba(250,204,21,0.18)]"></div>
            <div className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-[#00C4FF]/10 blur-2xl"></div>
            <div className="absolute top-8 right-8 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-white">Expert Team</span>
            </div>
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-[2rem] bg-gradient-to-br from-yellow-400 via-yellow-500 to-[#E3B552] flex items-center justify-center shadow-[0_24px_80px_rgba(250,204,21,0.35)]">
              <div className="absolute inset-4 rounded-[1.5rem] border border-white/35"></div>
              <Icon className="w-20 h-20 sm:w-28 sm:h-28 text-[#151249]" strokeWidth={1.7} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
