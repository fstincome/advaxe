import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/usePortfolioData';
import { useArticles } from '@/hooks/useProfessionalContent';

const tickerLabels: Record<string, string> = { en: 'Last posts', fr: 'Derniers articles', sw: 'Makala mpya', rn: 'Ingingo nshya' };

export default function PostsTicker() {
  const { lang } = useLanguage();
  const { data: copy } = useSiteContent();
  const { data: articles } = useArticles();
  if (!articles?.length) return null;

  const label = copy?.['last_posts'] || tickerLabels[lang] || tickerLabels.en;
  const posts = articles.slice(0, 8);
  const items = [...posts, ...posts];

  return (
    <div className="posts-ticker">
      <div className="site-shell flex items-center gap-5">
        <span className="ticker-label">{label}</span>
        <div className="ticker-viewport" aria-label={label}>
          <div className="ticker-track">
            {items.map((article, index) => (
              <Link key={`${article.id}-${index}`} to={`/${lang}/ideas/${article.slug || article.id}`} className="ticker-item" tabIndex={index >= posts.length ? -1 : 0}>
                <span>{article.title}</span>
                <span className="ticker-sep" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
