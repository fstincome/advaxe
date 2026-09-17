import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export type TranslationMap = Record<string, string>;

const translationMap = (rows: Array<{ field_name: string; value: string }> | null): TranslationMap =>
  Object.fromEntries((rows ?? []).map((row) => [row.field_name, row.value]));

export const useExpertise = () => {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ['expertise', lang],
    queryFn: async () => {
      const { data: categories, error } = await supabase.from('expertise_categories').select('*').order('sort_order');
      if (error) throw error;
      if (!categories?.length) return [];
      const ids = categories.map((item) => item.id);
      const { data: translations } = await supabase.from('content_translations').select('entity_id,field_name,value,lang').eq('entity_type', 'expertise_category').in('entity_id', ids).in('lang', [lang, 'en']);
      return categories.map((category) => {
        const english = translationMap(translations?.filter((row) => row.entity_id === category.id && row.lang === 'en') ?? null);
        const localized = translationMap(translations?.filter((row) => row.entity_id === category.id && row.lang === lang) ?? null);
        return { ...category, ...english, ...localized } as typeof category & TranslationMap;
      });
    },
  });
};

export const useArticles = () => {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ['articles', lang],
    queryFn: async () => {
      const { data } = await supabase.from('articles').select('*').eq('status', 'published').order('published_at', { ascending: false });
      if (!data?.length) return [];
      const { data: translations } = await supabase.from('content_translations').select('entity_id,field_name,value,lang').eq('entity_type', 'article').in('entity_id', data.map((item) => item.id)).in('lang', [lang, 'en']);
      return data.map((article) => ({ ...article, ...translationMap(translations?.filter((row) => row.entity_id === article.id && row.lang === 'en') ?? null), ...translationMap(translations?.filter((row) => row.entity_id === article.id && row.lang === lang) ?? null) } as typeof article & TranslationMap));
    },
  });
};

export const useProfessionalCollections = () => useQuery({
  queryKey: ['professional-collections'],
  queryFn: async () => {
    const [speaking, community, media] = await Promise.all([
      supabase.from('speaking_events').select('*').eq('status', 'published').order('event_date', { ascending: false }),
      supabase.from('community_contributions').select('*').eq('status', 'published').order('sort_order'),
      supabase.from('media_appearances').select('*').eq('status', 'published').order('appearance_date', { ascending: false }),
    ]);
    return { speaking: speaking.data ?? [], community: community.data ?? [], media: media.data ?? [] };
  },
});