import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type AnalyticsSummary = {
  views: number; unique_visitors: number; legacy_views: number;
  activity_count: number; click_count: number;
  pages: { path: string; views: number; unique_visitors: number; legacy_views: number; last_visit: string | null; title: string | null; article: boolean }[];
  countries: { name: string; views: number }[];
  continents: { name: string; views: number }[];
};

export const useDashboardAnalytics = (days: number | null) => useQuery({
  queryKey: ['dashboard-analytics', days],
  queryFn: async () => {
    const { data, error } = await supabase.rpc('dashboard_analytics', { days: days ?? undefined });
    if (error) throw error;
    return data as unknown as AnalyticsSummary;
  },
  refetchInterval: 15000,
  refetchOnWindowFocus: true,
});

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
    if (!/^\/(en|fr|sw|rn)(\/|$)/.test(page)) return;
    // Avoid duplicate effect calls without hiding genuine reloads or return visits.
    if (lastTracked?.page === page && Date.now() - lastTracked.at < 1500) return;
    let anonymousId: string | null = null;
    try {
      anonymousId = localStorage.getItem('advaxe-visitor-id');
      if (!anonymousId || !/^[0-9a-f-]{36}$/i.test(anonymousId)) {
        anonymousId = crypto.randomUUID();
        localStorage.setItem('advaxe-visitor-id', anonymousId);
      }
    } catch { /* Page views still work with browser storage disabled. */ }
    lastTracked = { page, at: Date.now() };
    const { error } = await supabase.functions.invoke('track-visit', {
      body: { page, anonymous_id: anonymousId, referrer: document.referrer || null },
    });
    if (error) lastTracked = null;
  } catch { /* Tracking must never block the page. */ }
};

let lastTracked: { page: string; at: number } | null = null;

export const trackClick = async (element: string, page: string) => {
  await supabase.from('click_tracking').insert({ element, page });
};

export const logActivity = async (action: string, category: string = 'general', details?: Record<string, unknown>) => {
  await supabase.from('activity_logs').insert({ action, category, details: details as Json | undefined });
};
