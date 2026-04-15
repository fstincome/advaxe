import React from 'react';
import { Code, Bitcoin, Layout, Lightbulb } from 'lucide-react';
import { useServices } from '@/hooks/usePortfolioData';
import { getLocalizedField } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

const ICON_MAP: Record<string, any> = {
  code: Code, bitcoin: Bitcoin, layout: Layout, lightbulb: Lightbulb,
};

const defaultServices = [
  { id: '1', title: { fr: 'Ingénieur Logiciel', en: 'Software Engineer' }, description: { fr: 'Je conçois et développe des solutions logicielles robustes adaptées aux besoins des clients.', en: 'I design and develop robust software solutions tailored to client needs.' }, icon: 'code' },
  { id: '2', title: { fr: 'Développeur Bitcoin', en: 'Bitcoin Developer' }, description: { fr: 'Je suis spécialisé dans les applications blockchain sécurisées et évolutives.', en: 'I specialize in secure and scalable blockchain applications.' }, icon: 'bitcoin' },
  { id: '3', title: { fr: 'CMS Builder & SEO', en: 'CMS Builder & SEO audit' }, description: { fr: 'Je développe et personnalise des systèmes de gestion de contenu.', en: 'I develop and customize content management systems.' }, icon: 'layout' },
  { id: '4', title: { fr: 'Innovateur Tech', en: 'Tech Innovator' }, description: { fr: 'J\'explore et implémente des technologies de pointe pour l\'innovation.', en: 'I explore and implement cutting-edge technologies for innovation.' }, icon: 'lightbulb' },
];

const ServicesSection = () => {
  const { lang, t } = useLanguage();
  const { data: services } = useServices();

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="bg-secondary/30">
      <div className="section-container">
        <h2 className="section-title">{t('services')}</h2>
        <div className="w-16 h-1 rounded-full bg-primary mb-12" />

        <div className="grid md:grid-cols-2 gap-6">
          {displayServices.map(service => {
            const Icon = ICON_MAP[service.icon || 'code'] || Code;
            return (
              <div key={service.id} className="glass-card p-8 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3">{getLocalizedField(service.title, lang)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{getLocalizedField(service.description, lang)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
