import { useState } from 'react';
import { ArrowRight, Award, BookOpen, Code2, Download, ExternalLink, FileText, Mic2, Network, PlayCircle, ScrollText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedField, useExperiences, useProjects, useSiteContent } from '@/hooks/usePortfolioData';
import { useArticles, useCertifications, useExpertise, useProfessionalCollections, useProjectCategories } from '@/hooks/useProfessionalContent';
import { sanitizeRichText } from '@/lib/richText';

const labels: Record<string, { eyebrow: string; title: string; intro: string }> = {
  about: { eyebrow: 'Identity & direction', title: 'Engineering resilient systems for real-world impact.', intro: 'Software engineering, open monetary infrastructure and practical education are different expressions of the same commitment: expanding what people and communities can build for themselves.' },
  expertise: { eyebrow: 'Professional capabilities', title: 'From architecture to adoption.', intro: 'A systems-level practice spanning product thinking, full-stack engineering, Bitcoin and Lightning infrastructure, open source, and technical learning.' },
  work: { eyebrow: 'Selected systems & ventures', title: 'Technology built around real constraints.', intro: 'Products and infrastructure developed for education, financial access, institutions and communities.' },
  ideas: { eyebrow: 'Technology & ideas', title: 'Articles, studies and policy briefs.', intro: 'Analysis on software architecture, open infrastructure, Bitcoin, digital sovereignty and technology policy in Africa.' },
  experience: { eyebrow: 'Professional journey', title: 'A practice built year by year.', intro: 'Roles, organizations and initiatives that shaped a multidisciplinary technology career since 2020.' },
  speaking: { eyebrow: 'Speaking & teaching', title: 'Knowledge becomes useful when it moves.', intro: 'Talks, workshops, bootcamps and learning programs for developers, organizations and communities.' },
  community: { eyebrow: 'Community & contributions', title: 'Building ecosystems, not only products.', intro: 'Developer groups, Bitcoin education, mentorship and civic technology initiatives across the region.' },
  media: { eyebrow: 'Media', title: 'Conversations, interviews and field notes.', intro: 'Selected recordings, features, publications and moments from the work.' },
  credentials: { eyebrow: 'Certifications & skills', title: 'Verified training, proven practice.', intro: 'Degrees, certifications and core technical capabilities developed through engineering, open infrastructure and teaching work.' },
};

export const PUBLICATION_TYPES = [
  { key: 'all', label: 'All publications', icon: BookOpen },
  { key: 'article', label: 'Articles', icon: BookOpen },
  { key: 'study', label: 'Studies', icon: FileText },
  { key: 'policy_brief', label: 'Policy briefs', icon: ScrollText },
] as const;

export const publicationLabel = (value?: string | null) =>
  value === 'study' ? 'Study' : value === 'policy_brief' ? 'Policy brief' : 'Article';

const experienceYear = (item: any) => {
  const source = `${item?.start_date ?? ''} ${item?.period ?? ''}`;
  const years = source.match(/\d{4}/g);
  if (!years?.length) return 0;
  return Math.max(...years.map(Number));
};

export default function EditorialPage({ type }: { type: keyof typeof labels }) {
  const [publicationFilter, setPublicationFilter] = useState<string>('all');
  const { lang } = useLanguage();
  const { data: copy } = useSiteContent();
  const { data: expertise } = useExpertise();
  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();
  const { data: articles } = useArticles();
  const { data: collections } = useProfessionalCollections();
  const { data: credentials } = useCertifications();
  const { data: projectCategories } = useProjectCategories();
  const categoryName = (slug?: string | null) => {
    if (!slug) return '';
    const match = projectCategories?.find((category) => category.slug === slug);
    return (match?.name as string) || slug;
  };
  const base = labels[type];
  const about = copy?.about;
  const linkifyBio = (text: string) => {
    const links: Record<string, { href: string; className: string }> = {
      'Free Tech Institute': { href: 'https://www.freeti.org/', className: 'brand-link brand-link-freeti' },
      'SIGHT Africa': { href: 'https://www.sightnetwork.org/', className: 'brand-link brand-link-sight' },
      'BitLibera': { href: 'https://www.bitlibera.com/', className: 'brand-link brand-link-bitlibera' },
    };
    const terms = Object.keys(links).sort((a, b) => b.length - a.length);
    let parts: (string | { label: string; href: string; className: string })[] = [text];
    for (const term of terms) {
      const link = links[term];
      if (link) parts = parts.flatMap((part) => (typeof part === 'string' ? splitTerm(part, term, link.href, link.className) : [part]));
    }
    return parts.map((part, i) => typeof part === 'string' ? part : <a key={i} href={part.href} className={part.className} target="_blank" rel="noreferrer">{part.label}</a>);
  };
  const splitTerm = (text: string, term: string, href: string, className: string): (string | { label: string; href: string; className: string })[] => {
    const out: (string | { label: string; href: string; className: string })[] = [];
    let rest = text;
    let idx = rest.indexOf(term);
    while (idx !== -1) {
      if (idx > 0) out.push(rest.slice(0, idx));
      out.push({ label: term, href, className });
      rest = rest.slice(idx + term.length);
      idx = rest.indexOf(term);
    }
    if (rest) out.push(rest);
    return out;
  };
  const render = () => {
    if (type === 'about') {
      const bio = (about || base.intro) as string;
      const paragraphs = bio.split(/\n{2,}/).filter(Boolean);
      return <div className="about-layout"><figure className="about-portrait"><img src="/advaxe-profile.jpeg" alt="Advaxe Ndayisenga, software engineer and technology entrepreneur" loading="lazy" /><figcaption>Advaxe Ndayisenga, Gitega, Burundi</figcaption></figure><div className="editorial-copy">{paragraphs.length ? paragraphs.map((text, i) => <p key={i}>{linkifyBio(text)}</p>) : <p>{base.intro}</p>}</div></div>;
    }
    if (type === 'expertise') return <div className="expertise-grid">{expertise?.map((item, index) => <article className="expertise-item" key={item.id}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
    if (type === 'work') return <div className="work-list">{projects?.map((item) => <article key={item.id} className="work-row"><div><p className="eyebrow">{categoryName(item.category)}</p><h2>{item.title}</h2><p>{getLocalizedField(item.description, lang)}</p></div><Button variant="outline" asChild><Link to={`/${lang}/work/${item.slug || item.id}`}>Case study <ArrowRight /></Link></Button></article>)}</div>;
    if (type === 'experience') {
      const sorted = [...(experiences ?? [])].sort((a, b) => experienceYear(b) - experienceYear(a));
      return <div className="timeline">{sorted.map((item) => <article key={item.id} className="timeline-row"><div className="timeline-year">{item.period}</div><div><p className="eyebrow">{item.company}</p><h2>{getLocalizedField(item.title, lang)}</h2><p>{getLocalizedField(item.description, lang)}</p></div></article>)}</div>;
    }
    if (type === 'ideas') {
      const filtered = (articles ?? []).filter((item) => publicationFilter === 'all' || (item.publication_type ?? 'article') === publicationFilter);
      return (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {PUBLICATION_TYPES.map(({ key, label }) => (
              <button key={key} onClick={() => setPublicationFilter(key)}
                className={`pill-tab ${publicationFilter === key ? 'pill-tab-active' : ''}`}>{label}</button>
            ))}
          </div>
          {filtered.length ? (
            <div className="article-grid">
              {filtered.map((item) => {
                const Icon = (item.publication_type ?? 'article') === 'study' ? FileText : (item.publication_type === 'policy_brief' ? ScrollText : BookOpen);
                return (
                  <article key={item.id} className="article-item">
                    <Icon />
                    <p className="eyebrow">{publicationLabel(item.publication_type)}{item.category ? ` · ${item.category}` : ''}</p>
                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>
                    <Button size="sm" asChild className="mt-2"><Link to={`/${lang}/ideas/${item.slug}`}>Read <ArrowRight /></Link></Button>
                  </article>
                );
              })}
            </div>
          ) : <EmptyState icon={BookOpen} text="Articles, studies and policy briefs will appear here as they are published." />}
        </div>
      );
    }
    if (type === 'credentials') {
      const groups = [
        { key: 'certification', label: 'Certifications & education', icon: Award },
        { key: 'skill', label: 'Core skills', icon: Code2 },
      ] as const;
      if (!credentials?.length) return <EmptyState icon={Award} text="Certifications and skills will appear here once added from the dashboard." />;
      return <div className="space-y-12">{groups.map(({ key, label, icon: GroupIcon }) => {
        const items = credentials.filter((item) => (item.entry_type ?? 'certification') === key);
        if (!items.length) return null;
        return <section key={key} className="space-y-6">
          <h2 className="section-heading">{label}</h2>
          <div className="article-grid">{items.map((item) => <article key={item.id} className="article-item">
            <GroupIcon />
            <p className="eyebrow">{[item.issuer, item.category, item.level].filter(Boolean).join(' · ')}</p>
            <h3>{item.title || item.slug}</h3>
            {item.description ? <p>{item.description}</p> : null}
            {item.issue_date ? <p className="text-sm text-muted-foreground">{new Date(item.issue_date).getFullYear()}</p> : null}
            {item.credential_url ? <a href={String(item.credential_url)} target="_blank" rel="noreferrer">View credential <ExternalLink /></a> : null}
          </article>)}</div>
        </section>;
      })}</div>;
    }
    const collection = type === 'speaking' ? collections?.speaking : type === 'community' ? collections?.community : collections?.media;
    const Icon = type === 'speaking' ? Mic2 : type === 'community' ? Network : PlayCircle;
    return collection?.length ? <div className="article-grid">{collection.map((item: Record<string, unknown>) => <article className="article-item" key={String(item.id)}><Icon /><p className="eyebrow">{String(item.organization || item.publisher || item.event_type || '')}</p><h2>{String(item.role || item.slug || '')}</h2>{item.external_url ? <a href={String(item.external_url)} target="_blank" rel="noreferrer">Open resource <ExternalLink /></a> : null}</article>)}</div> : <EmptyState icon={Icon} text="Selected entries will appear here as they are published from the dashboard." />;
  };
  return <section className="page-section"><div className="site-shell"><header className="page-intro"><p className="eyebrow">{base.eyebrow}</p><h1>{base.title}</h1><p>{base.intro}</p></header>{render()}</div></section>;
}

function EmptyState({ icon: Icon, text }: { icon: typeof BookOpen; text: string }) {
  return <div className="empty-state"><Icon /><p>{text}</p></div>;
}

export function WorkDetailPage() {
  const { slug } = useParams(); const { lang } = useLanguage(); const { data: projects } = useProjects();
  const { data: projectCategories } = useProjectCategories();
  const project = projects?.find((item) => item.slug === slug || item.id === slug);
  if (!project) return <section className="page-section"><div className="site-shell"><div className="empty-state">Project not found.</div></div></section>;
  const category = projectCategories?.find((entry) => entry.slug === project.category)?.name || project.category;
  return <article className="page-section"><div className="site-shell"><header className="page-intro"><p className="eyebrow">{category} · {project.current_status || 'Published'}</p><h1>{project.title}</h1><p>{getLocalizedField(project.description, lang)}</p></header>{project.image_url && <img src={project.image_url} alt={project.title} className="case-image" />}<div className="case-grid"><section><p className="eyebrow">The problem</p><h2>Context and challenge</h2><p>{getLocalizedField(project.problem, lang) || getLocalizedField(project.description, lang)}</p></section><section><p className="eyebrow">The approach</p><h2>Building the system</h2><p>{getLocalizedField(project.approach, lang) || 'Product design, software engineering and practical delivery adapted to the local operating context.'}</p></section><section><p className="eyebrow">Impact</p><h2>What changed</h2><p>{getLocalizedField(project.impact, lang) || 'A focused digital system designed for real users, maintainability and long-term ownership.'}</p></section></div>{project.project_url && <Button asChild><a href={project.project_url} target="_blank" rel="noreferrer">Visit project <ExternalLink /></a></Button>}</div></article>;
}
export function ArticleDetailPage() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const { data: articles } = useArticles();
  const item = articles?.find((entry) => entry.slug === slug || entry.id === slug);
  if (!item) return <section className="page-section"><div className="site-shell"><div className="empty-state">Publication not found.</div></div></section>;
  const content = String(item.content ?? item.excerpt ?? '');
  return (
    <article className="page-section">
      <div className="site-shell">
        <header className="page-intro">
          <p className="eyebrow">{publicationLabel(item.publication_type)}{item.category ? ` · ${item.category}` : ''}{item.published_at ? ` · ${new Date(item.published_at).toLocaleDateString(lang)}` : ''}</p>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
        </header>
        {item.cover_image_url && <img src={item.cover_image_url} alt={String(item.title ?? 'Publication')} loading="lazy" className="case-image" />}
        {content ? (
          <div className="editorial-copy" dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }} />
        ) : <div className="editorial-copy"><p>This publication is being prepared.</p></div>}
        <div className="flex flex-wrap gap-4 pt-6">
          {item.document_url && (
            <Button asChild><a href={String(item.document_url)} target="_blank" rel="noreferrer">Download the full document <Download /></a></Button>
          )}
          <Button variant="outline" asChild><Link to={`/${lang}/ideas`}>Back to publications</Link></Button>
        </div>
      </div>
    </article>
  );
}
