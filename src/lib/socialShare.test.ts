import { describe, expect, it } from 'vitest';
import { articleImage, sharePage } from './socialShare';

describe('article share image selection', () => {
  it('uses the featured photo ahead of inline photos', () => {
    expect(articleImage('https://example.org/cover.jpg', '<img src="https://example.org/inline.jpg">')).toBe('https://example.org/cover.jpg');
  });
  it('uses a real inline photo when no featured photo is set', () => {
    expect(articleImage(null, '<p>Article</p><img src="https://example.org/real.jpg?a=1&amp;b=2">')).toBe('https://example.org/real.jpg?a=1&b=2');
  });
  it('does not invent an article photo', () => {
    expect(articleImage(null, '<p>No image</p>')).toBeNull();
  });
});

describe('safe social share documents', () => {
  it('escapes author content and prevents script injection', () => {
    const html = sharePage({ lang: 'fr', title: '<script>unsafe</script>', description: '" onload="bad', image: 'https://example.org/a.jpg', shareUrl: 'https://example.org/share.html', articleUrl: 'https://example.org/</script>' });
    expect(html).not.toContain('<script>unsafe</script>');
    expect(html).not.toContain('window.location.replace("https://example.org/</script>');
    expect(html).toContain('\\u003c/script>');
  });
});