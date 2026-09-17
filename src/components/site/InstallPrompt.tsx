import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const COPY: Record<string, { title: string; body: string; ios: string; install: string; later: string }> = {
  en: { title: 'Install Advaxe', body: 'Add this site to your home screen for quick access.', ios: 'Tap Share, then "Add to Home Screen".', install: 'Install', later: 'Not now' },
  fr: { title: "Installer Advaxe", body: "Ajoutez ce site à votre écran d'accueil pour un accès rapide.", ios: 'Touchez Partager, puis « Sur l\u2019écran d\u2019accueil ».', install: 'Installer', later: 'Plus tard' },
  sw: { title: 'Sakinisha Advaxe', body: 'Ongeza tovuti hii kwenye skrini yako ya nyumbani.', ios: 'Gusa Shiriki, kisha "Add to Home Screen".', install: 'Sakinisha', later: 'Baadaye' },
  rn: { title: 'Shira Advaxe', body: 'Shira uru rubuga ku rupapuro rwawe rw\u2019itangiriro.', ios: 'Kanda Share, hanyuma "Add to Home Screen".', install: 'Shira', later: 'Ubutaha' },
};

const DISMISS_KEY = 'advaxe-install-dismissed';

export const InstallPrompt = () => {
  const { lang: language } = useLanguage();
  const copy = COPY[language] ?? COPY.en;
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === '1') return;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone;
    if (standalone) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as InstallEvent);
      setOpen(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let timer: number | undefined;
    if (isIos) {
      timer = window.setTimeout(() => { setIosHint(true); setOpen(true); }, 2500);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  if (!open) return null;

  return (
    <div className="install-prompt" role="dialog" aria-label={copy.title}>
      <img src="/icon-192.png" alt="" className="install-prompt-icon" />
      <div className="install-prompt-body">
        <p className="install-prompt-title">{copy.title}</p>
        <p className="install-prompt-text">{iosHint ? copy.ios : copy.body}</p>
      </div>
      {!iosHint && deferred ? (
        <button type="button" onClick={install} className="install-prompt-cta">
          <Download className="h-4 w-4" /> {copy.install}
        </button>
      ) : (
        <span className="install-prompt-cta" aria-hidden><Share className="h-4 w-4" /></span>
      )}
      <button type="button" onClick={dismiss} className="install-prompt-close" aria-label={copy.later}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default InstallPrompt;
