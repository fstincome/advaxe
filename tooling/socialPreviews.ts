import type { Plugin } from 'vite';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { articleImage, SHARE_LANGUAGES, sharePage, SITE_ORIGIN } from '../src/lib/socialShare';

type Article = { id: string; slug: string; cover_image_url: string | null };
type Translation = { entity_id: string; lang: string; field_name: string; value: string };

export function socialPreviews(env: Record<string, string>): Plugin {
  const files = new Map<string, string | Buffer>();
  return {
    name: 'article-social-previews',
    async buildStart() {
      files.clear();
      const backend = env.VITE_SUPABASE_URL;
      const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!backend || !key) throw new Error('Public content settings missing for social previews');
      const query = async <T>(table: string, search: string): Promise<T[]> => {
        const response = await fetch(`${backend}/rest/v1/${table}?${search}`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw new Error(`Cannot load published social preview content (${response.status})`);
        return response.json();
      };
      const [articles, translations] = await Promise.all([
        query<Article>('articles', 'select=id,slug,cover_image_url&status=eq.published'),
        query<Translation>('content_translations', 'select=entity_id,lang,field_name,value&entity_type=eq.article'),
      ]);
      const manifest: Record<string, string> = {};
      await Promise.all(articles.map(async (article) => {
        if (!/^[a-zA-Z0-9_-]+$/.test(article.slug)) return;
        const localized = (lang: string) => Object.fromEntries([
          ...translations.filter((row) => row.entity_id === article.id && row.lang === 'en'),
          ...translations.filter((row) => row.entity_id === article.id && row.lang === lang),
        ].map((row) => [row.field_name, row.value]));
        const imageCache = new Map<string, string>();
        for (const lang of SHARE_LANGUAGES) {
          const fields = localized(lang);
          const title = fields.title || article.slug;
          const description = (fields.excerpt || '').replace(/<[^>]*>/g, '').slice(0, 300);
          const source = articleImage(article.cover_image_url, fields.content || '');
          let image = `${SITE_ORIGIN}/og-image.jpg`;
          if (source) {
            const cached = imageCache.get(source);
            if (cached) image = cached;
            else {
              try {
                const url = new URL(source, SITE_ORIGIN);
                if (url.protocol !== 'https:') throw new Error('Image must use HTTPS');
                const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
                if (!response.ok) throw new Error(`Image unavailable (${response.status})`);
                const bytes = Buffer.from(await response.arrayBuffer());
                if (bytes.length > 10 * 1024 * 1024) throw new Error('Image is too large');
                const thumbnail = await sharp(bytes).rotate().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
                const digest = createHash('sha256').update(thumbnail).digest('hex').slice(0, 12);
                const filename = `share/images/${article.slug}-${digest}.jpg`;
                files.set(filename, thumbnail);
                image = `${SITE_ORIGIN}/${filename}`;
                imageCache.set(source, image);
              } catch {
                this.warn(`Photo unavailable for ${article.slug} (${lang}); using the site portrait`);
              }
            }
          }
          const articlePath = `/${lang}/ideas/${article.slug}`;
          const version = createHash('sha256').update(JSON.stringify({ title, description, image })).digest('hex').slice(0, 12);
          const filename = `share/${lang}/${article.slug}.html`;
          const shareUrl = `${SITE_ORIGIN}/${filename}?v=${version}`;
          manifest[articlePath] = shareUrl;
          files.set(filename, sharePage({ lang, title, description, image, shareUrl, articleUrl: `${SITE_ORIGIN}${articlePath}` }));
        }
      }));
      files.set('share/manifest.json', JSON.stringify(manifest));
      // Confirm that the no-photo fallback actually exists, rather than emitting broken tags.
      await readFile(path.resolve('public/og-image.jpg'));
    },
    generateBundle() {
      for (const [fileName, source] of files) this.emitFile({ type: 'asset', fileName, source });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const filename = (request.url || '').split('?')[0].replace(/^\//, '');
        const source = files.get(filename);
        if (source === undefined) return next();
        response.setHeader('Content-Type', filename.endsWith('.jpg') ? 'image/jpeg' : filename.endsWith('.json') ? 'application/json' : 'text/html; charset=utf-8');
        response.end(source);
      });
    },
  };
}