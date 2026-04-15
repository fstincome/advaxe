import React, { useEffect } from 'react';
import { MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { usePersonalInfo, useSiteContent, useSocialLinks } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

const ICON_MAP: Record<string, any> = {
  twitter: Twitter, facebook: Facebook, linkedin: Linkedin,
  instagram: Instagram, youtube: Youtube,
};

const HeroSection = () => {
  const { t } = useLanguage();
  const { data: info } = usePersonalInfo();
  const { data: content } = useSiteContent();
  const { data: socials } = useSocialLinks();

  const name = info?.name || 'Advaxe Ndayisènga';
  const subtitle = content?.hero_subtitle || 'Software Engineer | Bitcoin Developer | Tech Innovator';

  return (
    <section className="min-h-screen flex items-center pt-16" id="hero">
      <div className="section-container w-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
              <img
                src={info?.photo_url || 'https://advaxe.latechburundi.bi/pics/hero.png'}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-6 text-center">{name}</h1>
            <p className="gradient-text text-lg font-medium mt-2 text-center">{subtitle}</p>

            <div className="flex gap-3 mt-4">
              {socials?.map(s => {
                const Icon = ICON_MAP[s.platform.toLowerCase()] || Mail;
                return (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            <div className="flex gap-3 mt-4">
              <a href={`https://wa.me/${info?.phone?.replace(/\s/g, '').replace('+', '')}`}
                className="btn-primary flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" /> {t('whatsapp')}
              </a>
              <a href="#contact" className="btn-outline text-sm">{t('contact_me')}</a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="section-title">{t('about_me')}</h2>
              <div className="w-16 h-1 rounded-full bg-primary mb-6" />
              <p className="text-muted-foreground leading-relaxed">
                {content?.about || 'Advaxe Ndayisenga is a seasoned Burundian developer holding a Bachelor\'s degree in Computer Science from the East African Leadership Institute. With over five years of experience in web and software development, he specializes in Lightning development, WordPress, Prestashop, social media marketing, and SEO audits.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'name_label', val: info?.name || 'Advaxe Ndayisènga' },
                { key: 'birthday', val: info?.birthday || '5 April 1998' },
                { key: 'degree', val: info?.degree || 'Bachelor' },
                { key: 'experience_label', val: info?.experience || '5 Years' },
                { key: 'phone', val: info?.phone || '+257 69 89 89 47' },
                { key: 'email', val: info?.email || 'advaxe@latechburundi.bi' },
                { key: 'address', val: info?.address || 'Gitega-Burundi' },
                { key: 'freelance', val: info?.freelance || t('available') },
              ].map(item => (
                <div key={item.key} className="flex flex-col">
                  <span className="text-primary font-semibold text-sm">{t(item.key)}:</span>
                  <span className="text-foreground text-sm">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
