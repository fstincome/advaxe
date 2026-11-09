export const SITE_ORIGIN = 'https://advaxe.lovable.app';
export const SHARE_LANGUAGES = ['en', 'fr', 'sw', 'rn'] as const;

export function articleImage(cover: string | null | undefined, content: string) {
  return cover || content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g, '&') || null;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] ?? character));
}

export function sharePage({ lang, title, description, image, shareUrl, articleUrl }: {
  lang: string; title: string; description: string; image: string; shareUrl: string; articleUrl: string;
}) {
  const text = escapeHtml;
  // No HTTP or meta-refresh redirect: social crawlers must read this page's tags.
  const redirect = JSON.stringify(articleUrl).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="${text(lang)}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${text(title)} | Advaxe Ndayisènga</title>
<meta name="description" content="${text(description)}">
<link rel="canonical" href="${text(shareUrl)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Advaxe Ndayisènga">
<meta property="og:title" content="${text(title)}">
<meta property="og:description" content="${text(description)}">
<meta property="og:url" content="${text(shareUrl)}">
<meta property="og:image" content="${text(image)}">
<meta property="og:image:secure_url" content="${text(image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${text(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${text(title)}">
<meta name="twitter:description" content="${text(description)}">
<meta name="twitter:image" content="${text(image)}">
<meta name="twitter:image:alt" content="${text(title)}">
</head><body><h1><a href="${text(articleUrl)}">${text(title)}</a></h1>
<a href="${text(articleUrl)}"><img src="${text(image)}" alt="${text(title)}" width="1200" height="630"></a>
<p>${text(description)}</p><script>window.location.replace(${redirect});</script></body></html>`;
}