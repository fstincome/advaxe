ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS publication_type text NOT NULL DEFAULT 'article';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS document_url text;
ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_publication_type_check;
ALTER TABLE public.articles ADD CONSTRAINT articles_publication_type_check
  CHECK (publication_type IN ('article','study','policy_brief'));