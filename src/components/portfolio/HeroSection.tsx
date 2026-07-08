import React from 'react';
import { MessageCircle, ArrowRight, MapPin, Sparkles, Briefcase, Calendar, GraduationCap, Mail, ExternalLink } from 'lucide-react';
import { usePersonalInfo, useSiteContent, useSocialLinks, useSkills, useServices, useProjects, getLocalizedField } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

const SOCIAL_ICON: Record<string, any> = {};

const HeroSection = () => {
  const { lang, t } = useLanguage();
  const { data: info } = usePersonalInfo();
  const { data: content } = useSiteContent();
  const { data: socials } = useSocialLinks();
  const { data: skills } = useSkills();
  const { data: services } = useServices();
  const { data: projects } = useProjects();

  const name = info?.name || 'Advaxe Ndayisènga';
  const subtitle = content?.hero_subtitle || 'Software Engineer | Bitcoin Developer | Tech Innovator';
  const photoUrl = info?.photo_url || '/advaxe-profile.jpeg';
  const about = content?.about || "Advaxe Ndayisenga is a seasoned Burundian developer holding a Bachelor's degree in Computer Science. Over 5 years of experience across Lightning, WordPress, Prestashop, social media marketing and SEO audits.";
  const topSkills = (skills && skills.length ? skills : [
    { name: 'React / Next.js', percentage: 90 },
    { name: 'Node.js', percentage: 85 },
    { name: 'PHP', percentage: 95 },
    { name: 'Bitcoin / Lightning', percentage: 80 },
    { name: 'Rust', percentage: 55 },
    { name: 'WordPress', percentage: 90 },
  ]).slice(0, 6);
  const featured = (projects || [])[0];
  const topService = (services || [])[0];
  const phone = info?.phone?.replace(/\s/g, '').replace('+', '') || '25769898947';

  return (
    <section id="hero" className="relative pt-24 md:pt-28 pb-8">
      <div className="absolute inset-0 bg-mesh opacity-70 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-min">

          {/* HERO CARD */}
          <div className="bento-card md:col-span-4 lg:col-span-8 lg:row-span-2 p-8 md:p-12 flex flex-col justify-between min-h-[420px] animate-slide-up">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full blur-3xl animate-blob"
              style={{ background: 'hsl(var(--primary) / 0.22)' }} />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full blur-3xl animate-blob"
              style={{ background: 'hsl(var(--brand-violet) / 0.18)', animationDelay: '3s' }} />

            <div className="relative">
              <span className="chip mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {info?.freelance || t('available')} — {t('freelance')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-4">
                {name.split(' ')[0]}{' '}
                <span className="gradient-text">{name.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="relative mt-8 flex flex-wrap items-center gap-3">
              <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> {t('whatsapp')}
              </a>
              <a href="#contact" className="btn-outline inline-flex items-center gap-2">
                {t('contact_me')} <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2 ml-auto">
                {socials?.slice(0, 4).map(s => {
                  const Icon = SOCIAL_ICON[s.platform.toLowerCase()] || ExternalLink;
                  return (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:-translate-y-0.5">
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="bento-card md:col-span-2 lg:col-span-4 p-6 flex flex-col items-center text-center animate-slide-up"
            style={{ animationDelay: '.08s' }}>
            <div className="relative">
              <div className="absolute -inset-1 rounded-full blur-md opacity-70"
                style={{ background: 'var(--hero-gradient)' }} />
              <img src={photoUrl} alt={name}
                className="relative w-28 h-28 rounded-full object-cover ring-4 ring-background"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
            </div>
            <h3 className="mt-4 font-bold text-lg">{name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{info?.address || 'Gitega-Burundi'}</p>
            <a href={`mailto:${info?.email || ''}`}
              className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" /> {info?.email || 'contact@advaxe.dev'}
            </a>
          </div>

          {/* STATS / INFO CARD */}
          <div className="bento-card md:col-span-2 lg:col-span-4 p-6 animate-slide-up"
            style={{ animationDelay: '.16s', background: 'linear-gradient(135deg, hsl(var(--brand-amber) / 0.12), hsl(var(--primary) / 0.08))' }}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Briefcase, label: t('experience_label'), val: info?.experience || '5+ Years' },
                { Icon: GraduationCap, label: t('degree'), val: info?.degree || 'Bachelor CS' },
                { Icon: Calendar, label: t('birthday'), val: info?.birthday || '5 Apr 1998' },
                { Icon: MapPin, label: t('address'), val: info?.address || 'Gitega, BI' },
              ].map(({ Icon, label, val }) => (
                <div key={label} className="rounded-2xl bg-background/60 backdrop-blur p-3 border border-border/60">
                  <Icon className="w-4 h-4 text-primary mb-2" />
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
                  <div className="text-sm font-semibold mt-0.5 leading-tight">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SKILLS PREVIEW CARD (violet) */}
          <div className="bento-card md:col-span-2 lg:col-span-4 p-6 text-white overflow-hidden animate-slide-up"
            style={{ animationDelay: '.24s', background: 'var(--violet-gradient)' }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center gap-2 mb-4 relative">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2 relative">
              {topSkills.map((s: any, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/15 backdrop-blur-md border border-white/10">
                  {s.name}
                </span>
              ))}
            </div>
            <a href="#skills" className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium opacity-90 hover:opacity-100 relative">
              {t('skills')} <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* SERVICE HIGHLIGHT */}
          <div className="bento-card md:col-span-2 lg:col-span-4 p-6 flex flex-col justify-between min-h-[180px] animate-slide-up"
            style={{ animationDelay: '.32s' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: 'hsl(var(--brand-pink) / 0.12)' }}>
              <Sparkles className="w-5 h-5" style={{ color: 'hsl(var(--brand-pink))' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {topService ? getLocalizedField(topService.title, lang) : t('services')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {topService
                  ? getLocalizedField(topService.description, lang)
                  : 'Software engineering, Bitcoin & Lightning apps, CMS & SEO.'}
              </p>
              <a href="#services" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                {t('services')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* FEATURED PROJECT (pink) */}
          <div className="bento-card md:col-span-2 lg:col-span-5 p-8 text-white flex flex-col justify-between min-h-[220px] group cursor-pointer animate-slide-up"
            style={{ animationDelay: '.4s', background: 'var(--hero-gradient)' }}>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-56 h-56 bg-black/10 rounded-full group-hover:scale-110 transition-transform duration-700" />
            <div className="flex justify-between items-start relative">
              <div className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm text-xs font-medium">
                {t('recent_projects')}
              </div>
              <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {featured?.title || 'My Satoshis'}
              </h2>
              <p className="mt-2 text-sm opacity-85 line-clamp-2">
                {featured ? getLocalizedField(featured.description, lang) : 'Bitcoin education & Lightning tools built for Burundi and beyond.'}
              </p>
            </div>
            {featured?.project_url && (
              <a href={featured.project_url} target="_blank" rel="noopener noreferrer"
                className="absolute inset-0" aria-label={featured.title} />
            )}
          </div>

          {/* ABOUT CARD */}
          <div id="about" className="bento-card md:col-span-2 lg:col-span-7 p-6 md:p-8 animate-slide-up" style={{ animationDelay: '.48s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">{t('about_me')}</span>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
            </div>
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
              {about}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Bitcoin', 'Lightning', 'React', 'Node.js', 'WordPress', 'SEO'].map(tag => (
                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
