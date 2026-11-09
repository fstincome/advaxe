ALTER TABLE public.visitors ADD COLUMN IF NOT EXISTS anonymous_id uuid;
CREATE INDEX IF NOT EXISTS visitors_created_at_idx ON public.visitors(created_at);
CREATE OR REPLACE FUNCTION public.dashboard_analytics(days integer DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501'; END IF;
 IF days IS NOT NULL AND days NOT IN (1,7,30) THEN RAISE EXCEPTION 'Invalid period'; END IF;
 WITH filtered AS (
 SELECT *, CASE WHEN page_visited = '/' THEN '/' ELSE coalesce(nullif(regexp_replace(regexp_replace(split_part(split_part(page_visited, '?', 1), '#', 1), '^/(en|fr|sw|rn)(/|$)', '/'), '/+$', ''), ''), '/') END AS path
 FROM public.visitors
 WHERE (days IS NULL OR created_at >= now() - make_interval(days => days))
 AND coalesce(user_agent,'') !~* '(bot|crawler|spider|headless|facebookexternalhit|whatsapp|preview|curl|wget)'
 AND coalesce(page_visited,'/') !~ '^/(dashboard|auth)(/|$)'
 ), pages AS (
 SELECT path, count(*) AS views, count(DISTINCT anonymous_id) AS unique_visitors, count(*) FILTER (WHERE anonymous_id IS NULL) AS legacy_views, max(created_at) AS last_visit FROM filtered GROUP BY path
 ), countries AS (SELECT coalesce(country,'Unknown') AS name,count(*) AS views FROM filtered GROUP BY 1), continents AS (SELECT coalesce(continent,'Unknown') AS name,count(*) AS views FROM filtered GROUP BY 1)
 SELECT jsonb_build_object(
 'views',(SELECT count(*) FROM filtered), 'unique_visitors',(SELECT count(DISTINCT anonymous_id) FROM filtered), 'legacy_views',(SELECT count(*) FROM filtered WHERE anonymous_id IS NULL),
 'activity_count',(SELECT count(*) FROM public.activity_logs), 'click_count',(SELECT count(*) FROM public.click_tracking),
 'pages',coalesce((SELECT jsonb_agg(jsonb_build_object('path',p.path,'views',p.views,'unique_visitors',p.unique_visitors,'legacy_views',p.legacy_views,'last_visit',p.last_visit,'title',coalesce((SELECT value FROM public.content_translations t WHERE t.entity_type='article' AND t.entity_id=a.id AND t.field_name='title' AND t.lang='fr' LIMIT 1),a.slug),'article',a.id IS NOT NULL) ORDER BY p.views DESC,p.path) FROM pages p LEFT JOIN public.articles a ON p.path='/ideas/'||a.slug),'[]'::jsonb),
 'countries',coalesce((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.views DESC) FROM countries c),'[]'::jsonb),
 'continents',coalesce((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.views DESC) FROM continents c),'[]'::jsonb)
 ) INTO result;
 RETURN result;
END; $$;
REVOKE ALL ON FUNCTION public.dashboard_analytics(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dashboard_analytics(integer) TO authenticated;
GRANT ALL ON public.visitors TO service_role;
