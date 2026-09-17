import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Search, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  MEDIA_QUERY_KEY,
  MediaAsset,
  deleteMediaAsset,
  fetchMediaAssets,
  renameAltText,
  uploadMediaFile,
} from './mediaLibrary';

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');

  const { data: assets } = useQuery({ queryKey: MEDIA_QUERY_KEY, queryFn: fetchMediaAssets });

  const refresh = () => queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      const result = await uploadMediaFile(file);
      toast({
        title: result.ok ? 'Ajouté' : 'Échec du téléversement',
        description: result.message,
        variant: result.ok ? undefined : 'destructive',
      });
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
    refresh();
  };

  const remove = async (asset: MediaAsset) => {
    const result = await deleteMediaAsset(asset.id, asset.storage_path);
    if (!result.ok) { toast({ title: 'Erreur', description: result.message, variant: 'destructive' }); return; }
    refresh();
  };

  const saveAlt = async (asset: MediaAsset, value: string) => {
    if ((asset.alt_text ?? '') === value) return;
    const result = await renameAltText(asset.id, value);
    if (!result.ok) { toast({ title: 'Erreur', description: result.message, variant: 'destructive' }); return; }
    refresh();
  };

  const copy = async (url: string | null) => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast({ title: 'Lien copié', description: 'Collez-le dans un champ image.' });
  };

  const filtered = (assets ?? []).filter((asset) =>
    asset.file_name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Bibliothèque de médias</h2>
          <p className="text-xs text-muted-foreground">
            Déposez ici vos images et documents (3 MB max), puis choisissez-les au moment de publier.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-input bg-background px-3 py-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <input className="bg-transparent text-sm outline-none" placeholder="Rechercher"
              value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <label className="btn-primary flex cursor-pointer items-center gap-2 text-sm">
            <Upload className="h-4 w-4" /> {busy ? 'Envoi…' : 'Téléverser'}
            <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" className="hidden"
              disabled={busy} onChange={(event) => upload(event.target.files)} />
          </label>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Aucun fichier.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <article key={asset.id} className="dashboard-card space-y-3">
            {asset.mime_type?.startsWith('image/') && asset.public_url ? (
              <img src={asset.public_url} alt={asset.alt_text ?? asset.file_name} loading="lazy"
                className="h-36 w-full object-cover" />
            ) : (
              <div className="flex h-36 w-full items-center justify-center bg-muted text-xs text-muted-foreground">Document</div>
            )}
            <div className="space-y-1">
              <p className="truncate text-sm font-medium">{asset.file_name}</p>
              <p className="text-xs text-muted-foreground">{Math.round((asset.file_size ?? 0) / 1024)} KB</p>
            </div>
            <input
              className="w-full border border-input bg-background px-3 py-2 text-xs"
              defaultValue={asset.alt_text ?? ''}
              placeholder="Description (texte alternatif)"
              onBlur={(event) => saveAlt(asset, event.target.value)}
            />
            <div className="flex items-center gap-4">
              <button onClick={() => copy(asset.public_url)} className="flex items-center gap-1 text-xs hover:underline">
                <Copy className="h-3 w-3" /> Copier le lien
              </button>
              <button onClick={() => remove(asset)} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                <Trash2 className="h-3 w-3" /> Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
