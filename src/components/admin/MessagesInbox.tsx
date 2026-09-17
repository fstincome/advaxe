import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function MessagesInbox() {
  const queryClient = useQueryClient();
  const { data: messages } = useQuery({
    queryKey: ['admin', 'contact_messages'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'contact_messages'] });
  const markRead = async (id: string) => { await supabase.from('contact_messages').update({ is_read: true }).eq('id', id); refresh(); };
  const remove = async (id: string) => { await supabase.from('contact_messages').delete().eq('id', id); refresh(); };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Messages</h2>
      {(messages ?? []).length === 0 && <p className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No messages yet.</p>}
      {(messages ?? []).map((message) => (
        <article key={message.id} className={`dashboard-card space-y-2 ${message.is_read ? 'opacity-70' : ''}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">{message.name} · <span className="text-muted-foreground">{message.email}</span></p>
              <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()} · {message.inquiry_type} · {message.lang?.toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-3">
              {!message.is_read && <button onClick={() => markRead(message.id)} className="flex items-center gap-1 text-xs text-primary"><Check className="h-3 w-3" /> Mark read</button>}
              <button onClick={() => remove(message.id)} className="flex items-center gap-1 text-xs text-destructive"><Trash2 className="h-3 w-3" /> Delete</button>
            </div>
          </div>
          {message.subject && <p className="text-sm font-medium">{message.subject}</p>}
          <p className="whitespace-pre-line text-sm text-muted-foreground">{message.message}</p>
        </article>
      ))}
    </section>
  );
}
