// ============================================================
// Administration GSMD — tableau de bord sur le schéma réel db.json
// Champs utilisés : voir server/data/db.json (aucun nom inventé).
// ============================================================
import { useEffect, useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../services/api'
import Icon from '../components/Icons'
import KpiCard from '../components/admin/KpiCard'
import DataTable from '../components/admin/DataTable'
import StatusBadge from '../components/admin/StatusBadge'
import SlideOverDrawer from '../components/admin/SlideOverDrawer'
import ConfirmModal from '../components/admin/ConfirmModal'
import Toast from '../components/admin/Toast'
import SmartPhotoGrid from '../components/admin/SmartPhotoGrid'
import type { Photo } from '../services/photos'
import { suggestSection } from '../services/photos'
import { getAdminToken, loginAdmin, logoutAdmin } from '../services/adminAuth'

type Inscription = { id: string; reference: string; elevePrenom: string; eleveNom: string; naissance: string; classe: string; origine: string; parentNom: string; lien: string; email: string; telephone: string; adresse: string; message: string; status: string; createdAt: string }
type Message = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; acceptedConsent: boolean; traite?: boolean; createdAt: string }
type Doc = { id: string; section: string; title: string; url: string; size: number; uploadedAt: string }
type PhotoT = Photo
type Podcast = { id: string; title: string; description: string; duration: string; url: string; size: number; uploadedAt: string }

const TABS = [
  { id: 'overview', label: 'Vue d’ensemble' },
  { id: 'inscriptions', label: 'Pré-inscriptions' },
  { id: 'documents', label: 'Documents' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'photos', label: 'Photos' },
  { id: 'messages', label: 'Messages' },
] as const
type TabId = typeof TABS[number]['id']

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
const fmt = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'
/* Dates relatives pour l'activité récente (libellé humain, pas technique). */
const relativeDate = (d: string) => {
  if (!d) return '—'
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days <= 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return fmt(d)
}
/* Traduction des erreurs Supabase Auth. */
const levelOf = (classe: string) => {
  const c = classe.toLowerCase()
  if (/maternelle|tps|\bps\b|\bms\b|\bgs\b/.test(c)) return 'Maternelle'
  if (/cp|ce1|ce2|cm1|cm2|primaire/.test(c)) return 'Primaire'
  if (/6[eè]|5[eè]|4[eè]|3[eè]|coll[eè]ge/.test(c)) return 'Collège'
  if (/2nde|1[eè]re|1re|tle|terminale|lyc[eè]e/.test(c)) return 'Lycée'
  return 'Autre'
}

const authError = (message: string) => /invalid login credentials/i.test(message)
  ? 'Adresse email ou mot de passe incorrect.'
  : /email not confirmed/i.test(message)
    ? 'Confirmez votre adresse email depuis Supabase.'
    : message

export default function AdminDashboardPage() {
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<TabId>('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [data, setData] = useState<{ inscriptions: Inscription[]; messages: Message[]; documents: Doc[]; podcasts: Podcast[]; photos: PhotoT[] }>({ inscriptions: [], messages: [], documents: [], podcasts: [], photos: [] })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [drawer, setDrawer] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ url: string; label: string } | null>(null)
  const [search, setSearch] = useState('')
  const [filterClasse, setFilterClasse] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [upload, setUpload] = useState({ title: '', section: 'commun', duration: '', description: '', file: null as File | null })

  async function load() {
    setLoading(true)
    const t = await getAdminToken()
    if (!t) { setToken(null); setLoading(false); return }
    const h = authHeaders(t)
    try {
      const me = await fetch(`${API_BASE}/api/auth/me`, { headers: h })
      if (!me.ok) throw new Error('Session invalide')
      const meData = await me.json().catch(() => ({}))
      if (meData.email) setEmail(meData.email)
      const [i, m, d, p, ph] = await Promise.all([
        fetch(`${API_BASE}/api/inscriptions/admin`, { headers: h }).then((r) => r.json()),
        fetch(`${API_BASE}/api/contact/admin`, { headers: h }).then((r) => r.json()),
        fetch(`${API_BASE}/api/documents`, { headers: h }).then((r) => r.json()),
        fetch(`${API_BASE}/api/podcasts`, { headers: h }).then((r) => r.json()),
        fetch(`${API_BASE}/api/photos`, { headers: h }).then((r) => r.json()),
      ])
      setData({ inscriptions: i.items || [], messages: m.messages || [], documents: d.items || [], podcasts: p.items || [], photos: ph.items || [] })
    } catch {
      void logoutAdmin(); setToken(null); setLoginError('Session expirée. Reconnectez-vous.')
    } finally { setLoading(false) }
  }

  /* Restaure la session Supabase au chargement (le SDK rafraîchit le JWT). */
  useEffect(() => { void getAdminToken().then((t) => setToken(t)) }, [])
  useEffect(() => { if (token) void load() }, [token])

  async function login(e: React.FormEvent) {
    e.preventDefault(); setLoginError('')
    try {
      const t = await loginAdmin(email, password)
      setToken(t)
    } catch (err) { setLoginError(authError(err instanceof Error ? err.message : 'Erreur')) }
  }

  async function api(path: string, method: string, body?: unknown, isForm = false) {
    const t = await getAdminToken()
    if (!t) { setToken(null); throw new Error('Session expirée. Reconnectez-vous.') }
    const r = await fetch(`${API_BASE}${path}`, { method, headers: isForm ? { Authorization: `Bearer ${t}` } : authHeaders(t), body: body as BodyInit })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(d.message || 'Erreur réseau')
    return d
  }

  const filteredInscriptions = useMemo(() => data.inscriptions.filter((i) => {
    const q = search.toLowerCase()
    return (!q || [i.reference, i.eleveNom, i.parentNom].some((v) => v?.toLowerCase().includes(q))) &&
      (!filterClasse || i.classe === filterClasse) && (!filterStatut || i.status === filterStatut)
  }), [data.inscriptions, search, filterClasse, filterStatut])

  function exportCsv() {
    const cols: (keyof Inscription)[] = ['reference', 'elevePrenom', 'eleveNom', 'naissance', 'classe', 'parentNom', 'lien', 'email', 'telephone', 'status', 'createdAt']
    const csv = [cols.join(';'), ...filteredInscriptions.map((i) => cols.map((c) => String(i[c] ?? '')).join(';'))].join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'preinscriptions-gsmd.csv'; a.click(); URL.revokeObjectURL(a.href)
  }

  if (!token) return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/images/logo.png" alt="Logo GSMD" className="mx-auto h-16 w-auto" />
          <p className="mt-3 text-xs font-semibold tracking-[0.25em] text-navy-500 uppercase">Groupe Scolaire Daniélou Abidjan</p>
        </div>
        <form onSubmit={login} className="rounded-3xl bg-white p-8 shadow-lg shadow-ink/5 ring-1 ring-navy-100 sm:p-10">
          <h1 className="font-display text-center text-2xl font-semibold text-ink">Administration GSMD</h1>
          <p className="mt-2 text-center text-sm text-ink/90">Espace réservé à l’équipe administrative.</p>
          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="adm-email" className="block text-sm font-semibold text-ink">Adresse email</label>
              <input id="adm-email" name="email" type="email" required autoComplete="username" spellCheck={false} placeholder="admin@madeleinedanielou.ci…" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 min-h-[48px] w-full rounded-xl border border-navy-200 bg-white px-4 text-base text-ink outline-none placeholder:text-ink/60 focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
            </div>
            <div>
              <label htmlFor="adm-pass" className="block text-sm font-semibold text-ink">Mot de passe</label>
              <input id="adm-pass" name="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 min-h-[48px] w-full rounded-xl border border-navy-200 bg-white px-4 text-base text-ink outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
            </div>
          </div>
          {loginError && <p role="alert" className="mt-4 rounded-xl bg-error/10 p-3 text-sm font-medium text-error">{loginError}</p>}
          <button type="submit" className="mt-8 min-h-[48px] w-full rounded-full bg-navy-500 px-6 font-semibold text-white transition-colors hover:bg-navy-600 focus-visible:ring-2 focus-visible:ring-navy-300">Se connecter</button>
        </form>
        <p className="mt-6 text-center text-xs text-ink/90">Accès sécurisé · session chiffrée JWT</p>
      </div>
    </div>
  )

  const counts: Record<TabId, number> = {
    overview: 0,
    inscriptions: data.inscriptions.filter((i) => i.status === 'nouveau' || i.status === 'en_attente').length,
    documents: data.documents.length,
    podcasts: data.podcasts.length,
    photos: data.photos.length,
    messages: data.messages.filter((m) => !m.traite).length,
  }

  const nav = (
    <nav aria-label="Navigation administration" className="flex flex-col gap-1">
      {TABS.map((tabItem) => (
        <button
          key={tabItem.id}
          type="button"
          onClick={() => { setTab(tabItem.id); setMenuOpen(false) }}
          aria-pressed={tab === tabItem.id}
          className={`flex min-h-[44px] items-center justify-between gap-2 rounded-xl px-4 text-left text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-navy-500 ${
            tab === tabItem.id ? 'bg-navy-500 text-white' : 'text-ink hover:bg-navy-50'
          }`}
        >
          <span>{tabItem.label}</span>
          {counts[tabItem.id] > 0 && (
            <span className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-bold tabular-nums ${
              tab === tabItem.id ? 'bg-white text-navy-500' : 'bg-copper-500 text-white'
            }`}>
              {counts[tabItem.id]}
            </span>
          )}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-3xl bg-white p-5 ring-1 ring-navy-100">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="" className="h-11 w-11" />
              <div>
                <p className="font-display text-base font-semibold text-ink">Daniélou Abidjan</p>
                <p className="text-xs font-semibold tracking-wider text-navy-500 uppercase">Administration</p>
              </div>
            </div>
            <p className="mt-4 truncate text-xs text-ink/90" title={email}>Connecté : {email || 'administrateur'}</p>
            <a href="/" className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-navy-500 hover:underline focus-visible:ring-2 focus-visible:ring-navy-500">
              <Icon name="arrowRight" className="h-4 w-4 rotate-180" /> Voir le site
            </a>
            <div className="mt-4 border-t border-navy-100 pt-4">{nav}</div>
            <button onClick={() => { void logoutAdmin().then(() => setToken(null)) }} className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-navy-100 px-4 text-sm font-semibold text-ink hover:bg-mist focus-visible:ring-2 focus-visible:ring-navy-500">
              Déconnexion
            </button>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="" className="h-10 w-10 lg:hidden" />
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Tableau de bord</h1>
                <p className="text-sm text-ink/90">Groupe Scolaire Madeleine-Daniélou — Abidjan</p>
                <p className="truncate text-xs text-ink/90 lg:hidden">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" className="hidden min-h-[44px] items-center rounded-full border border-navy-100 bg-white px-4 text-sm font-semibold text-navy-500 hover:bg-mist focus-visible:ring-2 focus-visible:ring-navy-500 sm:inline-flex">Voir le site</a>
              <button onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu d’administration" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-navy-100 bg-white text-ink lg:hidden"><Icon name="menu" className="h-5 w-5" /></button>
            </div>
          </div>
          {menuOpen && (
            <SlideOverDrawer title="Menu d’administration" onClose={() => setMenuOpen(false)}>
              <p className="mb-4 truncate text-sm text-ink/90">{email || 'administrateur'}</p>
              {nav}
              <a href="/" className="mt-4 flex min-h-[44px] items-center gap-2 rounded-xl bg-navy-50 px-4 text-sm font-semibold text-navy-500">Voir le site</a>
              <button onClick={() => { void logoutAdmin().then(() => setToken(null)) }} className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-navy-100 px-4 text-sm font-semibold text-ink">Déconnexion</button>
            </SlideOverDrawer>
          )}

          {tab === 'overview' && (
            <section className="mt-8">
              <h2 className="sr-only">Vue d’ensemble</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Pré-inscriptions" value={data.inscriptions.length} note="dossiers reçus" icon={<Icon name="cap" className="h-5 w-5" />} onClick={() => setTab('inscriptions')} />
                <KpiCard label="Messages" value={data.messages.length} note={`${data.messages.filter((m) => !m.traite).length} non traités`} icon={<Icon name="mail" className="h-5 w-5" />} onClick={() => setTab('messages')} />
                <KpiCard label="Documents" value={data.documents.length} note="fiches en ligne" accent icon={<Icon name="fileText" className="h-5 w-5" />} onClick={() => setTab('documents')} />
                <KpiCard label="Photos" value={data.photos.length} note={`${data.photos.filter((x) => x.featured).length} à la une`} accent icon={<Icon name="star" className="h-5 w-5" />} onClick={() => setTab('photos')} />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-100">
                  <h3 className="font-display text-lg font-semibold text-ink">À traiter</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mist p-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">Nouvelles pré-inscriptions</p>
                        <p className="mt-0.5 text-xs text-ink/90">{counts.inscriptions} dossiers à examiner</p>
                      </div>
                      <button type="button" onClick={() => setTab('inscriptions')} className="min-h-[44px] rounded-full bg-navy-500 px-4 text-sm font-semibold text-white hover:bg-navy-600 focus-visible:ring-2 focus-visible:ring-navy-500">Examiner</button>
                    </li>
                    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mist p-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">Messages non traités</p>
                        <p className="mt-0.5 text-xs text-ink/90">{counts.messages} messages en attente de réponse</p>
                      </div>
                      <button type="button" onClick={() => setTab('messages')} className="min-h-[44px] rounded-full bg-navy-500 px-4 text-sm font-semibold text-white hover:bg-navy-600 focus-visible:ring-2 focus-visible:ring-navy-500">Répondre</button>
                    </li>
                    {counts.inscriptions === 0 && counts.messages === 0 && (
                      <li className="rounded-2xl border border-navy-100 p-4 text-sm text-ink/90">Tout est à jour — aucun dossier ni message en attente.</li>
                    )}
                  </ul>
                </div>

                <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-100 lg:col-span-2">
                  <h3 className="font-display text-lg font-semibold text-ink">Pré-inscriptions par statut</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { key: 'nouveau', label: 'Nouvelles', color: 'bg-navy-500' },
                      { key: 'en_attente', label: 'En attente', color: 'bg-copper-500' },
                      { key: 'validee', label: 'Validées', color: 'bg-success' },
                      { key: 'refusee', label: 'Refusées', color: 'bg-ink/40' },
                    ].map((s) => {
                      const n = data.inscriptions.filter((i) => i.status === s.key).length
                      const pct = data.inscriptions.length ? Math.round((n / data.inscriptions.length) * 100) : 0
                      return <div key={s.key}>
                        <div className="flex justify-between text-xs text-ink/90"><span>{s.label}</span><strong className="tabular-nums">{n}</strong></div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-navy-50"><div className={`h-full rounded-full ${s.color} transition-[width] duration-300 ease-out`} style={{ width: `${pct}%` }} /></div>
                      </div>
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-100">
                  <h3 className="font-display text-lg font-semibold text-ink">Activité récente</h3>
                  <ul className="mt-4 divide-y divide-navy-100">
                    {[
                      ...data.inscriptions.map((i) => ({ at: i.createdAt, label: `Pré-inscription de ${i.elevePrenom} ${i.eleveNom}` })),
                      ...data.messages.map((m) => ({ at: m.createdAt, label: `Message de ${m.name}` })),
                    ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5).map((x, i) => (
                      <li key={i} className="flex justify-between gap-3 py-2 text-sm text-ink/90"><span className="min-w-0 truncate">{x.label}</span><span className="shrink-0 text-xs">{relativeDate(x.at)}</span></li>
                    ))}
                    {data.inscriptions.length + data.messages.length === 0 && <li className="py-4 text-sm text-ink/90">Aucune activité pour le moment. Les nouvelles demandes apparaîtront ici.</li>}
                  </ul>
                </div>

                <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-100">
                  <h3 className="font-display text-lg font-semibold text-ink">Actions rapides</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Ajouter un document', icon: 'fileText', action: () => setTab('documents') },
                      { label: 'Ajouter un podcast', icon: 'radio', action: () => setTab('podcasts') },
                      { label: 'Ajouter des photos', icon: 'star', action: () => setTab('photos') },
                      { label: 'Voir les actualités', icon: 'bookOpen', action: () => { window.location.href = '/actualites' } },
                    ].map((a) => (
                      <button key={a.label} type="button" onClick={a.action} className="flex min-h-[56px] items-center gap-2 rounded-2xl border border-navy-100 px-3 text-left text-sm font-semibold text-ink transition-colors hover:border-navy-300 hover:bg-mist focus-visible:ring-2 focus-visible:ring-navy-500">
                        <Icon name={a.icon as 'fileText'} className="h-5 w-5 shrink-0 text-navy-500" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-navy-500">Ce site est hébergé par le Groupe Scolaire Daniélou Abidjan.</p>
                </div>
              </div>
            </section>
          )}

          {tab === 'inscriptions' && (
            <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-navy-100">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { key: 'nouveau', label: 'Nouvelles', color: 'text-navy-500', bar: 'bg-navy-500' },
                  { key: 'en_attente', label: 'En attente', color: 'text-copper-700', bar: 'bg-copper-500' },
                  { key: 'validee', label: 'Validées', color: 'text-success', bar: 'bg-success' },
                  { key: 'refusee', label: 'Refusées', color: 'text-ink/90', bar: 'bg-ink/40' },
                ].map((s) => {
                  const n = data.inscriptions.filter((i) => i.status === s.key).length
                  return (
                    <div key={s.key} className="rounded-2xl bg-mist p-4">
                      <p className="text-xs font-medium text-ink/90">{s.label}</p>
                      <p className={`font-display mt-1 text-2xl font-semibold tabular-nums ${s.color}`}>{n}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className={`h-full ${s.bar}`} style={{ width: `${data.inscriptions.length ? Math.round((n / data.inscriptions.length) * 100) : 0}%` }} /></div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 rounded-2xl border border-navy-100 p-4">
                <h2 className="text-sm font-semibold text-ink">Répartition par niveau</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {['Maternelle', 'Primaire', 'Collège', 'Lycée', 'Autre'].map((l) => {
                    const n = data.inscriptions.filter((i) => levelOf(i.classe) === l).length
                    if (!n && l === 'Autre') return null
                    return <span key={l} className="rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-500">{l} : {n}</span>
                  })}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Référence, élève, parent…" aria-label="Rechercher une pré-inscription" className="min-h-[44px] flex-1 rounded-xl border border-navy-200 px-4 text-ink" />
                <select value={filterClasse} onChange={(e) => setFilterClasse(e.target.value)} aria-label="Filtrer par classe" className="min-h-[44px] rounded-xl border border-navy-200 px-4 text-ink"><option value="">Toutes les classes</option>{[...new Set(data.inscriptions.map((i) => i.classe))].map((c) => <option key={c}>{c}</option>)}</select>
                <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} aria-label="Filtrer par statut" className="min-h-[44px] rounded-xl border border-navy-200 px-4 text-ink"><option value="">Tous les statuts</option>{['nouveau', 'en_attente', 'validee', 'refusee'].map((s) => <option key={s}>{s}</option>)}</select>
                <button onClick={exportCsv} className="min-h-[44px] rounded-full bg-navy-500 px-5 font-semibold text-white">Exporter CSV</button>
              </div>
              <div className="mt-6">
                <DataTable rows={filteredInscriptions} loading={loading} empty="Aucune pré-inscription pour le moment. Les nouvelles demandes apparaîtront ici."
                  columns={[
                    { key: 'ref', label: 'Référence', render: (i) => <button onClick={() => setDrawer(i.id)} className="text-navy-500 underline">{i.reference}</button> },
                    { key: 'eleve', label: 'Élève', render: (i) => `${i.elevePrenom} ${i.eleveNom}` },
                    { key: 'classe', label: 'Classe', render: (i) => i.classe },
                    { key: 'parent', label: 'Parent', render: (i) => i.parentNom },
                    { key: 'date', label: 'Date', render: (i) => fmt(i.createdAt) },
                    { key: 'statut', label: 'Statut', render: (i) => <StatusBadge status={i.status} /> },
                    { key: 'action', label: 'Action', render: (i) => <select aria-label={`Statut de ${i.reference}`} value={i.status} onChange={async (e) => { try { await api(`/api/inscriptions/${i.id}/statut`, 'PATCH', { statut: e.target.value }); await load(); setToast('Statut mis à jour.') } catch (err) { setToast(err instanceof Error ? err.message : 'Erreur') } }} className="min-h-[36px] rounded-lg border border-navy-200 text-sm"><option value="nouveau">nouveau</option><option value="en_attente">en_attente</option><option value="validee">validee</option><option value="refusee">refusee</option></select> },
                  ]} />
              </div>
            </section>
          )}

          {tab === 'documents' && <MediaPanel kind="documents" items={data.documents} loading={loading} upload={upload} setUpload={setUpload} onUpload={async () => { if (!upload.file) { setToast('Fichier PDF requis.'); return } const f = new FormData(); f.append('file', upload.file); f.append('title', upload.title); f.append('section', upload.section); try { await api('/api/documents', 'POST', f, true); await load(); setToast('Document ajouté.'); setUpload({ title: '', section: 'commun', duration: '', description: '', file: null }) } catch (e) { setToast(e instanceof Error ? e.message : 'Erreur') } }} onDelete={(id) => setConfirm({ url: `/api/documents/${id}`, label: 'ce document' })} />}

          {tab === 'podcasts' && <MediaPanel kind="podcasts" items={data.podcasts} loading={loading} upload={upload} setUpload={setUpload} onUpload={async () => { if (!upload.file) { setToast('Fichier audio requis.'); return } const f = new FormData(); f.append('file', upload.file); f.append('title', upload.title); f.append('description', upload.description); f.append('duration', upload.duration); try { await api('/api/podcasts', 'POST', f, true); await load(); setToast('Podcast ajouté.'); setUpload({ title: '', section: 'commun', duration: '', description: '', file: null }) } catch (e) { setToast(e instanceof Error ? e.message : 'Erreur') } }} onDelete={(id) => setConfirm({ url: `/api/podcasts/${id}`, label: 'ce podcast' })} />}


          {tab === 'photos' && (
            <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-navy-100">
              <h2 className="font-display text-xl font-semibold text-ink">Galerie photos</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block"><span className="text-sm font-semibold text-ink">Titre</span><input value={upload.title} onChange={(e) => setUpload({ ...upload, title: e.target.value })} className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink" /></label>
                <label className="block"><span className="text-sm font-semibold text-ink">Section (suggérée automatiquement)</span><select value={['vie-scolaire','ceremonies','culture','sport','autres'].includes(upload.section) ? upload.section : 'vie-scolaire'} onChange={(e) => setUpload({ ...upload, section: e.target.value })} className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink"><option value="vie-scolaire">vie-scolaire</option><option value="ceremonies">ceremonies</option><option value="culture">culture</option><option value="sport">sport</option><option value="autres">autres</option></select></label>
                <label className="block sm:col-span-2"><span className="text-sm font-semibold text-ink">Description</span><input value={upload.description} onChange={(e) => setUpload({ ...upload, description: e.target.value })} className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink" /></label>
                <label className="block sm:col-span-2"><span className="text-sm font-semibold text-ink">Photo (EXIF corrigé, WebP optimisé)</span><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setUpload({ ...upload, file: f, section: f ? suggestSection(f.name) : upload.section }) }} className="mt-1 w-full text-sm text-ink" /></label>
                <button onClick={async () => { if (!upload.file) { setToast('Fichier photo requis.'); return } const f = new FormData(); f.append('file', upload.file); f.append('title', upload.title); f.append('section', upload.section); f.append('description', upload.description); try { const r = await api('/api/photos', 'POST', f, true) as { item?: Photo }; if (r?.item) setToast(`Photo optimisée : ${r.item.orientation} ${r.item.width}×${r.item.height}`); await load(); setUpload({ title: '', section: 'vie-scolaire', duration: '', description: '', file: null }) } catch (e) { setToast(e instanceof Error ? e.message : 'Erreur') } }} className="min-h-[44px] rounded-full bg-navy-500 px-6 font-semibold text-white sm:col-span-2">Ajouter la photo</button>
              </div>
              <div className="mt-6">
                <DataTable rows={data.photos} loading={loading} empty="Aucune photo."
                  columns={[
                    { key: 'title', label: 'Titre', render: (x) => x.title },
                    { key: 'section', label: 'Section', render: (x) => x.section },
                    { key: 'orient', label: 'Orientation', render: (x) => `${x.orientation} ${x.width}×${x.height}` },
                    { key: 'featured', label: 'À la une', render: (x) => <button onClick={async () => { try { await api(`/api/photos/${x.id}`, 'PUT', { featured: !x.featured }); await load() } catch (e) { setToast(e instanceof Error ? e.message : 'Erreur') } }} className={`min-h-[36px] rounded-full px-3 text-xs font-semibold ${x.featured ? 'bg-copper-500 text-white' : 'bg-navy-50 text-navy-500'}`}>{x.featured ? 'Oui' : 'Non'}</button> },
                    { key: 'del', label: '', render: (x) => <button onClick={() => setConfirm({ url: `/api/photos/${x.id}`, label: 'cette photo' })} aria-label="Supprimer la photo" className="text-error"><Icon name="x" className="h-4 w-4" /></button> },
                  ]} />
              </div>
              <div className="mt-6"><SmartPhotoGrid items={data.photos} /></div>
            </section>
          )}

          {tab === 'messages' && (
            <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-navy-100">
              <DataTable rows={[...data.messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))} loading={loading} empty="Aucun message."
                columns={[
                  { key: 'name', label: 'Nom', render: (m) => <button onClick={() => setDrawer(m.id)} className="text-navy-500 underline">{m.name}</button> },
                  { key: 'email', label: 'Email', render: (m) => m.email },
                  { key: 'subject', label: 'Sujet', render: (m) => m.subject },
                  { key: 'date', label: 'Date', render: (m) => fmt(m.createdAt) },
                  { key: 'traite', label: 'Traitement', render: (m) => <button onClick={async () => { try { await api(`/api/contact/${m.id}/traite`, 'PATCH', { traite: !m.traite }); await load() } catch (e) { setToast(e instanceof Error ? e.message : 'Erreur') } }} className={`min-h-[36px] rounded-full px-3 text-xs font-semibold ${m.traite ? 'bg-success/10 text-success' : 'bg-navy-50 text-navy-500'}`}>{m.traite ? 'Traité' : 'Non traité'}</button> },
                  { key: 'del', label: '', render: (m) => <button onClick={() => setConfirm({ url: `/api/contact/${m.id}`, label: 'ce message' })} aria-label={`Supprimer le message de ${m.name}`} className="text-error"><Icon name="x" className="h-4 w-4" /></button> },
                ]} />
            </section>
          )}
        </div>
      </div>

      {drawer && (() => {
        const i = data.inscriptions.find((x) => x.id === drawer); const m = data.messages.find((x) => x.id === drawer)
        return <SlideOverDrawer title={i ? `Dossier ${i.reference}` : m ? `Message de ${m.name}` : 'Détail'} onClose={() => setDrawer(null)}>
          {i && <dl className="space-y-2 text-sm text-ink/90">{Object.entries(i).filter(([k]) => k !== 'id').map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-navy-100 py-2"><dt className="font-medium">{k}</dt><dd className="text-right">{String(v)}</dd></div>)}</dl>}
          {m && <dl className="space-y-2 text-sm text-ink/90">{Object.entries(m).filter(([k]) => k !== 'id').map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-navy-100 py-2"><dt className="font-medium">{k}</dt><dd className="text-right">{String(v)}</dd></div>)}</dl>}
        </SlideOverDrawer>
      })()}
      {confirm && <ConfirmModal message={`Supprimer ${confirm.label} ? Cette action est irréversible.`} onCancel={() => setConfirm(null)} onConfirm={async () => { if (!confirm) return; try { await api(confirm.url, 'DELETE'); await load(); setToast('Supprimé.') } catch (e) { setToast(e instanceof Error ? e.message : 'Erreur') } setConfirm(null) }} />}
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}

function MediaPanel({ kind, items, loading, upload, setUpload, onUpload, onDelete }: {
  kind: 'documents' | 'podcasts'; items: (Doc | Podcast)[]; loading: boolean
  upload: { title: string; section: string; duration: string; description: string; file: File | null }
  setUpload: Dispatch<SetStateAction<{ title: string; section: string; duration: string; description: string; file: File | null }>>
  onUpload: () => void | Promise<void>; onDelete: (id: string) => void
}) {
  return (
    <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-navy-100">
      <h2 className="font-display text-xl font-semibold text-ink">{kind === 'documents' ? 'Documents' : 'Podcasts'}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-semibold text-ink">Titre</span><input value={upload.title} onChange={(e) => setUpload({ ...upload, title: e.target.value })} className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink" /></label>
        {kind === 'documents' ? <label className="block"><span className="text-sm font-semibold text-ink">Section</span><select value={upload.section} onChange={(e) => setUpload({ ...upload, section: e.target.value })} className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink"><option value="commun">commun</option><option value="college">college</option><option value="lycee">lycee</option></select></label> : <label className="block"><span className="text-sm font-semibold text-ink">Durée</span><input value={upload.duration} onChange={(e) => setUpload({ ...upload, duration: e.target.value })} placeholder="4:32" className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink" /></label>}
        {kind === 'podcasts' && <label className="block sm:col-span-2"><span className="text-sm font-semibold text-ink">Description</span><input value={upload.description} onChange={(e) => setUpload({ ...upload, description: e.target.value })} className="mt-1 min-h-[44px] w-full rounded-xl border border-navy-200 px-4 text-ink" /></label>}
        <label className="block sm:col-span-2"><span className="text-sm font-semibold text-ink">Fichier {kind === 'documents' ? 'PDF' : 'audio'}</span><input type="file" accept={kind === 'documents' ? 'application/pdf' : 'audio/*'} onChange={(e) => setUpload({ ...upload, file: e.target.files?.[0] || null })} className="mt-1 w-full text-sm text-ink" /></label>
        <button onClick={onUpload} className="min-h-[44px] rounded-full bg-navy-500 px-6 font-semibold text-white sm:col-span-2">Ajouter</button>
      </div>
      <div className="mt-6">
        <DataTable rows={items as { id: string }[]} loading={loading} empty={`Aucun élément dans ${kind} pour le moment.`}
          columns={[
            { key: 'title', label: 'Titre', render: (x) => 'title' in x ? String(x.title) : '' },
            { key: 'meta', label: kind === 'documents' ? 'Section' : 'Durée', render: (x) => kind === 'documents' ? ('section' in x ? String(x.section) : '') : ('duration' in x ? String(x.duration) : '') },
            { key: 'date', label: 'Ajouté le', render: (x) => 'uploadedAt' in x ? fmt(String(x.uploadedAt)) : '' },
            { key: 'del', label: '', render: (x) => <button onClick={() => onDelete(x.id)} aria-label="Supprimer" className="text-error"><Icon name="x" className="h-4 w-4" /></button> },
          ]} />
      </div>
    </section>
  )
}
