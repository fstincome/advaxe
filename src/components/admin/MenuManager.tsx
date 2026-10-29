import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LANGUAGES, Lang, useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { DEFAULT_MENU, MENU_SETTING_KEY, MenuItem, PAGE_OPTIONS, useSiteMenu } from '@/lib/siteMenu';

const input = 'w-full border border-input bg-background px-3 py-2 text-sm';

export default function MenuManager() {
  const { data } = useSiteMenu();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [lang, setLang] = useState<Lang>('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setItems(data); }, [data]);

  const update = (id: string, patch: Partial<MenuItem>) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const move = (index: number, dir: -1 | 1) => setItems((list) => {
    const next = [...list];
    const target = index + dir;
    if (target < 0 || target >= next.length) return list;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });

  const remove = (id: string) => setItems((list) =>
    list.filter((item) => item.id !== id).map((item) => (item.parent === id ? { ...item, parent: null } : item)));

  const add = () => setItems((list) => [...list, { id: `m-${Date.now()}`, path: 'about', labels: { en: 'New item' }, visible: true, parent: null }]);

  const save = async () => {
    setSaving(true);
    const value = JSON.stringify(items);
    const { data: existing } = await supabase.from('site_settings').select('id').eq('setting_key', MENU_SETTING_KEY).maybeSingle();
    const { error } = existing
      ? await supabase.from('site_settings').update({ value, is_public: true }).eq('id', existing.id)
      : await supabase.from('site_settings').insert({ setting_key: MENU_SETTING_KEY, value, is_public: true });
    setSaving(false);
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Menu enregistré' });
    queryClient.invalidateQueries({ queryKey: ['site-menu'] });
  };

  // Display parents first, then their children right beneath
  const ordered = items.filter((i) => !i.parent || !items.some((p) => p.id === i.parent));
  const rows = ordered.flatMap((p) => [p, ...items.filter((c) => c.parent === p.id)]);

  return (
    <section className="space-y-5 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Menu du site</h2>
          <p className="text-xs text-muted-foreground">Choisissez les pages affichées, leur ordre et placez-en sous un autre élément pour créer un sous-menu.</p>
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)} className={`lang-badge ${lang === l.code ? 'lang-badge-active' : ''}`}>{l.code.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((item) => {
          const index = items.indexOf(item);
          const isPage = PAGE_OPTIONS.some(([key]) => key === item.path);
          const hasChildren = items.some((c) => c.parent === item.id);
          return (
            <div key={item.id} className={`dashboard-card grid gap-3 md:grid-cols-[auto_1fr_1fr_1fr_auto] items-end ${item.parent ? 'md:ml-10 border-l-4 border-l-primary/40' : ''} ${item.visible ? '' : 'opacity-60'}`}>
              <div className="flex md:flex-col gap-1">
                <button onClick={() => move(index, -1)} className="p-1 hover:bg-secondary rounded" aria-label="Monter"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => move(index, 1)} className="p-1 hover:bg-secondary rounded" aria-label="Descendre"><ArrowDown className="w-4 h-4" /></button>
              </div>
              <label className="space-y-1 text-xs text-muted-foreground">Libellé ({lang.toUpperCase()})
                <input className={input} value={item.labels[lang] ?? ''} placeholder={item.labelKey ? t(item.labelKey) : ''}
                  onChange={(e) => update(item.id, { labels: { ...item.labels, [lang]: e.target.value } })} />
              </label>
              <label className="space-y-1 text-xs text-muted-foreground">Lien
                <select className={input} value={isPage ? item.path : '__url'}
                  onChange={(e) => update(item.id, { path: e.target.value === '__url' ? 'https://' : e.target.value })}>
                  {PAGE_OPTIONS.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  <option value="__url">Lien externe…</option>
                </select>
                {!isPage && <input className={input} value={item.path} onChange={(e) => update(item.id, { path: e.target.value })} />}
              </label>
              <label className="space-y-1 text-xs text-muted-foreground">Placer sous
                <select className={input} value={item.parent ?? ''} disabled={hasChildren}
                  onChange={(e) => update(item.id, { parent: e.target.value || null })}>
                  <option value="">— Menu principal —</option>
                  {items.filter((p) => p.id !== item.id && !p.parent).map((p) => (
                    <option key={p.id} value={p.id}>{p.labels[lang] || (p.labelKey ? t(p.labelKey) : p.path)}</option>
                  ))}
                </select>
              </label>
              <div className="flex gap-1">
                <button onClick={() => update(item.id, { visible: !item.visible })} className="p-2 hover:bg-secondary rounded" title={item.visible ? 'Masquer' : 'Afficher'}>
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(item.id)} className="p-2 hover:bg-secondary rounded text-destructive" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={add} className="flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-secondary"><Plus className="w-4 h-4" /> Ajouter un élément</button>
        <button onClick={() => setItems(DEFAULT_MENU)} className="flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-secondary"><RotateCcw className="w-4 h-4" /> Menu par défaut</button>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> {saving ? 'Enregistrement…' : 'Enregistrer le menu'}</button>
      </div>
    </section>
  );
}
