import React from 'react';
import { useExperiences } from '@/hooks/usePortfolioData';
import { getLocalizedField } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

const defaultExperiences = [
  { id: '1', title: { fr: 'Fondateur & CEO', en: 'Founder & CEO' }, company: 'My Satoshis', period: '2020', description: { fr: 'En tant que fondateur et CEO, Advaxe dirige la vision et la stratégie pour My Satoshis, se concentrant sur le développement d\'outils éducatifs dans l\'espace bitcoin.', en: 'As Founder and CEO, Advaxe leads the vision and strategy for My Satoshis, focusing on educational tools in the bitcoin space.' }, company_url: 'https://www.mysatoshis.bi/' },
  { id: '2', title: { fr: 'Directeur Général', en: 'Chief Executive Officer' }, company: 'LA TECH BURUNDI COMPANY', period: '2021', description: { fr: 'En tant que CEO, Advaxe conduit le leadership stratégique et l\'innovation, supervisant le développement commercial et les partenariats.', en: 'As CEO, Advaxe drives strategic leadership and innovation, overseeing business development and partnerships.' }, company_url: 'https://www.latechburundi.bi/' },
  { id: '3', title: { fr: 'Co-Fondateur & CTO', en: 'Co-Founder & CTO' }, company: 'Free Tech Institute', period: '2022', description: { fr: 'En tant que CTO et co-fondateur, il gère les opérations d\'équipe, supervise le développement web et dirige les stratégies de médias sociaux.', en: 'As CTO and Co-Founder, He manages team operations, oversees website development, and directs social media strategies.' }, company_url: 'https://freeti.org/' },
  { id: '4', title: { fr: 'Marketing et Communications Grands Lacs', en: 'Great Lakes Marketing and Communications' }, company: 'African Students for Liberty', period: '2023', description: { fr: 'Conception graphique, gestion des réseaux sociaux et organisation de réunions virtuelles.', en: 'Designing graphics and posters, managing social media, and organizing virtual meetings.' }, company_url: null },
  { id: '5', title: { fr: 'IT Manager', en: 'IT Manager' }, company: 'EDI Burundi', period: '2024', description: { fr: 'Responsable de la création et gestion de sites web, planification stratégique et formation du personnel.', en: 'Responsible for website creation and management, strategic planning, and organizing training sessions.' }, company_url: null },
  { id: '6', title: { fr: 'Directeur Technique', en: 'Technical Director and IT Manager' }, company: 'Institute for Economics and Enterprises', period: '2025', description: { fr: 'Création et gestion du site web, planification stratégique et collective, documentation et manuels de formation.', en: 'Creation and management of the website, planning of strategic and collective plans, data visualization and documentation.' }, company_url: null },
];

const ExperienceSection = () => {
  const { lang, t } = useLanguage();
  const { data: experiences } = useExperiences();

  const displayExps = experiences && experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <section id="experience">
      <div className="section-container">
        <h2 className="section-title">{t('experience')}</h2>
        <div className="w-16 h-1 rounded-full bg-primary mb-12" />

        <div className="relative border-l-2 border-primary/30 ml-4 space-y-10">
          {displayExps.map((exp) => (
            <div key={exp.id} className="relative pl-8">
              <div className="timeline-dot top-1" />
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg">{getLocalizedField(exp.title, lang)}</h3>
                <p className="text-primary text-sm font-medium mt-1">
                  {exp.company_url ? (
                    <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {exp.company}
                    </a>
                  ) : exp.company}
                  {' | '}{exp.period}
                </p>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                  {getLocalizedField(exp.description, lang)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
