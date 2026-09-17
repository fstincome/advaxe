CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  entry_type text NOT NULL DEFAULT 'certification' CHECK (entry_type IN ('certification','skill')),
  issuer text,
  category text,
  level text,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  image_url text,
  status text NOT NULL DEFAULT 'published',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.certifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are publicly readable"
ON public.certifications FOR SELECT USING (true);

CREATE POLICY "Admins manage certifications"
ON public.certifications FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.certifications (slug, entry_type, issuer, category, level, sort_order) VALUES
  ('bsc-computer-science', 'certification', 'East African Leadership Institute', 'Education', 'Bachelor degree', 1),
  ('full-stack-engineering', 'skill', NULL, 'Web & Software', 'Expert', 2),
  ('bitcoin-lightning', 'skill', NULL, 'Bitcoin & Lightning', 'Advanced', 3),
  ('technical-training', 'skill', NULL, 'Training & Knowledge', 'Advanced', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content_translations (entity_type, entity_id, lang, field_name, value)
SELECT 'certification', c.id, l.lang, 'title',
  CASE c.slug
    WHEN 'bsc-computer-science' THEN CASE l.lang WHEN 'fr' THEN 'Licence en informatique' WHEN 'sw' THEN 'Shahada ya Sayansi ya Kompyuta' WHEN 'rn' THEN 'Impamyabushobozi mu bumenyi bwa mudasobwa' ELSE 'BSc in Computer Science' END
    WHEN 'full-stack-engineering' THEN CASE l.lang WHEN 'fr' THEN 'Ingénierie full-stack' WHEN 'sw' THEN 'Uhandisi wa full-stack' WHEN 'rn' THEN 'Ubuhinga bwa full-stack' ELSE 'Full-stack engineering' END
    WHEN 'bitcoin-lightning' THEN CASE l.lang WHEN 'fr' THEN 'Infrastructure Bitcoin & Lightning' WHEN 'sw' THEN 'Miundombinu ya Bitcoin na Lightning' WHEN 'rn' THEN 'Ibikorwa remezo vya Bitcoin na Lightning' ELSE 'Bitcoin & Lightning infrastructure' END
    ELSE CASE l.lang WHEN 'fr' THEN 'Formation technique & mentorat' WHEN 'sw' THEN 'Mafunzo ya kiufundi na ushauri' WHEN 'rn' THEN 'Inyigisho za tekinike n''ubuyobozi' ELSE 'Technical training & mentorship' END
  END
FROM public.certifications c
CROSS JOIN (VALUES ('en'),('fr'),('sw'),('rn')) AS l(lang)
ON CONFLICT (entity_type, entity_id, lang, field_name) DO NOTHING;