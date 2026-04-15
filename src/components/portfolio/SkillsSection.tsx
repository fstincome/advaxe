import React, { useEffect, useRef } from 'react';
import { useSkills } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

const SkillsSection = () => {
  const { t } = useLanguage();
  const { data: skills } = useSkills();
  const ref = useRef<HTMLDivElement>(null);

  const defaultSkills = [
    { name: 'PHP', percentage: 95 }, { name: 'NODE JS', percentage: 85 },
    { name: 'React JS, Next.js', percentage: 90 }, { name: 'Kotlin', percentage: 75 },
    { name: 'Rust', percentage: 30 }, { name: 'MySQL', percentage: 95 },
    { name: 'WordPress', percentage: 85 }, { name: 'Adobe (Graphisme)', percentage: 80 },
  ];

  const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;

  return (
    <section id="skills" className="bg-secondary/30">
      <div className="section-container">
        <h2 className="section-title">{t('skills')}</h2>
        <div className="w-16 h-1 rounded-full bg-primary mb-12" />

        <div ref={ref} className="grid md:grid-cols-2 gap-6">
          {displaySkills.map((skill, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{skill.name}</span>
                <span className="text-primary font-semibold text-sm">{skill.percentage}%</span>
              </div>
              <div className="skill-bar">
                <div className="skill-bar-fill" style={{ width: `${skill.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
