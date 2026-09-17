import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe2, Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LANGUAGES, useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSiteContent } from '@/hooks/usePortfolioData';

const routes = [
  ['nav_about', 'about'], ['nav_expertise', 'expertise'], ['nav_work', 'work'],
  ['nav_ideas', 'ideas'], ['experience', 'experience'], ['nav_contact', 'contact'],
];

export default function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const { data: copy } = useSiteContent();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const label = (key: string) => copy?.[key] || t(key);
  const changeLanguage = (next: typeof lang) => {
    setLang(next);
    navigate(location.pathname.replace(/^\/(en|fr|sw|rn)(?=\/|$)/, `/${next}`));
    setOpen(false);
  };

  return <header className="site-header">
    <div className="site-shell flex h-20 items-center justify-between">
      <Link to={`/${lang}`} className="flex items-center gap-3" aria-label="Advaxe home">
        <span className="brand-mark">A</span><span className="font-display text-lg font-semibold">Advaxe</span>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
        {routes.map(([key, path]) => <Link key={path} to={`/${lang}/${path}`} className="nav-link">{label(key)}</Link>)}
      </nav>
      <div className="flex items-center gap-1">
        <div className="group relative hidden sm:block">
          <Button variant="ghost" size="sm"><Globe2 /> {lang.toUpperCase()}</Button>
          <div className="invisible absolute right-0 top-full z-50 min-w-40 border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
            {LANGUAGES.map((language) => <button key={language.code} onClick={() => changeLanguage(language.code)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary"><span>{language.flag}</span>{language.label}</button>)}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</Button>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</Button>
      </div>
    </div>
    {open && <nav className="border-t border-border bg-background px-4 py-5 lg:hidden">
      {routes.map(([key, path]) => <Link key={path} onClick={() => setOpen(false)} to={`/${lang}/${path}`} className="block border-b border-border py-3 text-sm">{label(key)}</Link>)}
      <div className="mt-4 flex flex-wrap gap-2">{LANGUAGES.map((language) => <Button key={language.code} size="sm" variant={lang === language.code ? 'default' : 'outline'} onClick={() => changeLanguage(language.code)}>{language.code.toUpperCase()}</Button>)}</div>
    </nav>}
  </header>;
}