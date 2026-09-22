import DOMPurify from 'dompurify';

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const isHtmlContent = (value: string) => /<([a-z][\w-]*)(?:\s[^>]*)?>/i.test(value);

export function legacyContentToHtml(value: string): string {
  if (!value.trim()) return '';
  if (isHtmlContent(value)) return value;

  return value.split(/\n{2,}/).filter(Boolean).map((block) => {
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const alt = escapeHtml(image[1] ?? '');
      const src = escapeHtml(image[2] ?? '');
      return `<figure><img src="${src}" alt="${alt}">${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure>`;
    }

    const lines = block.split('\n');
    if (lines.every((line) => line.startsWith('- '))) {
      return `<ul>${lines.map((line) => `<li>${escapeHtml(line.slice(2))}</li>`).join('')}</ul>`;
    }
    if (lines.every((line) => /^\d+\. /.test(line))) {
      return `<ol>${lines.map((line) => `<li>${escapeHtml(line.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
    }
    if (block.startsWith('### ')) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
    if (block.startsWith('## ')) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
    if (block.startsWith('# ')) return `<h2>${escapeHtml(block.slice(2))}</h2>`;
    if (block.startsWith('> ')) return `<blockquote><p>${escapeHtml(block.slice(2))}</p></blockquote>`;
    return `<p>${lines.map(escapeHtml).join('<br>')}</p>`;
  }).join('');
}

export function sanitizeRichText(value: string): string {
  return DOMPurify.sanitize(legacyContentToHtml(value), {
    ALLOWED_TAGS: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'a', 'figure', 'img', 'figcaption'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
  });
}