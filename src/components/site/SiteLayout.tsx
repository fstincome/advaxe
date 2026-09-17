import { Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { Lang, useLanguage } from '@/contexts/LanguageContext';
import { trackVisit } from '@/hooks/useAnalytics';

const supported = new Set(['en', 'fr', 'sw', 'rn']);

export default function SiteLayout() {
  const { lang: routeLang } = useParams();
  const { setLang } = useLanguage();
  const location = useLocation();
  useEffect(() => { if (routeLang && supported.has(routeLang)) setLang(routeLang as Lang); }, [routeLang, setLang]);
  useEffect(() => { trackVisit(location.pathname); }, [location.pathname]);
  if (!routeLang || !supported.has(routeLang)) return <Navigate to="/en" replace />;
  return <div className="min-h-screen bg-background"><SiteHeader /><main><Outlet /></main><SiteFooter /></div>;
}