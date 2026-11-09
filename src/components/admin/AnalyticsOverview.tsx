import { useState } from 'react';
import { RefreshCw, Users, Eye, Activity, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsOverview() {
  const [period, setPeriod] = useState('all');
  const [kind, setKind] = useState('all');
  const { data, error, isPending, isFetching, refetch, dataUpdatedAt } = useDashboardAnalytics(period === 'all' ? null : Number(period));
  const pages = data?.pages.filter(page => kind === 'all' || (kind === 'articles' ? page.article : !page.article)) ?? [];
  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-semibold">Statistiques de fréquentation</h2>
        <p className="text-xs text-muted-foreground">{dataUpdatedAt ? `Actualisé à ${new Date(dataUpdatedAt).toLocaleTimeString('fr-FR')}` : 'Chargement…'}</p></div>
      <div className="flex items-center gap-2">
        <select aria-label="Période des statistiques" value={period} onChange={event => setPeriod(event.target.value)} className="border border-input bg-background px-3 py-2 text-sm">
          <option value="all">Depuis le début</option><option value="1">Dernières 24 heures</option><option value="7">7 derniers jours</option><option value="30">30 derniers jours</option>
        </select>
        <Button variant="outline" size="icon" aria-label="Actualiser les statistiques" title="Actualiser les statistiques" disabled={isFetching} onClick={() => refetch()}><RefreshCw className={isFetching ? 'animate-spin' : ''} /></Button>
      </div>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">Les statistiques n’ont pas pu être chargées. Réessayez avec le bouton d’actualisation.</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Pages vues', value: data?.views, icon: Eye },
        { label: 'Visiteurs uniques mesurés', value: data?.unique_visitors, icon: Users },
        { label: 'Activités enregistrées', value: data?.activity_count, icon: Activity },
        { label: 'Clics enregistrés', value: data?.click_count, icon: MousePointer },
      ].map(({ label, value, icon: Icon }) => <div key={label} className="dashboard-card"><div className="mb-2 flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /><h3 className="text-sm font-medium">{label}</h3></div><p className="text-3xl font-bold">{value === undefined ? '—' : value.toLocaleString('fr-FR')}</p></div>)}
    </div>
    <p className="text-xs text-muted-foreground">Les visiteurs uniques correspondent aux navigateurs identifiés, pas à des personnes certifiées. {data?.legacy_views ? `${data.legacy_views.toLocaleString('fr-FR')} vues anciennes sans identifiant : leur nombre de visiteurs uniques est inconnu.` : ''} Les robots connus sont exclus. Activités et clics : totaux depuis le début.</p>
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Pages et articles visités</h3>
      <select aria-label="Type de page" value={kind} onChange={event => setKind(event.target.value)} className="border border-input bg-background px-3 py-2 text-sm"><option value="all">Toutes les pages</option><option value="articles">Articles</option><option value="pages">Autres pages</option></select>
    </div>
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-muted"><tr><th className="px-4 py-3">Page / article</th><th className="px-4 py-3 text-right">Vues</th><th className="px-4 py-3 text-right">Visiteurs uniques mesurés</th><th className="px-4 py-3">Dernière visite</th></tr></thead>
        <tbody>{pages.map(page => <tr key={page.path} className="border-t border-border"><td className="px-4 py-3"><a href={`/en${page.path === '/' ? '' : page.path}`} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">{page.title || (page.path === '/' ? 'Accueil' : page.path)}</a><p className="text-xs text-muted-foreground">{page.article ? 'Article' : 'Page'} · {page.path}</p></td><td className="px-4 py-3 text-right tabular-nums">{page.views.toLocaleString('fr-FR')}</td><td className="px-4 py-3 text-right tabular-nums">{page.unique_visitors === 0 && page.legacy_views > 0 ? '—' : page.unique_visitors.toLocaleString('fr-FR')}</td><td className="px-4 py-3 text-xs text-muted-foreground">{page.last_visit ? new Date(page.last_visit).toLocaleString('fr-FR') : '—'}</td></tr>)}
          {pages.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{isPending ? 'Chargement…' : 'Aucune visite enregistrée pour cette sélection.'}</td></tr>}
        </tbody></table>
    </div>
    <div className="grid gap-6 md:grid-cols-2">{[{ title: 'Vues par pays', rows: data?.countries }, { title: 'Vues par continent', rows: data?.continents }].map(group => <section key={group.title} className="border-t border-border pt-4"><h3 className="mb-3 font-semibold">{group.title}</h3><div className="max-h-64 space-y-2 overflow-y-auto">{group.rows?.map(row => <div key={row.name} className="flex justify-between gap-4 text-sm"><span>{row.name === 'Unknown' ? 'Localisation inconnue' : row.name}</span><span className="tabular-nums text-muted-foreground">{row.views.toLocaleString('fr-FR')}</span></div>)}</div></section>)}</div>
  </section>;
}