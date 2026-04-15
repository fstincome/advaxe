import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const links = ['about_me', 'skills', 'experience', 'services', 'projects'];
  const anchors = ['about', 'skills', 'experience', 'services', 'projects'];

  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Copyrights 2026 © <span className="gradient-text font-semibold">Advaxe N.</span> | {t('all_rights')}
        </p>
        <div className="flex gap-6">
          {links.map((key, i) => (
            <a key={key} href={`#${anchors[i]}`} className="nav-link text-xs">{t(key)}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
