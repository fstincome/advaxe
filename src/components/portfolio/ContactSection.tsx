import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { usePersonalInfo } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';
import { logActivity } from '@/hooks/useAnalytics';

const ContactSection = () => {
  const { t } = useLanguage();
  const { data: info } = usePersonalInfo();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logActivity('contact_form', 'contact', form);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="bg-secondary/30">
      <div className="section-container">
        <h2 className="section-title">{t('contact')}</h2>
        <div className="w-16 h-1 rounded-full bg-primary mb-12" />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('email')}</p>
                <p className="font-medium text-sm">{info?.email || 'advaxe@latechburundi.bi'}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('phone')}</p>
                <p className="font-medium text-sm">{info?.phone || '+257 69 89 89 47'}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('address')}</p>
                <p className="font-medium text-sm">{info?.address || 'Gitega-Burundi'}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder={t('name_label')} required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                <input type="email" placeholder={t('email')} required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <input type="text" placeholder={t('subject')} value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              <textarea rows={5} placeholder={t('message')} required value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" />
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                {sent ? '✓' : t('send_message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
