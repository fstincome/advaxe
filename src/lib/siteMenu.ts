import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuItem {
  id: string;
  path: string; // internal page key like "about" or full https URL
  labels: Partial<Record<'en' | 'fr' | 'sw' | 'rn', string>>;
  labelKey?: string; // fallback translation key
  visible: boolean;
  parent: string | null;
}

export const MENU_SETTING_KEY = 'site_menu';

export const PAGE_OPTIONS = [
  ['about', 'About'], ['expertise', 'Expertise'], ['work', 'Work'], ['ideas', 'Ideas / Publications'],
  ['experience', 'Experience'], ['credentials', 'Certifications & skills'], ['readings', 'Readings'],
  ['speaking', 'Speaking'], ['community', 'Community'], ['media', 'Media'], ['contact', 'Contact'],
] as const;

export const DEFAULT_MENU: MenuItem[] = [
  ['nav_about', 'about'], ['nav_expertise', 'expertise'], ['nav_work', 'work'],
  ['nav_ideas', 'ideas'], ['experience', 'experience'], ['skills', 'credentials'],
  ['readings', 'readings'], ['nav_contact', 'contact'],
].map(([labelKey, path]) => ({ id: path, path, labelKey, labels: {}, visible: true, parent: null }));

export function parseMenu(value?: string | null): MenuItem[] {
  if (!value) return DEFAULT_MENU;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : DEFAULT_MENU;
  } catch { return DEFAULT_MENU; }
}

/** Visible top-level items with their visible children, in saved order. */
export function buildTree(items: MenuItem[]) {
  const visible = items.filter((item) => item.visible);
  const ids = new Set(visible.map((item) => item.id));
  return visible
    .filter((item) => !item.parent || !ids.has(item.parent))
    .map((item) => ({ ...item, children: visible.filter((child) => child.parent === item.id) }));
}

export const isExternal = (path: string) => /^https?:\/\//.test(path);

export function useSiteMenu() {
  return useQuery({
    queryKey: ['site-menu'],
    queryFn: async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('setting_key', MENU_SETTING_KEY).maybeSingle();
      return parseMenu(data?.value);
    },
    staleTime: 60_000,
  });
}
