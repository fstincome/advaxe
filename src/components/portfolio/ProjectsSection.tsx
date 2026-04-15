import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useProjects, getLocalizedField } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectsSection = () => {
  const { lang, t } = useLanguage();
  const { data: projects } = useProjects();
  const [filter, setFilter] = useState('all');

  const displayProjects = projects || [];
  const categories = ['all', ...new Set(displayProjects.map(p => p.category).filter(Boolean))];
  const filtered = filter === 'all' ? displayProjects : displayProjects.filter(p => p.category === filter);

  return (
    <section id="projects">
      <div className="section-container">
        <h2 className="section-title">{t('recent_projects')}</h2>
        <div className="w-16 h-1 rounded-full bg-primary mb-8" />

        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
              {cat === 'all' ? t('all') : cat === 'bitcoin' ? 'Bitcoin' : 'Tech'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="glass-card overflow-hidden group">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={project.image_url || '/placeholder.svg'} alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{getLocalizedField(project.description, lang)}</p>
                {project.project_url && (
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
