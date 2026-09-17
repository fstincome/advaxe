import { useState } from 'react';
import { Mail, Phone, MessageCircle, Send, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePersonalInfo, useSocialLinks, useSiteContent } from '@/hooks/usePortfolioData';
import { toast } from 'sonner';

const socialLabel = (platform: string) => platform;

export default function ContactPage() {
  const { lang } = useLanguage();
  const { data: copy } = useSiteContent();
  const { data: info } = usePersonalInfo();
  const { data: socials } = useSocialLinks();
  const [form, setForm] = useState({ name: '', email: '', inquiry_type: 'project', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const email = info?.email || 'advaxen@gmail.com';
  const phone = info?.phone || '+25769898947';
  const whatsapp = info?.whatsapp || phone;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    const { error } = await supabase.from('contact_messages').insert({ ...form, lang });
    setSending(false);
    if (error) return toast.error('Unable to send your message.');
    toast.success('Message sent.');
    setForm({ name: '', email: '', inquiry_type: 'project', subject: '', message: '' });
  };

  const field = "w-full border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary rounded-none";

  return (
    <section className="page-section">
      <div className="site-shell">
        <header className="page-intro">
          <p className="eyebrow">Contact</p>
          <h1>{copy?.contact_title || 'Let’s build something meaningful.'}</h1>
          <p>{copy?.contact_intro}</p>
        </header>

        <div className="contact-layout">
          {/* Contact details */}
          <div className="contact-details space-y-6">
            <div className="contact-card">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="eyebrow">Email</p>
                <a className="block text-lg font-medium hover:text-primary" href={`mailto:${email}`}>{email}</a>
              </div>
            </div>

            <div className="contact-card">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="eyebrow">Call</p>
                <a className="block text-lg font-medium hover:text-primary" href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
              </div>
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="contact-pill"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            <div className="contact-card">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="eyebrow">Location</p>
                <p className="text-lg font-medium">Gitega, Burundi</p>
                <p className="text-sm text-muted-foreground">Available for selected global collaborations.</p>
              </div>
            </div>

            {socials?.length ? (
              <div className="contact-card">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="eyebrow">Networks</p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {socials.map((social) => (
                      <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="contact-pill">
                        {socialLabel(social.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Clean form */}
          <form className="contact-form" onSubmit={submit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</span>
                <input required minLength={2} maxLength={100} className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</span>
                <input required type="email" maxLength={254} className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Inquiry</span>
              <select className={field} value={form.inquiry_type} onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}>
                <option value="project">Product / project</option>
                <option value="partnership">Partnership</option>
                <option value="speaking">Speaking</option>
                <option value="training">Training</option>
                <option value="bitcoin">Bitcoin / Lightning</option>
                <option value="media">Media</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Subject</span>
              <input maxLength={180} className={field} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Message</span>
              <textarea required minLength={10} maxLength={5000} rows={7} className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
            <Button type="submit" size="lg" disabled={sending}>
              {sending ? 'Sending…' : copy?.send_message || 'Send inquiry'} <Send />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
