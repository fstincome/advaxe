import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVisitors = () => useQuery({
  queryKey: ['visitors'],
  queryFn: async () => {
    const { data } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(500);
    return data || [];
  }
});

export const useActivityLogs = () => useQuery({
  queryKey: ['activity_logs'],
  queryFn: async () => {
    const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(200);
    return data || [];
  }
});

export const useClickTracking = () => useQuery({
  queryKey: ['click_tracking'],
  queryFn: async () => {
    const { data } = await supabase.from('click_tracking').select('*').order('created_at', { ascending: false }).limit(500);
    return data || [];
  }
});

export const trackVisit = async (page: string) => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const geo = await res.json();
    await supabase.from('visitors').insert({
      page_visited: page,
      country: geo.country_name || 'Unknown',
      continent: geo.continent_code || 'Unknown',
      city: geo.city || 'Unknown',
      ip_address: geo.ip || '',
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  } catch {
    await supabase.from('visitors').insert({
      page_visited: page,
      country: 'Unknown',
      continent: 'Unknown',
      user_agent: navigator.userAgent,
    });
  }
};

export const trackClick = async (element: string, page: string) => {
  await supabase.from('click_tracking').insert({ element, page });
};

export const logActivity = async (action: string, category: string = 'general', details?: any) => {
  await supabase.from('activity_logs').insert({ action, category, details });
};
