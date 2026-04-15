
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Site content (translatable key-value pairs per section)
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  lang text NOT NULL DEFAULT 'fr',
  content text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_key, lang)
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage site content" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Personal info
CREATE TABLE public.personal_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  info_key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(info_key)
);
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read personal info" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage personal info" ON public.personal_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Experiences
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{}',
  company text NOT NULL,
  company_url text,
  period text NOT NULL,
  description jsonb NOT NULL DEFAULT '{}',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  percentage int NOT NULL DEFAULT 0,
  sort_order int DEFAULT 0
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{}',
  description jsonb NOT NULL DEFAULT '{}',
  icon text,
  sort_order int DEFAULT 0
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text DEFAULT 'tech',
  image_url text,
  project_url text,
  description jsonb DEFAULT '{}',
  sort_order int DEFAULT 0
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Social links
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order int DEFAULT 0
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Visitors tracking
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text,
  country text,
  continent text,
  city text,
  page_visited text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert visitors" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read visitors" ON public.visitors FOR SELECT TO authenticated USING (true);

-- Activity logs
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  details jsonb,
  ip_address text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (true);

-- Click tracking
CREATE TABLE public.click_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  element text NOT NULL,
  page text,
  visitor_id uuid REFERENCES public.visitors(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.click_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert clicks" ON public.click_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read clicks" ON public.click_tracking FOR SELECT TO authenticated USING (true);
