CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'advaxe.mucatcha@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can manage site content" ON public.site_content;
CREATE POLICY "Admins manage site content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can manage personal info" ON public.personal_info;
CREATE POLICY "Admins manage personal info" ON public.personal_info FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can manage experiences" ON public.experiences;
CREATE POLICY "Admins manage experiences" ON public.experiences FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;
CREATE POLICY "Admins manage skills" ON public.skills FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Authenticated users can manage social links" ON public.social_links;
CREATE POLICY "Admins manage social links" ON public.social_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.projects ADD COLUMN slug text;
ALTER TABLE public.projects ADD COLUMN status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived'));
ALTER TABLE public.projects ADD COLUMN featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.projects ADD COLUMN github_url text;
ALTER TABLE public.projects ADD COLUMN demo_url text;
ALTER TABLE public.projects ADD COLUMN current_status text;
ALTER TABLE public.projects ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.projects ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX projects_slug_unique ON public.projects(slug) WHERE slug IS NOT NULL;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.experiences ADD COLUMN location text;
ALTER TABLE public.experiences ADD COLUMN start_date date;
ALTER TABLE public.experiences ADD COLUMN end_date date;
ALTER TABLE public.experiences ADD COLUMN is_current boolean NOT NULL DEFAULT false;
ALTER TABLE public.experiences ADD COLUMN logo_url text;
ALTER TABLE public.experiences ADD COLUMN technologies text[] NOT NULL DEFAULT '{}';

CREATE TABLE public.content_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  lang text NOT NULL CHECK (lang IN ('en','fr','sw','rn')),
  field_name text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, lang, field_name)
);
GRANT SELECT ON public.content_translations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_translations TO authenticated;
GRANT ALL ON public.content_translations TO service_role;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads content translations" ON public.content_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage content translations" ON public.content_translations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX content_translations_lookup ON public.content_translations(entity_type, entity_id, lang);

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published pages" ON public.pages FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.expertise_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.expertise_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.expertise_categories TO authenticated;
GRANT ALL ON public.expertise_categories TO service_role;
ALTER TABLE public.expertise_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads expertise categories" ON public.expertise_categories FOR SELECT USING (visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage expertise categories" ON public.expertise_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_expertise_categories_updated_at BEFORE UPDATE ON public.expertise_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.expertise_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.expertise_categories(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.expertise_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.expertise_items TO authenticated;
GRANT ALL ON public.expertise_items TO service_role;
ALTER TABLE public.expertise_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads expertise items" ON public.expertise_items FOR SELECT USING (visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage expertise items" ON public.expertise_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  category text,
  website_url text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.technologies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.technologies TO authenticated;
GRANT ALL ON public.technologies TO service_role;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads technologies" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Admins manage technologies" ON public.technologies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.project_technologies (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  technology_id uuid NOT NULL REFERENCES public.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY(project_id, technology_id)
);
GRANT SELECT ON public.project_technologies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_technologies TO authenticated;
GRANT ALL ON public.project_technologies TO service_role;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads project technologies" ON public.project_technologies FOR SELECT USING (true);
CREATE POLICY "Admins manage project technologies" ON public.project_technologies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured boolean NOT NULL DEFAULT false,
  cover_image_url text,
  author text NOT NULL DEFAULT 'Advaxe Ndayisenga',
  published_at timestamptz,
  reading_time int NOT NULL DEFAULT 5 CHECK (reading_time > 0),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published articles" ON public.articles FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.article_tags (
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY(article_id, tag_id)
);
GRANT SELECT ON public.article_tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.article_tags TO authenticated;
GRANT ALL ON public.article_tags TO service_role;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads article tags" ON public.article_tags FOR SELECT USING (true);
CREATE POLICY "Admins manage article tags" ON public.article_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.speaking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  event_date date NOT NULL,
  location text,
  role text,
  image_url text,
  video_url text,
  resource_url text,
  external_url text,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.speaking_events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.speaking_events TO authenticated;
GRANT ALL ON public.speaking_events TO service_role;
ALTER TABLE public.speaking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published speaking" ON public.speaking_events FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage speaking" ON public.speaking_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_speaking_updated_at BEFORE UPDATE ON public.speaking_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.community_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  organization text NOT NULL,
  contribution_type text NOT NULL,
  role text,
  start_date date,
  end_date date,
  image_url text,
  external_url text,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_contributions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_contributions TO authenticated;
GRANT ALL ON public.community_contributions TO service_role;
ALTER TABLE public.community_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published contributions" ON public.community_contributions FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage contributions" ON public.community_contributions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON public.community_contributions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  mime_type text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0 CHECK (file_size >= 0),
  alt_text text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads media metadata" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admins manage media metadata" ON public.media_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.media_appearances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  media_type text NOT NULL,
  publisher text,
  appearance_date date,
  image_url text,
  external_url text NOT NULL,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_appearances TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_appearances TO authenticated;
GRANT ALL ON public.media_appearances TO service_role;
ALTER TABLE public.media_appearances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published media" ON public.media_appearances FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage media" ON public.media_appearances FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_media_appearances_updated_at BEFORE UPDATE ON public.media_appearances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads public settings" ON public.site_settings FOR SELECT USING (is_public OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  inquiry_type text NOT NULL DEFAULT 'project',
  subject text CHECK (char_length(subject) <= 180),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  lang text NOT NULL DEFAULT 'en' CHECK (lang IN ('en','fr','sw','rn')),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submits contact messages" ON public.contact_messages FOR INSERT WITH CHECK (is_read = false);
CREATE POLICY "Admins manage contact messages" ON public.contact_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.site_content, public.personal_info, public.experiences, public.skills, public.services, public.projects, public.social_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content, public.personal_info, public.experiences, public.skills, public.services, public.projects, public.social_links TO authenticated;
GRANT ALL ON public.site_content, public.personal_info, public.experiences, public.skills, public.services, public.projects, public.social_links, public.visitors, public.activity_logs, public.click_tracking TO service_role;
GRANT INSERT ON public.visitors, public.activity_logs, public.click_tracking TO anon, authenticated;
GRANT SELECT ON public.visitors, public.activity_logs, public.click_tracking TO authenticated;
