import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image as ImageIcon, Search, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MEDIA_QUERY_KEY, MediaAsset, fetchMediaAssets, uploadMediaFile } from './mediaLibrary';

interface Props {
  value: string | null | undefined;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  inline?: boolean;
}

export default function MediaPicker({ value, onChange, accept = 'image/*,application/pdf', label = 'Choisir un fichier', inline = false }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: assets } = useQuery({ queryKey: MEDIA_QUERY_KEY, queryFn: fetchMediaAssets, enabled: open || inline });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    let lastUrl: string | null = null;
    for (const file of Array.from(files)) {
      const result = await uploadMediaFile(file);
      if (!result.ok) toast({ title: 'Échec', description: result.message, variant: 'destructive' });
      else lastUrl = result.url ?? null;
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
    await queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    if (lastUrl) {
      onChange(lastUrl);
      setOpen(false);
    }
  };

  const filtered = (assets ?? []).filter((asset: MediaAsset) =>
    asset.file_name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-14 shrink-0 border border-border object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-dashed border-border text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            className="w-full border border-input bg-background px-3 py-2 text-sm"
            value={value ?? ''}
            placeholder="https://…"
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="flex items-center gap-3 text-xs">
            <Button type="button" variant="link" size="sm" onClick={() => { if (inline) onChange(''); else setOpen(true); }}>{label}</Button>
            {value && <Button type="button" variant="link" size="sm" onClick={() => onChange('')} className="text-destructive">Retirer</Button>}
          </div>
        </div>
      </div>

      {(open || (inline && !value)) && (
        <div className={inline ? '' : 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4'} role={inline ? undefined : 'dialog'} aria-modal={inline ? undefined : true}>
          <div className="flex max-h-[55vh] w-full max-w-3xl flex-col border border-border bg-card">
            {!inline && <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold">Bibliothèque de médias</h3>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fermer"><X className="h-4 w-4" /></Button>
            </header>}

            <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
              <div className="flex flex-1 items-center gap-2 border border-input bg-background px-3 py-2">
                <Search className="h-3 w-3 text-muted-foreground" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="Rechercher un fichier"
                  value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <label className="btn-primary flex cursor-pointer items-center gap-2 text-sm">
                <Upload className="h-4 w-4" /> {busy ? 'Envoi…' : 'Téléverser'}
                <input ref={inputRef} type="file" multiple accept={accept} className="hidden" disabled={busy}
                  onChange={(event) => upload(event.target.files)} />
              </label>
            </div>

            <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-3">
              {filtered.length === 0 && (
                <p className="col-span-full border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Aucun fichier. Téléversez-en un (3 MB max).
                </p>
              )}
              {filtered.map((asset) => (
                <Button key={asset.id} type="button" variant="outline"
                  onClick={() => { if (asset.public_url) { onChange(asset.public_url); setOpen(false); } }}
                  className="h-auto min-w-0 flex-col items-stretch space-y-2 whitespace-normal border border-border p-2 text-left hover:border-primary">
                  {asset.mime_type?.startsWith('image/') && asset.public_url ? (
                    <img src={asset.public_url} alt={asset.alt_text ?? asset.file_name} loading="lazy" className="h-24 w-full object-cover" />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center bg-muted text-xs text-muted-foreground">Document</div>
                  )}
                  <p className="truncate text-xs">{asset.file_name}</p>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
