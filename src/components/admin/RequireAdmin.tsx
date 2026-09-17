import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>('loading');
  useEffect(() => { let active = true; supabase.auth.getSession().then(async ({ data }) => { if (!data.session) { if (active) setState('denied'); return; } const { data: allowed } = await supabase.rpc('has_role', { _user_id: data.session.user.id, _role: 'admin' }); if (active) setState(allowed ? 'allowed' : 'denied'); }); return () => { active = false; }; }, []);
  if (state === 'loading') return <div className="grid min-h-screen place-items-center bg-background"><div className="status-dot" /></div>;
  if (state === 'denied') return <Navigate to="/auth" replace />;
  return <>{children}</>;
}