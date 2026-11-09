import { beforeEach, describe, expect, it, vi } from 'vitest';

const invoke = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));

describe('public visit tracking', () => {
  beforeEach(() => { vi.resetModules(); invoke.mockClear(); localStorage.clear(); });
  it('does not count authentication and dashboard views', async () => {
    const { trackVisit } = await import('./useAnalytics');
    await trackVisit('/dashboard'); await trackVisit('/auth');
    expect(invoke).not.toHaveBeenCalled();
  });
  it('counts one view per route change and retains the anonymous visitor identity', async () => {
    const { trackVisit } = await import('./useAnalytics');
    await trackVisit('/en/ideas/example'); await trackVisit('/en/ideas/example');
    await trackVisit('/fr/ideas/example');
    expect(invoke).toHaveBeenCalledTimes(2);
    const first = invoke.mock.calls[0][1].body;
    const second = invoke.mock.calls[1][1].body;
    expect(first.page).toBe('/en/ideas/example');
    expect(first.anonymous_id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(second.anonymous_id).toBe(first.anonymous_id);
  });
});