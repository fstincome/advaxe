import { useEffect } from 'react';

const isFormField = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
};

// Deters casual copying: blocks right-click, text selection, copy/cut,
// drag and common view-source/save shortcuts. Form fields stay usable.
const ContentProtection = () => {
  useEffect(() => {
    const block = (event: Event) => {
      if (isFormField(event.target)) return;
      event.preventDefault();
    };
    const blockKeys = (event: KeyboardEvent) => {
      if (isFormField(event.target)) return;
      const key = event.key.toLowerCase();
      const combo = (event.ctrlKey || event.metaKey) && ['s', 'p', 'u', 'c', 'x'].includes(key);
      const devtools = event.key === 'F12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));
      if (combo || devtools) event.preventDefault();
    };

    document.addEventListener('contextmenu', block);
    document.addEventListener('selectstart', block);
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('dragstart', block);
    document.addEventListener('keydown', blockKeys);
    document.body.classList.add('content-protected');

    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('selectstart', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('dragstart', block);
      document.removeEventListener('keydown', blockKeys);
      document.body.classList.remove('content-protected');
    };
  }, []);

  return null;
};

export default ContentProtection;
