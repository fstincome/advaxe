import { ArrowRight, BookOpen, Code2, DraftingCompass, Github, GraduationCap, Network, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedField, useExperiences, usePersonalInfo, useProjects, useSiteContent } from '@/hooks/usePortfolioData';
import { useExpertise } from '@/hooks/useProfessionalContent';

const dimensions = [
  { label: 'Build', icon: Code2 }, { label: 'Design', icon: DraftingCompass }, { label: 'Teach', icon: GraduationCap },
  { label: 'Contribute', icon: Github }, { label: 'Explore', icon: Network },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const { data: copy } = useSiteContent();
  const { data: info } = usePersonalInfo();
  const { data: projects } = useProjects();
  const { data: expertise } = useExpertise();
  const { data: experiences } = useExperiences();
  const text = (key: string, fallback: string) => copy?.[key] || fallback;
  const featured = (projects ?? []).filter((item) => item.featured || item.status === 'published').slice(0, 3);
  return <>
    <section className="hero-section">
      <div className="site-shell grid min-h-[calc(100svh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.25fr_.75fr]">
        <div className="max-w-4xl animate-slide-up">
          <p className="eyebrow">{text('hero_eyebrow', 'Software architect · Builder · Educator')}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">{text('hero_title', 'Building technology, open infrastructure and digital experiences for real-world impact.')}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">{text('hero_intro', 'I design and build software, Bitcoin infrastructure and learning systems across East Africa.')}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button size="lg" asChild><Link to={`/${lang}/work`}>{text('explore_work', 'Explore my work')}<ArrowRight /></Link></Button><Button size="lg" variant="outline" asChild><Link to={`/${lang}/about`}>{text('about_me_cta', 'About me')}</Link></Button></div>
        </div>
        <div className="relative mx-auto w-full max-w-md animate-fade-in">
          <div className="portrait-frame"><img src={info?.photo_url || '/advaxe-profile.jpeg'} alt="Advaxe Ndayisenga" className="h-full w-full object-cover" /></div>
          <div className="technical-note"><span className="status-dot" /> Gitega · East Africa<br /><span className="text-muted-foreground">Open infrastructure / Bitcoin / Web</span></div>
        </div>
        <div className="col-span-full grid grid-cols-2 border-y border-border sm:grid-cols-5">
          {dimensions.map(({ label, icon: Icon }) => <div key={label} className="dimension"><Icon /><span>{label}</span></div>)}
        </div>
      </div>
    </section>

    <section className="section-band"><div className="site-shell section-space">
      <div className="section-heading"><p className="eyebrow">01 / Expertise</p><h2>{text('expertise_title', 'Capabilities for meaningful systems')}</h2></div>
      <div className="expertise-grid">{expertise?.map((item, index) => <article className="expertise-item" key={item.id}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      <Button variant="link" asChild className="mt-8 px-0"><Link to={`/${lang}/expertise`}>View all capabilities <ArrowRight /></Link></Button>
    </div></section>

    <section><div className="site-shell section-space">
      <div className="section-heading"><p className="eyebrow">02 / Work</p><h2>{text('featured_work', 'Selected work')}</h2></div>
      <div className="work-grid">{featured.map((project, index) => <article key={project.id} className={`work-item ${index === 0 ? 'work-item-featured' : ''}`}>
        <div className="work-visual">{project.image_url ? <img src={project.image_url} alt={project.title} loading="lazy" /> : <Zap className="h-12 w-12 text-primary" />}</div>
        <div className="p-6"><p className="eyebrow">{project.category || 'Technology'}</p><h3 className="mt-3 text-2xl font-semibold">{project.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{getLocalizedField(project.description, lang)}</p><Link to={`/${lang}/work/${project.slug || project.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium">View case study <ArrowRight className="h-4 w-4" /></Link></div>
      </article>)}</div>
    </div></section>

    <section className="belief-band"><div className="site-shell grid gap-10 py-20 md:grid-cols-2 md:items-end"><div><p className="eyebrow">03 / Point of view</p><h2 className="mt-5 text-4xl font-semibold md:text-5xl">{text('principle_title', 'Technology should expand agency.')}</h2></div><p className="text-lg leading-8 text-muted-foreground">{text('principle_body', 'The strongest systems are understandable, locally useful and built to last beyond a launch.')}</p></div></section>

    <section><div className="site-shell section-space"><div className="section-heading"><p className="eyebrow">04 / Journey</p><h2>Building since 2020</h2></div><div className="journey-line">{experiences?.slice(0,6).map((experience) => <div key={experience.id} className="journey-point"><span>{experience.period}</span><strong>{experience.company}</strong><small>{getLocalizedField(experience.title, lang)}</small></div>)}</div><Button variant="outline" asChild className="mt-10"><Link to={`/${lang}/experience`}>Explore the journey <ArrowRight /></Link></Button></div></section>

    <section className="contact-cta"><div className="site-shell py-20 text-center"><BookOpen className="mx-auto h-8 w-8 text-primary" /><h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold md:text-6xl">{text('contact_title', 'Let’s build something meaningful.')}</h2><p className="mx-auto mt-5 max-w-xl text-muted-foreground">{text('contact_intro', 'For product work, partnerships, speaking, training, open source or Bitcoin and Lightning initiatives.')}</p><Button size="lg" asChild className="mt-8"><Link to={`/${lang}/contact`}>Start a conversation <ArrowRight /></Link></Button></div></section>
  </>;
}