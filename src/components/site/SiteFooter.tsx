import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePersonalInfo, useSocialLinks } from '@/hooks/usePortfolioData';

export default function SiteFooter() {
  const { lang } = useLanguage();
  const { data: info } = usePersonalInfo();
  const { data: socials } = useSocialLinks();
  return <footer className="border-t border-border py-12">
    <div className="site-shell grid gap-8 md:grid-cols-2">
      <div><div className="font-display text-2xl font-semibold">Advaxe Ndayisenga</div><p className="mt-2 max-w-md text-sm text-muted-foreground">Software architect, builder, educator and technology entrepreneur in East Africa.</p></div>
      <div className="flex flex-wrap items-start gap-5 md:justify-end">
        {socials?.map((social) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm hover:text-primary">{social.platform}<ArrowUpRight className="h-3 w-3" /></a>)}
        <a href={`mailto:${info?.email || 'advaxe.mucatcha@gmail.com'}`} className="text-sm hover:text-primary">Email</a>
      </div>
      <div className="text-xs text-muted-foreground">© 2026 Advaxe Ndayisenga. All rights reserved.</div>
      <Link to={`/${lang}/contact`} className="text-xs text-muted-foreground md:text-right">Gitega, Burundi · East Africa</Link>
    </div>
  </footer>;
}