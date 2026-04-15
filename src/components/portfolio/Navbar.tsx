import React from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage, LANGUAGES } from '@/contexts/LanguageContext';
import { useState } from 'react';

const Navbar = () => {
  const { dark, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = ['about_me', 'skills', 'experience', 'services', 'projects', 'contact'];
  const anchors = ['about', 'skills', 'experience', 'services', 'projects', 'contact'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#" className="text-xl font-bold gradient-text font-['Space_Grotesk']">Advaxe</a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((key, i) => (
            <a key={key} href={`#${anchors[i]}`} className="nav-link">{t(key)}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 nav-link">
              <Globe className="w-4 h-4" />
              <span className="text-xs uppercase">{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors flex items-center gap-2 ${lang === l.code ? 'text-primary font-medium' : 'text-foreground'}`}
                  >
                    <span>{l.flag}</span> {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggle} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            {dark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-foreground transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border py-4 px-4 space-y-2">
          {links.map((key, i) => (
            <a key={key} href={`#${anchors[i]}`} onClick={() => setMobileOpen(false)} className="block nav-link py-2">{t(key)}</a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
