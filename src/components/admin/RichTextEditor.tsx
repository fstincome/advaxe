import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Heading2, Heading3, ImagePlus,
  Italic, Link2, List, ListOrdered, Quote, Redo2, RemoveFormatting, UnderlineIcon, Undo2, Unlink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { legacyContentToHtml } from '@/lib/richText';
import MediaPicker from './MediaPicker';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

interface ToolProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Tool({ label, active, disabled, onClick, children }: ToolProps) {
  return (
    <Button type="button" size="icon" variant={active ? 'secondary' : 'ghost'} disabled={disabled}
      className="h-8 w-8 rounded-sm" title={label} aria-label={label} onClick={onClick}>
      {children}
    </Button>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const imageSelection = useRef<{ from: number; to: number } | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: legacyContentToHtml(value),
    editorProps: { attributes: { class: 'rich-editor-content editorial-copy' } },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const next = legacyContentToHtml(value);
    if (editor.getHTML() !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;

  const editLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const href = window.prompt('Adresse du lien', previous ?? 'https://');
    if (href === null) return;
    if (!href.trim()) { editor.chain().focus().unsetLink().run(); return; }
    const newTab = window.confirm('Ouvrir ce lien dans un nouvel onglet ?');
    editor.chain().focus().extendMarkRange('link').setLink({ href: href.trim(), target: newTab ? '_blank' : null }).run();
  };

  const insertImage = () => {
    if (!pendingImage) return;
    const chain = editor.chain().focus();
    if (imageSelection.current) chain.setTextSelection(imageSelection.current);
    chain.setImage({ src: pendingImage, alt: altText, title: caption || altText });
    if (caption.trim()) chain.insertContent({ type: 'paragraph', content: [{ type: 'text', text: caption.trim(), marks: [{ type: 'italic' }] }] });
    chain.run();
    setPendingImage('');
    setAltText('');
    setCaption('');
    setMediaOpen(false);
  };

  const openImagePicker = () => {
    imageSelection.current = { from: editor.state.selection.from, to: editor.state.selection.to };
    setPendingImage('');
    setAltText('');
    setCaption('');
    setMediaOpen(true);
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar" role="toolbar" aria-label="Mise en forme du contenu">
        <Tool label="Annuler" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 /></Tool>
        <Tool label="Rétablir" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 /></Tool>
        <span className="rich-editor-separator" />
        <Tool label="Titre 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 /></Tool>
        <Tool label="Titre 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 /></Tool>
        <Tool label="Gras" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></Tool>
        <Tool label="Italique" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></Tool>
        <Tool label="Souligné" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon /></Tool>
        <span className="rich-editor-separator" />
        <Tool label="Liste à puces" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></Tool>
        <Tool label="Liste numérotée" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></Tool>
        <Tool label="Citation" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></Tool>
        <Tool label="Aligner à gauche" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft /></Tool>
        <Tool label="Centrer" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter /></Tool>
        <Tool label="Aligner à droite" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight /></Tool>
        <span className="rich-editor-separator" />
        <Tool label="Ajouter ou modifier un lien" active={editor.isActive('link')} onClick={editLink}><Link2 /></Tool>
        <Tool label="Retirer le lien" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}><Unlink /></Tool>
        <Tool label="Insérer une image" onClick={openImagePicker}><ImagePlus /></Tool>
        <Tool label="Effacer la mise en forme" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting /></Tool>
      </div>
      <EditorContent editor={editor} />

      <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto" aria-describedby={undefined}
          onCloseAutoFocus={(event) => { event.preventDefault(); editor.commands.focus(undefined, { scrollIntoView: false }); }}>
          <DialogHeader><DialogTitle>Insérer une image</DialogTitle></DialogHeader>
          <MediaPicker inline value={pendingImage} onChange={setPendingImage} accept="image/*" label="Choisir une autre image" />
          {pendingImage && <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="article-image-alt" className="text-sm">Texte alternatif</label>
              <input id="article-image-alt" className="w-full border border-input bg-background px-3 py-2 text-sm" value={altText}
                onChange={(event) => setAltText(event.target.value)} />
            </div>
            <div className="space-y-1">
              <label htmlFor="article-image-caption" className="text-sm">Légende (facultative)</label>
              <input id="article-image-caption" className="w-full border border-input bg-background px-3 py-2 text-sm" value={caption}
                onChange={(event) => setCaption(event.target.value)} />
            </div>
          </div>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setMediaOpen(false)}>Annuler</Button>
            <Button type="button" disabled={!pendingImage} onClick={insertImage}>Insérer l’image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}