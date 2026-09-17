import { useState } from 'react';
import { ArrowRight, BookOpen, Download, ExternalLink, FileText, Mic2, Network, PlayCircle, ScrollText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedField, useExperiences, useProjects, useSiteContent } from '@/hooks/usePortfolioData';
import { useArticles, useExpertise, useProfessionalCollections } from '@/hooks/useProfessionalContent';

const labels: Record<string, { eyebrow: string; title: string; intro: string }> = {
  about: { eyebrow: 'Identity & direction', title: 'A builder shaped by East Africa.', intro: 'Software engineering, open monetary infrastructure and practical education are different expressions of the same commitment: expanding what people and communities can build for themselves.' },
  expertise: { eyebrow: 'Professional capabilities', title: 'From architecture to adoption.', intro: 'A systems-level practice spanning product thinking, full-stack engineering, Bitcoin and Lightning infrastructure, open source, and technical learning.' },
  work: { eyebrow: 'Selected systems & ventures', title: 'Technology built around real constraints.', intro: 'Products and infrastructure developed for education, financial access, institutions and communities.' },
  ideas: { eyebrow: 'Technology & ideas', title: 'Notes from building in public.', intro: 'Writing on software architecture, open infrastructure, Bitcoin, digital sovereignty and technology in Africa.' },
  experience: { eyebrow: 'Professional journey', title: 'A practice built year by year.', intro: 'Roles, organizations and initiatives that shaped a multidisciplinary technology career since 2020.' },
  speaking: { eyebrow: 'Speaking & teaching', title: 'Knowledge becomes useful when it moves.', intro: 'Talks, workshops, bootcamps and learning programs for developers, organizations and communities.' },
  community: { eyebrow: 'Community & contributions', title: 'Building ecosystems, not only products.', intro: 'Developer groups, Bitcoin education, mentorship and civic technology initiatives across the region.' },
  media: { eyebrow: 'Media', title: 'Conversations, interviews and field notes.', intro: 'Selected recordings, features, publications and moments from the work.' },
};

export default function EditorialPage({ type }: { type: keyof typeof labels }) {
  const { lang } = useLanguage();
  const { data: copy } = useSiteContent();
  const { data: expertise } = useExpertise();
  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: articles } = useArticles();
  const { data: collections } = useProfessionalCollections();
  const base = labels[type];
  const about = copy?.about;
  const render = () => {
    if (type === 'about') return <div className="editorial-copy"><p>{about || base.intro}</p><h2>Why I build</h2><p>I believe digital systems should be locally relevant, understandable and resilient. My work connects international engineering practice with the realities of communities and organizations in East Africa.</p><h2>Open money, practical agency</h2><p>Bitcoin and Lightning are not abstract technologies in this context. They are tools for financial inclusion, peer-to-peer exchange and infrastructure that communities can inspect, adapt and own.</p><h2>Currently exploring</h2><p>Interoperable payment infrastructure, developer education, resilient web architecture and the role of open protocols in African digital economies.</p></div>;
    if (type === 'expertise') return <div className="expertise-grid">{expertise?.map((item, index) => <article className="expertise-item" key={item.id}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
    if (type === 'work') return <div className="work-list">{projects?.map((item) => <article key={item.id} className="work-row"><div><p className="eyebrow">{item.category}</p><h2>{item.title}</h2><p>{getLocalizedField(item.description, lang)}</p></div><Button variant="outline" asChild><Link to={`/${lang}/work/${item.slug || item.id}`}>Case study <ArrowRight /></Link></Button></article>)}</div>;
    if (type === 'experience') return <div className="timeline">{experiences?.map((item) => <article key={item.id} className="timeline-row"><div className="timeline-year">{item.period}</div><div><p className="eyebrow">{item.company}</p><h2>{getLocalizedField(item.title, lang)}</h2><p>{getLocalizedField(item.description, lang)}</p></div></article>)}</div>;
    if (type === 'ideas') return articles?.length ? <div className="article-grid">{articles.map((item) => <article key={item.id} className="article-item"><BookOpen /><p className="eyebrow">{item.category}</p><h2>{item.title}</h2><p>{item.excerpt}</p><Link to={`/${lang}/ideas/${item.slug}`}>Read article <ArrowRight /></Link></article>)}</div> : <EmptyState icon={BookOpen} text="Long-form articles and technical field notes are being prepared." />;
    const collection = type === 'speaking' ? collections?.speaking : type === 'community' ? collections?.community : collections?.media;
    const Icon = type === 'speaking' ? Mic2 : type === 'community' ? Network : PlayCircle;
    return collection?.length ? <div className="article-grid">{collection.map((item: Record<string, unknown>) => <article className="article-item" key={String(item.id)}><Icon /><p className="eyebrow">{String(item.organization || item.publisher || item.event_type || '')}</p><h2>{String(item.role || item.slug || '')}</h2>{item.external_url ? <a href={String(item.external_url)} target="_blank" rel="noreferrer">Open resource <ExternalLink /></a> : null}</article>)}</div> : <EmptyState icon={Icon} text="Selected entries will appear here as they are published from the dashboard." />;
  };
  return <section className="page-section"><div className="site-shell"><header className="page-intro"><p className="eyebrow">{base.eyebrow}</p><h1>{base.title}</h1><p>{type === 'about' && about ? about.slice(0, 340) : base.intro}</p></header>{render()}</div></section>;
}

function EmptyState({ icon: Icon, text }: { icon: typeof BookOpen; text: string }) {
  return <div className="empty-state"><Icon /><p>{text}</p></div>;
}

export function WorkDetailPage() {
  const { slug } = useParams(); const { lang } = useLanguage(); const { data: projects } = useProjects();
  const project = projects?.find((item) => item.slug === slug || item.id === slug);
  if (!project) return <section className="page-section"><div className="site-shell"><div className="empty-state">Project not found.</div></div></section>;
  return <article className="page-section"><div className="site-shell"><header className="page-intro"><p className="eyebrow">{project.category} · {project.current_status || 'Published'}</p><h1>{project.title}</h1><p>{getLocalizedField(project.description, lang)}</p></header>{project.image_url && <img src={project.image_url} alt={project.title} className="case-image" />}<div className="case-grid"><section><p className="eyebrow">The problem</p><h2>Context and challenge</h2><p>{project.problem || getLocalizedField(project.description, lang)}</p></section><section><p className="eyebrow">The approach</p><h2>Building the system</h2><p>{project.approach || 'Product design, software engineering and practical delivery adapted to the local operating context.'}</p></section><section><p className="eyebrow">Impact</p><h2>What changed</h2><p>{project.impact || 'A focused digital system designed for real users, maintainability and long-term ownership.'}</p></section></div>{project.project_url && <Button asChild><a href={project.project_url} target="_blank" rel="noreferrer">Visit project <ExternalLink /></a></Button>}</div></article>;
}