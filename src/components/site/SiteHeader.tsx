import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Globe2, Menu, Moon, Sun, X } from 'lucide-react';
import { buildTree, isExternal, useSiteMenu, MenuItem } from '@/lib/siteMenu';
import { Button } from '@/components/ui/button';
import { LANGUAGES, useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSiteContent } from '@/hooks/usePortfolioData';



export default function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const { data: copy } = useSiteContent();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const label = (key: string) => copy?.[key] || t(key);
  const { data: menu } = useSiteMenu();
  const tree = buildTree(menu ?? []);
  const itemLabel = (item: MenuItem) => item.labels[lang] || item.labels.en || (item.labelKey ? label(item.labelKey) : item.path);
  const itemLink = (item: MenuItem, className: string, onClick?: () => void) => isExternal(item.path)
    ? <a key={item.id} href={item.path} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>{itemLabel(item)}</a>
    : <Link key={item.id} to={`/${lang}/${item.path}`} className={className} onClick={onClick}>{itemLabel(item)}</Link>;
  const changeLanguage = (next: typeof lang) => {
    setLang(next);
    navigate(location.pathname.replace(/^\/(en|fr|sw|rn)(?=\/|$)/, `/${next}`));
    setOpen(false);
  };
  // Kirundi hidden from the public language menu for now (still editable in the dashboard)
  const publicLanguages = LANGUAGES.filter((language) => language.code !== 'rn');

  return <header className="site-header">
    <div className="site-shell flex h-20 items-center justify-between">
      <Link to={`/${lang}`} className="flex items-center gap-3" aria-label="Advaxe Ndayisenga home">
        <img src="/advaxe-profile.jpeg" alt="Advaxe Ndayisenga" className="brand-photo" /><span className="font-display text-lg font-semibold">Advaxe Ndayisenga</span>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
        {tree.map((item) => item.children.length === 0 ? itemLink(item, 'nav-link') : (
          <div key={item.id} className="group relative">
            <span className="flex items-center gap-1">{itemLink(item, 'nav-link')}<ChevronDown className="h-3 w-3 text-muted-foreground" /></span>
            <div className="invisible absolute left-0 top-full z-50 min-w-48 border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {item.children.map((child) => itemLink(child, 'block px-3 py-2 text-sm hover:bg-secondary'))}
            </div>
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-1">
        <div className="group relative hidden sm:block">
          <Button variant="ghost" size="sm"><Globe2 /> {lang.toUpperCase()}</Button>
          <div className="invisible absolute right-0 top-full z-50 min-w-40 border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
            {publicLanguages.map((language) => <button key={language.code} onClick={() => changeLanguage(language.code)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary"><span>{language.flag}</span>{language.label}</button>)}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</Button>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</Button>
      </div>
    </div>
    {open && <nav className="border-t border-border bg-background px-4 py-5 lg:hidden">
      {tree.map((item) => <div key={item.id}>
        {itemLink(item, 'block border-b border-border py-3 text-sm', () => setOpen(false))}
        {item.children.map((child) => itemLink(child, 'block border-b border-border py-3 pl-5 text-sm text-muted-foreground', () => setOpen(false)))}
      </div>)}
      <div className="mt-4 flex flex-wrap gap-2">{publicLanguages.map((language) => <Button key={language.code} size="sm" variant={lang === language.code ? 'default' : 'outline'} onClick={() => changeLanguage(language.code)}>{language.code.toUpperCase()}</Button>)}</div>
    </nav>}
  </header>;
}