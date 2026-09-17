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
    await supabase.functions.invoke('track-visit', {
      body: { page, referrer: document.referrer || null },
    });
  } catch { /* Tracking must never block the page. */ }
};

export const trackClick = async (element: string, page: string) => {
  await supabase.from('click_tracking').insert({ element, page });
};

export const logActivity = async (action: string, category: string = 'general', details?: Record<string, unknown>) => {
  await supabase.from('activity_logs').insert({ action, category, details });
};
