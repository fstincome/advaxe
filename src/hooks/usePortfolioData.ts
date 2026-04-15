import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, Lang } from '@/contexts/LanguageContext';

export const usePersonalInfo = () => useQuery({
  queryKey: ['personal_info'],
  queryFn: async () => {
    const { data } = await supabase.from('personal_info').select('*');
    const map: Record<string, string> = {};
    data?.forEach(d => { map[d.info_key] = d.value; });
    return map;
  }
});

export const useSiteContent = () => {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ['site_content', lang],
    queryFn: async () => {
      const { data } = await supabase.from('site_content').select('*').eq('lang', lang);
      const map: Record<string, string> = {};
      data?.forEach(d => { map[d.section_key] = d.content; });
      return map;
    }
  });
};

export const useExperiences = () => useQuery({
  queryKey: ['experiences'],
  queryFn: async () => {
    const { data } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
    return data || [];
  }
});

export const useSkills = () => useQuery({
  queryKey: ['skills'],
  queryFn: async () => {
    const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    return data || [];
  }
});

export const useServices = () => useQuery({
  queryKey: ['services'],
  queryFn: async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    return data || [];
  }
});

export const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    return data || [];
  }
});

export const useSocialLinks = () => useQuery({
  queryKey: ['social_links'],
  queryFn: async () => {
    const { data } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
    return data || [];
  }
});

export const getLocalizedField = (field: any, lang: Lang): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field['fr'] || field['en'] || Object.values(field)[0] || '';
};
