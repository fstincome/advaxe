import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Eye, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LANGUAGES, Lang } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import MediaPicker from './MediaPicker';

const client = supabase as any;
type Row = Record<string, any>;

const TRANSLATED_FIELDS = ['title', 'excerpt', 'content'] as const;
const TYPE_LABELS: Record<string, string> = {
  article: 'Article',
  study: 'Study',
  policy_brief: 'Policy brief',
};

const slugify = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const emptyTranslations = (): Record<Lang, Record<string, string>> => ({
  en: {}, fr: {}, sw: {}, rn: {},
});

const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ArticlesManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [translations, setTranslations] = useState<Record<Lang, Record<string, string>>>(emptyTranslations());
  const [lang, setLang] = useState<Lang>('en');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'articles'],
    queryFn: async () => {
      const { data: items, error } = await client.from('articles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const ids = (items ?? []).map((item: Row) => item.id);
      let translationRows: Row[] = [];
      if (ids.length) {
        const { data: tr } = await client.from('content_translations')
          .select('entity_id,field_name,value,lang').eq('entity_type', 'article').in('entity_id', ids);
        translationRows = tr ?? [];
      }
      return { items: (items ?? []) as Row[], translationRows };
    },
  });

  const rows = data?.items ?? [];

  const titlesByEntity = useMemo(() => {
    const map: Record<string, string> = {};
    (data?.translationRows ?? []).forEach((row: Row) => {
      if (row.field_name === 'title' && !map[row.entity_id]) map[row.entity_id] = row.value;
    });
    return map;
  }, [data]);

  const filtered = rows.filter((row) => {
    const title = titlesByEntity[row.id] ?? '';
    if (search.trim() && !title.toLowerCase().includes(search.trim().toLowerCase()) && !String(row.slug ?? '').toLowerCase().includes(search.trim().toLowerCase())) return false;
    if (statusFilter !== 'all' && row.status !== statusFilter) return false;
    if (typeFilter !== 'all' && row.publication_type !== typeFilter) return false;
    return true;
  });

  const openEditor = (row: Row | null) => {
    setLang('en');
    if (!row) {
      setEditing({
        id: null, slug: '', publication_type: 'article', category: '', cover_image_url: null, document_url: null,
        published_at: new Date().toISOString().slice(0, 10), reading_time: 4, author: 'Advaxe Ndayisenga',
        status: 'draft', featured: false, seo_title: null, seo_description: null,
      });
      setTranslations(emptyTranslations());
      return;
    }
    const next = emptyTranslations();
    (data?.translationRows ?? []).forEach((item: Row) => {
      if (item.entity_id === row.id) next[item.lang as Lang] = { ...next[item.lang as Lang], [item.field_name]: item.value };
    });
    setTranslations(next);
    setEditing({ ...row });
  };

  const closeEditor = () => setEditing(null);

  const setField = (name: string, value: unknown) =>
    setEditing((current) => (current ? { ...current, [name]: value } : current));

  const setTranslation = (name: string, value: string) =>
    setTranslations((current) => ({ ...current, [lang]: { ...current[lang], [name]: value } }));

  const save = async () => {
    if (!editing) return;
    const title = (translations.en.title || translations[lang].title || '').trim();
    if (!title) { toast({ title: 'Titre requis', description: 'Ajoutez au moins un titre (en ou dans la langue active).', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const payload: Row = {
        slug: (editing.slug || '').trim() || slugify(title),
        publication_type: editing.publication_type || 'article',
        category: editing.category || null,
        cover_image_url: editing.cover_image_url || null,
        document_url: editing.document_url || null,
        published_at: editing.published_at || null,
        reading_time: Number(editing.reading_time ?? 4) || 4,
        author: editing.author || 'Advaxe Ndayisenga',
        status: editing.status || 'draft',
        featured: Boolean(editing.featured),
        seo_title: editing.seo_title || null,
        seo_description: editing.seo_description || null,
      };

      let entityId = editing.id as string | null;
      if (!entityId) {
        const { data: inserted, error } = await client.from('articles').insert(payload).select('id').single();
        if (error) throw error;
        entityId = inserted.id;
      } else {
        const { error } = await client.from('articles').update(payload).eq('id', entityId);
        if (error) throw error;
      }

      const rowsToUpsert = LANGUAGES.flatMap(({ code }) =>
        TRANSLATED_FIELDS
          .map((field) => ({ entity_type: 'article', entity_id: entityId!, lang: code, field_name: field, value: translations[code][field] ?? '' }))
          .filter((row) => row.value.trim().length > 0));
      if (rowsToUpsert.length) {
        const { error } = await client.from('content_translations')
          .upsert(rowsToUpsert, { onConflict: 'entity_type,entity_id,lang,field_name' });
        if (error) throw error;
      }

      toast({ title: 'Enregistré', description: 'Publication mise à jour.' });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'articles'] });
      setEditing(null);
    } catch (error: any) {
      toast({ title: 'Erreur', description: error?.message ?? 'Échec de l’enregistrement.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    if (!window.confirm('Supprimer définitivement cette publication ?')) return;
    const { error: trError } = await client.from('content_translations')
      .delete().eq('entity_type', 'article').eq('entity_id', row.id);
    if (trError) { toast({ title: 'Erreur', description: trError.message, variant: 'destructive' }); return; }
    const { error } = await client.from('articles').delete().eq('id', row.id);
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Supprimée', description: 'Publication supprimée.' });
    setEditing((current) => (current && current.id === row.id ? null : current));
    await queryClient.invalidateQueries({ queryKey: ['admin', 'articles'] });
  };

  const shared = 'w-full border border-input bg-background px-3 py-2 text-sm';

  if (editing) {
    const publicUrl = editing.slug && editing.status === 'published' ? `/${lang}/ideas/${editing.slug}` : null;
    return (
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={closeEditor} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Toutes les publications
            </button>
            <h2 className="text-lg font-semibold">{editing.id ? 'Modifier la publication' : 'Nouvelle publication'}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {LANGUAGES.map((language) => (
              <button key={language.code} onClick={() => setLang(language.code)}
                className={`lang-badge ${lang === language.code ? 'lang-badge-active' : ''}`}>{language.code.toUpperCase()}</button>
            ))}
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <div className="dashboard-card space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Titre ({lang.toUpperCase()})</label>
                <input className={`${shared} mt-1 text-lg`} value={translations[lang].title ?? ''}
                  onChange={(event) => setTranslation('title', event.target.value)} placeholder="Titre de la publication" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Extrait ({lang.toUpperCase()})</label>
                <textarea rows={3} className={`${shared} mt-1`} value={translations[lang].excerpt ?? ''}
                  onChange={(event) => setTranslation('excerpt', event.target.value)} placeholder="Court résumé affiché dans les listes" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Contenu ({lang.toUpperCase()})</label>
              <RichTextEditor value={translations[lang].content ?? ''} onChange={(next) => setTranslation('content', next)} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="dashboard-card space-y-3">
              <h3 className="text-sm font-semibold">Publication</h3>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Statut</label>
                <select className={`${shared} mt-1`} value={editing.status ?? 'draft'} onChange={(event) => setField('status', event.target.value)}>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(editing.featured)} onChange={(event) => setField('featured', event.target.checked)} />
                Mettre en avant (vedette)
              </label>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Date de publication</label>
                <input type="date" className={`${shared} mt-1`} value={editing.published_at?.slice(0, 10) ?? ''}
                  onChange={(event) => setField('published_at', event.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Temps de lecture (min)</label>
                <input type="number" min={1} className={`${shared} mt-1`} value={editing.reading_time ?? 4}
                  onChange={(event) => setField('reading_time', Number(event.target.value))} />
              </div>
              {publicUrl && (
                <a href={publicUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                  <Eye className="h-3 w-3" /> Voir sur le site
                </a>
              )}
            </div>

            <div className="dashboard-card space-y-3">
              <h3 className="text-sm font-semibold">Détails</h3>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <select className={`${shared} mt-1`} value={editing.publication_type ?? 'article'} onChange={(event) => setField('publication_type', event.target.value)}>
                  <option value="article">Article</option>
                  <option value="study">Étude</option>
                  <option value="policy_brief">Policy brief</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Catégorie</label>
                <input className={`${shared} mt-1`} value={editing.category ?? ''} onChange={(event) => setField('category', event.target.value)} placeholder="Ex. Bitcoin, Tech" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Auteur</label>
                <input className={`${shared} mt-1`} value={editing.author ?? ''} onChange={(event) => setField('author', event.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Slug (URL)</label>
                <input className={`${shared} mt-1`} value={editing.slug ?? ''} onChange={(event) => setField('slug', event.target.value)} placeholder="généré automatiquement si vide" />
              </div>
            </div>

            <div className="dashboard-card space-y-3">
              <h3 className="text-sm font-semibold">Fichiers</h3>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Image de couverture</label>
                <div className="mt-1"><MediaPicker value={editing.cover_image_url} onChange={(url) => setField('cover_image_url', url || null)} accept="image/*" /></div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Document PDF / étude</label>
                <div className="mt-1"><MediaPicker value={editing.document_url} onChange={(url) => setField('document_url', url || null)} accept="application/pdf" /></div>
              </div>
            </div>

            <div className="dashboard-card space-y-3">
              <h3 className="text-sm font-semibold">SEO</h3>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Titre SEO</label>
                <input className={`${shared} mt-1`} value={editing.seo_title ?? ''} onChange={(event) => setField('seo_title', event.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description SEO</label>
                <textarea rows={3} className={`${shared} mt-1`} value={editing.seo_description ?? ''} onChange={(event) => setField('seo_description', event.target.value)} />
              </div>
            </div>

            {editing.id && (
              <button onClick={() => remove(editing)} className="flex items-center gap-2 text-sm text-destructive hover:underline">
                <Trash2 className="h-4 w-4" /> Déplacer à la corbeille
              </button>
            )}
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Publications</h2>
          <p className="text-xs text-muted-foreground">{rows.length} publication{rows.length === 1 ? '' : 's'} · {filtered.length} affichée{filtered.length === 1 ? '' : 's'}</p>
        </div>
        <button onClick={() => openEditor(null)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Nouvelle publication
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 border border-input bg-background px-3 py-2 sm:w-72">
          <Search className="h-3 w-3 text-muted-foreground" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Rechercher un titre…" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'published', 'draft'] as const).map((value) => (
            <button key={value} onClick={() => setStatusFilter(value)}
              className={`lang-badge ${statusFilter === value ? 'lang-badge-active' : ''}`}>
              {value === 'all' ? 'Tous' : value === 'published' ? 'Publiées' : 'Brouillons'}
            </button>
          ))}
        </div>
        <select className="border border-input bg-background px-3 py-2 text-sm" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="all">Tous les types</option>
          <option value="article">Articles</option>
          <option value="study">Études</option>
          <option value="policy_brief">Policy briefs</option>
        </select>
      </div>

      <div className="dashboard-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Auteur</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Chargement…</td></tr>}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Aucune publication ne correspond à ces filtres.</td></tr>
            )}
            {filtered.map((row) => {
              const title = titlesByEntity[row.id] || row.slug || 'Sans titre';
              return (
                <tr key={row.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <button onClick={() => openEditor(row)} className="text-left font-medium hover:text-primary hover:underline">{title}</button>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="border border-border px-1.5 py-0.5">{TYPE_LABELS[row.publication_type] ?? row.publication_type}</span>
                      {row.category && <span>{row.category}</span>}
                      {row.featured && <Star className="h-3 w-3 fill-current text-primary" aria-label="Vedette" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.author || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(row.published_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`border px-2 py-0.5 text-xs ${row.status === 'published' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}`}>
                      {row.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <button onClick={() => openEditor(row)} className="flex items-center gap-1 text-primary hover:underline"><Pencil className="h-3 w-3" /> Modifier</button>
                      {row.status === 'published' && row.slug && (
                        <a href={`/${lang}/ideas/${row.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline"><Eye className="h-3 w-3" /> Voir</a>
                      )}
                      <button onClick={() => remove(row)} className="flex items-center gap-1 text-destructive hover:underline"><Trash2 className="h-3 w-3" /> Supprimer</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
