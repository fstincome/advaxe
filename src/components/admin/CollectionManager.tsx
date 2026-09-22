import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LANGUAGES, Lang } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import MediaPicker from './MediaPicker';
import RichTextEditor from './RichTextEditor';

export type FieldType = 'text' | 'textarea' | 'richtext' | 'date' | 'number' | 'boolean' | 'media';

export interface BaseField {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
}

interface Props {
  table: string;
  entityType: string;
  title: string;
  baseFields: BaseField[];
  translatedFields: BaseField[];
  defaults: Record<string, unknown>;
  orderBy?: string;
  ascending?: boolean;
}

type Row = Record<string, any>;

const client = supabase as any;

export default function CollectionManager({
  table, entityType, title, baseFields, translatedFields, defaults, orderBy = 'sort_order', ascending = true,
}: Props) {
  const queryClient = useQueryClient();
  const [lang, setLang] = useState<Lang>('en');
  const [rows, setRows] = useState<Row[]>([]);
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});

  const { data } = useQuery({
    queryKey: ['admin', table],
    queryFn: async () => {
      const { data: items, error } = await client.from(table).select('*').order(orderBy, { ascending });
      if (error) throw error;
      const ids = (items ?? []).map((item: Row) => item.id);
      let translationRows: Row[] = [];
      if (ids.length) {
        const { data: tr } = await client.from('content_translations')
          .select('entity_id,field_name,value,lang').eq('entity_type', entityType).in('entity_id', ids);
        translationRows = tr ?? [];
      }
      return { items: items ?? [], translationRows };
    },
  });

  useEffect(() => {
    if (!data) return;
    setRows(data.items);
    const map: Record<string, Record<string, string>> = {};
    data.translationRows.forEach((row: Row) => {
      const key = `${row.entity_id}:${row.lang}`;
      map[key] = { ...(map[key] ?? {}), [row.field_name]: row.value };
    });
    setTranslations(map);
  }, [data]);

  const setField = (id: string, name: string, value: unknown) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [name]: value } : row)));

  const setTranslation = (id: string, name: string, value: string) =>
    setTranslations((current) => ({ ...current, [`${id}:${lang}`]: { ...(current[`${id}:${lang}`] ?? {}), [name]: value } }));

  const addRow = () => {
    const id = `new-${Date.now()}`;
    setRows((current) => [...current, { id, ...defaults, sort_order: current.length }]);
  };

  const save = async (row: Row) => {
    const isNew = String(row.id).startsWith('new-');
    const payload: Row = {};
    baseFields.forEach((field) => { payload[field.name] = row[field.name] ?? null; });
    payload.sort_order = Number(row.sort_order ?? 0);
    Object.entries(defaults).forEach(([key, value]) => { if (payload[key] === undefined) payload[key] = row[key] ?? value; });

    let entityId = row.id as string;
    if (isNew) {
      const { data: inserted, error } = await client.from(table).insert(payload).select('id').single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      entityId = inserted.id;
    } else {
      const { error } = await client.from(table).update(payload).eq('id', row.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }

    const current = translations[`${row.id}:${lang}`] ?? {};
    const rowsToUpsert = translatedFields
      .filter((field) => (current[field.name] ?? '').trim().length > 0)
      .map((field) => ({ entity_type: entityType, entity_id: entityId, lang, field_name: field.name, value: current[field.name] }));
    if (rowsToUpsert.length) {
      const { error } = await client.from('content_translations')
        .upsert(rowsToUpsert, { onConflict: 'entity_type,entity_id,lang,field_name' });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }

    toast({ title: 'Saved', description: `${title} updated.` });
    queryClient.invalidateQueries({ queryKey: ['admin', table] });
  };

  const remove = async (row: Row) => {
    if (String(row.id).startsWith('new-')) { setRows((current) => current.filter((item) => item.id !== row.id)); return; }
    await client.from('content_translations').delete().eq('entity_type', entityType).eq('entity_id', row.id);
    const { error } = await client.from(table).delete().eq('id', row.id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    queryClient.invalidateQueries({ queryKey: ['admin', table] });
  };

  const renderInput = (field: BaseField, value: any, onChange: (next: any) => void) => {
    const shared = 'w-full border border-input bg-background px-3 py-2 text-sm';
    if (field.type === 'richtext') return <RichTextEditor value={value ?? ''} onChange={onChange} />;
    if (field.type === 'textarea') return <textarea rows={4} className={shared} value={value ?? ''} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />;
    if (field.type === 'media') return <MediaPicker value={value} onChange={(next) => onChange(next)} />;
    if (field.type === 'boolean') return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />{field.label}</label>;
    return <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} className={shared} value={value ?? ''} placeholder={field.placeholder} onChange={(event) => onChange(field.type === 'number' ? Number(event.target.value) : event.target.value)} />;
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {LANGUAGES.map((language) => (
            <button key={language.code} onClick={() => setLang(language.code)}
              className={`lang-badge ${lang === language.code ? 'lang-badge-active' : ''}`}>{language.code.toUpperCase()}</button>
          ))}
          <button onClick={addRow} className="btn-primary flex items-center gap-2 text-sm"><Plus className="h-4 w-4" /> Add</button>
        </div>
      </div>

      {rows.length === 0 && <p className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No entries yet.</p>}

      <div className="space-y-4">
        {rows.map((row) => (
          <article key={row.id} className="dashboard-card space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {baseFields.map((field) => (
                <div key={field.name} className={`space-y-1 ${field.type === 'richtext' ? 'md:col-span-2' : ''}`}>
                  {field.type !== 'boolean' && <label className="text-xs font-medium text-muted-foreground">{field.label}</label>}
                  {renderInput(field, row[field.name], (next) => setField(row.id, field.name, next))}
                </div>
              ))}
            </div>
            <div className="grid gap-3 border-t border-border pt-4 md:grid-cols-2">
              {translatedFields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{field.label} ({lang.toUpperCase()})</label>
                  {renderInput(field, translations[`${row.id}:${lang}`]?.[field.name], (next) => setTranslation(row.id, field.name, String(next)))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => save(row)} className="btn-primary flex items-center gap-1 text-xs"><Save className="h-3 w-3" /> Save</button>
              <button onClick={() => remove(row)} className="flex items-center gap-1 text-xs text-destructive hover:underline"><Trash2 className="h-3 w-3" /> Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
