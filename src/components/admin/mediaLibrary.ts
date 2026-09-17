import { supabase } from '@/integrations/supabase/client';

export const MAX_BYTES = 3 * 1024 * 1024;
export const BUCKET = 'site-media';
export const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5;
export const MEDIA_QUERY_KEY = ['admin', 'media_assets'];

export interface MediaAsset {
  id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  alt_text: string | null;
  public_url: string | null;
  created_at: string;
}

export async function fetchMediaAssets(): Promise<MediaAsset[]> {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MediaAsset[];
}

export interface UploadResult {
  ok: boolean;
  message: string;
  url?: string | null;
}

export async function uploadMediaFile(file: File): Promise<UploadResult> {
  if (file.size > MAX_BYTES) {
    return { ok: false, message: `${file.name} dépasse 3 MB.` };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const path = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || 'application/octet-stream',
  });
  if (uploadError) return { ok: false, message: uploadError.message };

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
  if (insertError) return { ok: false, message: insertError.message };
  return { ok: true, message: file.name, url: signed?.signedUrl ?? null };
}

export async function deleteMediaAsset(id: string, path: string): Promise<UploadResult> {
  await supabase.storage.from(BUCKET).remove([path]);
  const { error } = await supabase.from('media_assets').delete().eq('id', id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Fichier supprimé.' };
}

export async function renameAltText(id: string, altText: string): Promise<UploadResult> {
  const { error } = await supabase.from('media_assets').update({ alt_text: altText }).eq('id', id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Description enregistrée.' };
}
