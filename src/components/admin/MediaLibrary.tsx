import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MAX_BYTES = 3 * 1024 * 1024;
const BUCKET = 'site-media';
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5;

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const { data: assets } = useQuery({
    queryKey: ['admin', 'media_assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        toast({ title: 'Fichier trop lourd', description: `${file.name} dépasse 3 MB.`, variant: 'destructive' });
        continue;
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
      const path = `${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '31536000',
        contentType: file.type || 'application/octet-stream',
      });
      if (uploadError) {
        toast({ title: 'Échec du téléversement', description: uploadError.message, variant: 'destructive' });
        continue;
      }
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
      const { data: session } = await supabase.auth.getUser();
      const { error: insertError } = await supabase.from('media_assets').insert({
        file_name: file.name,
        storage_path: path,
        mime_type: file.type || 'application/octet-stream',
        file_size: file.size,
        public_url: signed?.signedUrl ?? null,
        uploaded_by: session.user?.id ?? null,
      });
      if (insertError) {
        toast({ title: 'Erreur', description: insertError.message, variant: 'destructive' });
        continue;
      }
      toast({ title: 'Ajouté', description: file.name });
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
    queryClient.invalidateQueries({ queryKey: ['admin', 'media_assets'] });
  };

  const remove = async (id: string, path: string) => {
    await supabase.storage.from(BUCKET).remove([path]);
    const { error } = await supabase.from('media_assets').delete().eq('id', id);
    if (error) { toast({ title: 'Erreur', description: error.message, variant: 'destructive' }); return; }
    queryClient.invalidateQueries({ queryKey: ['admin', 'media_assets'] });
  };

  const copy = async (url: string | null) => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast({ title: 'Lien copié', description: 'Collez-le dans un champ image.' });
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Bibliothèque de fichiers</h2>
          <p className="text-xs text-muted-foreground">Images et fichiers jusqu'à 3 MB.</p>
        </div>
        <label className="btn-primary flex cursor-pointer items-center gap-2 text-sm">
          <Upload className="h-4 w-4" /> {busy ? 'Envoi…' : 'Téléverser'}
          <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" className="hidden"
            disabled={busy} onChange={(event) => upload(event.target.files)} />
        </label>
      </div>

      {(assets?.length ?? 0) === 0 && (
        <p className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Aucun fichier.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(assets ?? []).map((asset: any) => (
          <article key={asset.id} className="dashboard-card space-y-3">
            {asset.mime_type?.startsWith('image/') && asset.public_url && (
              <img src={asset.public_url} alt={asset.alt_text ?? asset.file_name} loading="lazy"
                className="h-36 w-full object-cover" />
            )}
            <div className="space-y-1">
              <p className="truncate text-sm font-medium">{asset.file_name}</p>
              <p className="text-xs text-muted-foreground">{Math.round((asset.file_size ?? 0) / 1024)} KB</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => copy(asset.public_url)} className="flex items-center gap-1 text-xs hover:underline">
                <Copy className="h-3 w-3" /> Copier le lien
              </button>
              <button onClick={() => remove(asset.id, asset.storage_path)} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                <Trash2 className="h-3 w-3" /> Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
