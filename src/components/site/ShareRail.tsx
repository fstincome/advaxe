import { useEffect, useState } from 'react';
import { Link2, MessageCircle } from 'lucide-react';
const txt = (s: string) => ({ className }: { className?: string }) => <span className={`${className} flex items-center justify-center text-[13px] font-bold leading-none`}>{s}</span>;
const Facebook = txt('f'); const Linkedin = txt('in'); const Twitter = txt('𝕏');
import { toast } from '@/hooks/use-toast';

export default function ShareRail({ title }: { title: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${t}%20${u}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'X / Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); toast({ title: 'Link copied' }); } catch { /* ignore */ }
  };
  const visible = progress > 0.04;
  const btn = 'flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary';

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-transparent" aria-hidden>
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>
      <aside aria-label="Share"
        className={`fixed bottom-6 left-4 z-40 flex flex-col items-center gap-2 transition-all duration-300 max-md:bottom-3 max-md:left-1/2 max-md:-translate-x-1/2 max-md:flex-row max-md:rounded-full max-md:border max-md:border-border max-md:bg-background/95 max-md:px-3 max-md:py-2 max-md:shadow-lg ${visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
        <span className="text-[10px] font-semibold tabular-nums text-primary max-md:hidden">{Math.round(progress * 100)}%</span>
        {links.map(({ label, icon: Icon, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${label}`} title={label} className={btn}><Icon className="h-4 w-4" /></a>
        ))}
        <button type="button" onClick={copy} aria-label="Copy link" title="Copy link" className={btn}><Link2 className="h-4 w-4" /></button>
      </aside>
    </>
  );
}
