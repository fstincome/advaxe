DROP POLICY IF EXISTS "Authenticated users can read visitors" ON public.visitors;
CREATE POLICY "Admins read visitors" ON public.visitors FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can read activity logs" ON public.activity_logs;
CREATE POLICY "Admins read activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can read clicks" ON public.click_tracking;
CREATE POLICY "Admins read clicks" ON public.click_tracking FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.visitors ADD CONSTRAINT visitors_page_length CHECK (char_length(page_visited) <= 300);
ALTER TABLE public.visitors ADD CONSTRAINT visitors_user_agent_length CHECK (char_length(user_agent) <= 500);
ALTER TABLE public.visitors ADD CONSTRAINT visitors_referrer_length CHECK (char_length(referrer) <= 500);
ALTER TABLE public.click_tracking ADD CONSTRAINT click_element_length CHECK (char_length(element) <= 200);
ALTER TABLE public.click_tracking ADD CONSTRAINT click_page_length CHECK (char_length(page) <= 300);
ALTER TABLE public.activity_logs ADD CONSTRAINT activity_action_length CHECK (char_length(action) <= 200);
ALTER TABLE public.activity_logs ADD CONSTRAINT activity_category_length CHECK (char_length(category) <= 100);

ALTER TABLE public.projects ADD COLUMN problem text;
ALTER TABLE public.projects ADD COLUMN approach text;
ALTER TABLE public.projects ADD COLUMN impact text;
ALTER TABLE public.projects ADD COLUMN role text;
ALTER TABLE public.projects ADD COLUMN project_year int;

ALTER TABLE public.pages ADD COLUMN seo_title text;
ALTER TABLE public.pages ADD COLUMN seo_description text;
ALTER TABLE public.pages ADD COLUMN canonical_url text;
ALTER TABLE public.pages ADD COLUMN og_image_url text;

ALTER TABLE public.articles ADD COLUMN category text;
ALTER TABLE public.articles ADD COLUMN seo_title text;
ALTER TABLE public.articles ADD COLUMN seo_description text;

ALTER TABLE public.speaking_events ADD COLUMN event_type text NOT NULL DEFAULT 'talk';
ALTER TABLE public.media_appearances ADD COLUMN duration text;

CREATE TABLE public.project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_categories TO authenticated;
GRANT ALL ON public.project_categories TO service_role;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads project categories" ON public.project_categories FOR SELECT USING (visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage project categories" ON public.project_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit log" ON public.audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins create audit log" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') AND actor_id = auth.uid());