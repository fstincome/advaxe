import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, LANGUAGES, Lang } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useVisitors, useActivityLogs, useClickTracking } from '@/hooks/useAnalytics';
import { useExperiences, useSkills, useServices, useProjects, useSiteContent, usePersonalInfo, useSocialLinks } from '@/hooks/usePortfolioData';
import { LogOut, Sun, Moon, Globe, Users, Activity, MousePointer, BarChart3, Settings, Plus, Trash2, Save, Home, Menu, LayoutGrid } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import CollectionManager from '@/components/admin/CollectionManager';
import MessagesInbox from '@/components/admin/MessagesInbox';
import MediaLibrary from '@/components/admin/MediaLibrary';
import MediaPicker from '@/components/admin/MediaPicker';
import { CMS_MODULES } from '@/components/admin/cmsModules';

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { dark, toggle } = useTheme();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>('analytics');
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { data: visitors } = useVisitors();
  const { data: activityLogs } = useActivityLogs();
  const { data: clicks } = useClickTracking();
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();
  const { data: services } = useServices();
  const { data: projects } = useProjects();
  const { data: content } = useSiteContent();
  const { data: personalInfo } = usePersonalInfo();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/auth');
      else setUser(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate('/auth');
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Analytics computations
  const countryStats = visitors?.reduce((acc: Record<string, number>, v) => {
    acc[v.country || 'Unknown'] = (acc[v.country || 'Unknown'] || 0) + 1;
    return acc;
  }, {}) || {};

  const continentStats = visitors?.reduce((acc: Record<string, number>, v) => {
    acc[v.continent || 'Unknown'] = (acc[v.continent || 'Unknown'] || 0) + 1;
    return acc;
  }, {}) || {};

  const sortedCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]);
  const sortedContinents = Object.entries(continentStats).sort((a, b) => b[1] - a[1]);

  const tabs = [
    { key: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
    { key: 'content' as const, icon: Settings, label: t('content_mgmt') },
    { key: 'experiences' as const, icon: Activity, label: t('experience') },
    { key: 'skills' as const, icon: BarChart3, label: t('skills') },
    { key: 'services' as const, icon: Settings, label: t('services') },
    { key: 'projects' as const, icon: MousePointer, label: t('projects') },
    ...CMS_MODULES.map((module) => ({ key: module.key, icon: Settings, label: module.label })),
    { key: 'files', icon: Settings, label: 'Fichiers' },
    { key: 'messages', icon: Activity, label: 'Messages' },
  ];

  if (!user) return null;

  const activeLabel = tabs.find((item) => item.key === tab)?.label ?? '';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left admin menu */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border bg-card transition-all duration-200`}>
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <LayoutGrid className="w-5 h-5 text-primary shrink-0" />
          {!collapsed && <span className="font-semibold text-sm truncate">Advaxe Admin</span>}
        </div>
        <nav className="py-2">
          {tabs.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setTab(key)} title={label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors border-l-2 ${tab === key ? 'border-primary bg-secondary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-secondary" aria-label="Menu">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold truncate">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="hidden sm:flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg hover:bg-secondary"><Home className="w-3 h-3" /> Site</a>
            <div className="flex gap-1">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  className={`lang-badge ${lang === l.code ? 'lang-badge-active' : ''}`}>
                  {l.flag}
                </button>
              ))}
            </div>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-secondary">
              {dark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-secondary text-destructive">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 px-4 py-6">


        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{t('visitors')}</h3>
                </div>
                <p className="text-3xl font-bold">{visitors?.length || 0}</p>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{t('activity')}</h3>
                </div>
                <p className="text-3xl font-bold">{activityLogs?.length || 0}</p>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-2">
                  <MousePointer className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{t('clicks')}</h3>
                </div>
                <p className="text-3xl font-bold">{clicks?.length || 0}</p>
              </div>
            </div>

            {/* Visitors by country & continent */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <h3 className="font-semibold mb-4">{t('visitors')} par pays</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sortedCountries.map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between text-sm">
                      <span>{country}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(count / (visitors?.length || 1)) * 100}%` }} />
                        </div>
                        <span className="text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  {sortedCountries.length === 0 && <p className="text-muted-foreground text-sm">Aucun visiteur encore</p>}
                </div>
              </div>
              <div className="dashboard-card">
                <h3 className="font-semibold mb-4">{t('visitors')} par continent</h3>
                <div className="space-y-2">
                  {sortedContinents.map(([continent, count]) => (
                    <div key={continent} className="flex items-center justify-between text-sm">
                      <span>{continent}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(count / (visitors?.length || 1)) * 100}%` }} />
                        </div>
                        <span className="text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  {sortedContinents.length === 0 && <p className="text-muted-foreground text-sm">Aucun visiteur encore</p>}
                </div>
              </div>
            </div>

            {/* Activity logs */}
            <div className="dashboard-card">
              <h3 className="font-semibold mb-4">{t('activity')} Logs</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {activityLogs?.map(log => (
                  <div key={log.id} className="flex items-center justify-between text-sm border-b border-border pb-2">
                    <div>
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground ml-2">[{log.category}]</span>
                    </div>
                    <span className="text-muted-foreground text-xs">{new Date(log.created_at!).toLocaleString()}</span>
                  </div>
                ))}
                {(!activityLogs || activityLogs.length === 0) && <p className="text-muted-foreground text-sm">Aucune activité</p>}
              </div>
            </div>

            {/* Click tracking */}
            <div className="dashboard-card">
              <h3 className="font-semibold mb-4">{t('clicks')} tracking</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clicks?.map(click => (
                  <div key={click.id} className="flex items-center justify-between text-sm border-b border-border pb-2">
                    <span className="font-medium">{click.element}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{click.page}</span>
                      <span className="text-muted-foreground text-xs">{new Date(click.created_at!).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {(!clicks || clicks.length === 0) && <p className="text-muted-foreground text-sm">Aucun clic enregistré</p>}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {tab === 'content' && <ContentEditor lang={lang} content={content} personalInfo={personalInfo} queryClient={queryClient} t={t} />}

        {/* Experiences Tab */}
        {tab === 'experiences' && <ExperiencesEditor lang={lang} experiences={experiences} queryClient={queryClient} t={t} />}

        {/* Skills Tab */}
        {tab === 'skills' && <SkillsEditor skills={skills} queryClient={queryClient} t={t} />}

        {/* Services Tab */}
        {tab === 'services' && <ServicesEditor lang={lang} services={services} queryClient={queryClient} t={t} />}

        {/* Projects Tab */}
        {tab === 'projects' && <ProjectsEditor projects={projects} queryClient={queryClient} t={t} lang={lang} />}

        {tab === 'files' && <MediaLibrary />}

        {tab === 'messages' && <MessagesInbox />}

        {CMS_MODULES.filter((module) => module.key === tab).map((module) => (
          <CollectionManager key={module.key} table={module.table} entityType={module.entityType} title={module.title}
            baseFields={module.baseFields} translatedFields={module.translatedFields} defaults={module.defaults}
            orderBy={module.orderBy} ascending={module.ascending} />
        ))}
        </div>
      </div>
    </div>
  );
};

// Content Editor
const ContentEditor = ({ lang, content, personalInfo, queryClient, t }: any) => {
  const [aboutText, setAboutText] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [infoForm, setInfoForm] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setAboutText(content?.about || '');
    setHeroSubtitle(content?.hero_subtitle || '');
    setInfoForm(personalInfo || {});
  }, [content, personalInfo, lang]);

  const saveContent = async (key: string, value: string) => {
    await supabase.from('site_content').upsert({ section_key: key, lang, content: value }, { onConflict: 'section_key,lang' });
    queryClient.invalidateQueries({ queryKey: ['site_content'] });
  };

  const saveInfo = async (key: string, value: string) => {
    await supabase.from('personal_info').upsert({ info_key: key, value }, { onConflict: 'info_key' });
    queryClient.invalidateQueries({ queryKey: ['personal_info'] });
  };

  const infoFields = ['name', 'birthday', 'degree', 'experience', 'phone', 'email', 'address', 'freelance', 'photo_url'];

  return (
    <div className="space-y-6">
      <div className="dashboard-card">
        <h3 className="font-semibold mb-4">Hero Subtitle ({lang.toUpperCase()})</h3>
        <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} rows={2}
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none" />
        <button onClick={() => saveContent('hero_subtitle', heroSubtitle)} className="btn-primary mt-2 text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> {t('save')}
        </button>
      </div>

      <div className="dashboard-card">
        <h3 className="font-semibold mb-4">{t('about_me')} ({lang.toUpperCase()})</h3>
        <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={6}
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none" />
        <button onClick={() => saveContent('about', aboutText)} className="btn-primary mt-2 text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> {t('save')}
        </button>
      </div>

      <div className="dashboard-card">
        <h3 className="font-semibold mb-4">Informations personnelles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {infoFields.map(key => (
            <div key={key}>
              <label className="text-sm text-muted-foreground capitalize">{key.replace('_', ' ')}</label>
              {key.endsWith('_url') ? (
                <div className="mt-1"><MediaPicker value={infoForm[key] || ''} onChange={(url) => setInfoForm({ ...infoForm, [key]: url })} /></div>
              ) : (
                <input value={infoForm[key] || ''} onChange={e => setInfoForm({ ...infoForm, [key]: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none mt-1" />
              )}
              <button onClick={() => saveInfo(key, infoForm[key] || '')} className="text-xs text-primary mt-1 hover:underline">{t('save')}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Experiences Editor
const ExperiencesEditor = ({ lang, experiences, queryClient, t }: any) => {
  const [items, setItems] = useState<any[]>([]);

  const yearOf = (item: any) => {
    const years = `${item?.start_date ?? ''} ${item?.period ?? ''}`.match(/\d{4}/g);
    return years?.length ? Math.max(...years.map(Number)) : 0;
  };

  React.useEffect(() => {
    setItems([...(experiences || [])].sort((a, b) => yearOf(b) - yearOf(a)));
  }, [experiences]);

  const save = async (item: any) => {
    if (item.id && !item.id.startsWith('new-')) {
      await supabase.from('experiences').update({
        title: item.title, company: item.company, company_url: item.company_url,
        period: item.period, description: item.description, sort_order: item.sort_order, logo_url: item.logo_url
      }).eq('id', item.id);
    } else {
      const { id, ...rest } = item;
      await supabase.from('experiences').insert(rest);
    }
    queryClient.invalidateQueries({ queryKey: ['experiences'] });
  };

  const remove = async (id: string) => {
    await supabase.from('experiences').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['experiences'] });
  };

  const addNew = () => {
    setItems([...items, { id: `new-${Date.now()}`, title: {}, company: '', period: '', description: {}, sort_order: items.length }]);
  };

  const update = (index: number, field: string, value: any) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: value };
    setItems(copy);
  };

  const updateLocalized = (index: number, field: string, value: string) => {
    const copy = [...items];
    const existing = typeof copy[index][field] === 'object' ? copy[index][field] : {};
    copy[index] = { ...copy[index], [field]: { ...existing, [lang]: value } };
    setItems(copy);
  };

  return (
    <div className="space-y-4">
      <button onClick={addNew} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t('add')}</button>
      {items.map((item, i) => (
        <div key={item.id} className="dashboard-card space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Title ({lang})</label>
              <input value={(typeof item.title === 'object' ? item.title[lang] : item.title) || ''}
                onChange={e => updateLocalized(i, 'title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Company</label>
              <input value={item.company || ''} onChange={e => update(i, 'company', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Period</label>
              <input value={item.period || ''} onChange={e => update(i, 'period', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">URL</label>
              <input value={item.company_url || ''} onChange={e => update(i, 'company_url', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Logo</label>
              <MediaPicker value={item.logo_url || ''} onChange={(url) => update(i, 'logo_url', url)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description ({lang})</label>
            <textarea value={(typeof item.description === 'object' ? item.description[lang] : item.description) || ''}
              onChange={e => updateLocalized(i, 'description', e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => save(item)} className="btn-primary text-xs flex items-center gap-1"><Save className="w-3 h-3" /> {t('save')}</button>
            <button onClick={() => (item.id.startsWith?.('new-') ? setItems(items.filter((_, index) => index !== i)) : remove(item.id))} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> {t('delete')}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skills Editor
const SkillsEditor = ({ skills, queryClient, t }: any) => {
  const [items, setItems] = useState<any[]>([]);
  React.useEffect(() => { setItems(skills || []); }, [skills]);

  const save = async (item: any) => {
    if (item.id && !item.id.startsWith('new-')) {
      await supabase.from('skills').update({ name: item.name, percentage: item.percentage, sort_order: item.sort_order }).eq('id', item.id);
    } else {
      const { id, ...rest } = item;
      await supabase.from('skills').insert(rest);
    }
    queryClient.invalidateQueries({ queryKey: ['skills'] });
  };

  const remove = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['skills'] });
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setItems([...items, { id: `new-${Date.now()}`, name: '', percentage: 50, sort_order: items.length }])}
        className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t('add')}</button>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="dashboard-card flex items-center gap-3">
            <input value={item.name} onChange={e => { const c = [...items]; c[i] = { ...c[i], name: e.target.value }; setItems(c); }}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" placeholder="Skill name" />
            <input type="number" min={0} max={100} value={item.percentage}
              onChange={e => { const c = [...items]; c[i] = { ...c[i], percentage: parseInt(e.target.value) || 0 }; setItems(c); }}
              className="w-16 px-2 py-2 rounded-lg bg-secondary border border-border text-sm outline-none text-center" />
            <span className="text-xs text-muted-foreground">%</span>
            <button onClick={() => save(item)} className="text-primary hover:underline text-xs">{t('save')}</button>
            {!item.id.startsWith?.('new-') && (
              <button onClick={() => remove(item.id)} className="text-destructive text-xs"><Trash2 className="w-3 h-3" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Services Editor
const ServicesEditor = ({ lang, services, queryClient, t }: any) => {
  const [items, setItems] = useState<any[]>([]);
  React.useEffect(() => { setItems(services || []); }, [services]);

  const save = async (item: any) => {
    if (item.id && !item.id.startsWith('new-')) {
      await supabase.from('services').update({ title: item.title, description: item.description, icon: item.icon, sort_order: item.sort_order }).eq('id', item.id);
    } else {
      const { id, ...rest } = item;
      await supabase.from('services').insert(rest);
    }
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const remove = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const update = (index: number, field: string, value: string) => {
    const copy = [...items];
    const existing = typeof copy[index][field] === 'object' ? copy[index][field] : {};
    copy[index] = { ...copy[index], [field]: { ...existing, [lang]: value } };
    setItems(copy);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setItems([...items, { id: `new-${Date.now()}`, title: {}, description: {}, icon: 'code', sort_order: items.length }])}
        className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t('add')}</button>
      {items.map((item, i) => (
        <div key={item.id} className="dashboard-card space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Title ({lang})</label>
              <input value={(typeof item.title === 'object' ? item.title[lang] : '') || ''}
                onChange={e => update(i, 'title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Icon (code, bitcoin, layout, lightbulb)</label>
              <input value={item.icon || ''} onChange={e => { const c = [...items]; c[i] = { ...c[i], icon: e.target.value }; setItems(c); }}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description ({lang})</label>
            <textarea value={(typeof item.description === 'object' ? item.description[lang] : '') || ''}
              onChange={e => update(i, 'description', e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => save(item)} className="btn-primary text-xs flex items-center gap-1"><Save className="w-3 h-3" /> {t('save')}</button>
            {!item.id.startsWith?.('new-') && (
              <button onClick={() => remove(item.id)} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> {t('delete')}</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Work / Projects Editor (full fields + per-language texts)
const PROJECT_TEXT_FIELDS: { name: string; label: string }[] = [
  { name: 'description', label: 'Description' },
  { name: 'problem', label: 'Problem' },
  { name: 'approach', label: 'Approach' },
  { name: 'impact', label: 'Impact' },
];

const ProjectsEditor = ({ projects, queryClient, t, lang }: any) => {
  const [items, setItems] = useState<any[]>([]);
  React.useEffect(() => { setItems(projects || []); }, [projects]);

  const patch = (i: number, changes: Record<string, unknown>) => {
    setItems((prev) => prev.map((item, index) => (index === i ? { ...item, ...changes } : item)));
  };

  const patchText = (i: number, field: string, value: string) => {
    setItems((prev) => prev.map((item, index) => {
      if (index !== i) return item;
      const current = item[field];
      const base = current && typeof current === 'object' ? current : (typeof current === 'string' && current ? { en: current } : {});
      return { ...item, [field]: { ...base, [lang]: value } };
    }));
  };

  const textValue = (item: any, field: string) => {
    const current = item[field];
    if (!current) return '';
    if (typeof current === 'string') return lang === 'en' ? current : '';
    return current[lang] || '';
  };

  const save = async (item: any) => {
    const payload: Record<string, unknown> = {
      slug: item.slug || null,
      title: item.title,
      category: item.category,
      status: item.status || 'published',
      featured: !!item.featured,
      sort_order: Number(item.sort_order) || 0,
      image_url: item.image_url || null,
      project_url: item.project_url || null,
      github_url: item.github_url || null,
      demo_url: item.demo_url || null,
      current_status: item.current_status || null,
      role: item.role || null,
      project_year: item.project_year ? Number(item.project_year) : null,
      description: item.description || null,
      problem: item.problem || null,
      approach: item.approach || null,
      impact: item.impact || null,
    };
    if (item.id && !String(item.id).startsWith('new-')) {
      await supabase.from('projects').update(payload).eq('id', item.id);
    } else {
      await supabase.from('projects').insert(payload as any);
    }
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const remove = async (item: any, i: number) => {
    if (String(item.id).startsWith('new-')) {
      setItems((prev) => prev.filter((_, index) => index !== i));
      return;
    }
    await supabase.from('projects').delete().eq('id', item.id);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none';

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Les textes (description, problème, approche, impact) sont enregistrés pour la langue sélectionnée en haut : <strong>{lang.toUpperCase()}</strong>.
      </p>
      <button onClick={() => setItems([...items, { id: `new-${Date.now()}`, slug: '', title: '', category: '', status: 'published', featured: false, sort_order: items.length }])}
        className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> {t('add')}</button>
      {items.map((item, i) => (
        <div key={item.id} className="dashboard-card space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground">Title
              <input value={item.title || ''} onChange={e => patch(i, { title: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Slug (URL)
              <input value={item.slug || ''} onChange={e => patch(i, { slug: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Category
              <input value={item.category || ''} onChange={e => patch(i, { category: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Role
              <input value={item.role || ''} onChange={e => patch(i, { role: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Current status
              <input value={item.current_status || ''} onChange={e => patch(i, { current_status: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Year
              <input type="number" value={item.project_year ?? ''} onChange={e => patch(i, { project_year: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Status (draft / published)
              <select value={item.status || 'published'} onChange={e => patch(i, { status: e.target.value })} className={inputClass}>
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select></label>
            <label className="text-xs text-muted-foreground">Order
              <input type="number" value={item.sort_order ?? 0} onChange={e => patch(i, { sort_order: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Project URL
              <input value={item.project_url || ''} onChange={e => patch(i, { project_url: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">GitHub URL
              <input value={item.github_url || ''} onChange={e => patch(i, { github_url: e.target.value })} className={inputClass} /></label>
            <label className="text-xs text-muted-foreground">Demo URL
              <input value={item.demo_url || ''} onChange={e => patch(i, { demo_url: e.target.value })} className={inputClass} /></label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground mt-5">
              <input type="checkbox" checked={!!item.featured} onChange={e => patch(i, { featured: e.target.checked })} />
              Featured (Selected work / accueil)
            </label>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Image</label>
            <MediaPicker value={item.image_url || ''} onChange={(url) => patch(i, { image_url: url })} />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {PROJECT_TEXT_FIELDS.map((field) => (
              <label key={field.name} className="text-xs text-muted-foreground">{field.label} ({lang.toUpperCase()})
                <textarea rows={3} value={textValue(item, field.name)} onChange={e => patchText(i, field.name, e.target.value)} className={inputClass} />
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => save(item)} className="btn-primary text-xs flex items-center gap-1"><Save className="w-3 h-3" /> {t('save')}</button>
            <button onClick={() => remove(item, i)} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> {t('delete')}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
