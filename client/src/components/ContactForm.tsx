// Formulaire de contact — envoi via /api/contact (serveur Express)
import { useState } from 'react'
import SectionHeader from './SectionHeader'

const SUJETS = ["Demande d'information", 'Pré-inscription', 'Partenariat', 'Autre']

export default function ContactForm() {
  const [form, setForm] = useState<{ name: string; email: string; phone: string; subject: string; message: string; consent: boolean }>({ name: '', email: '', phone: '', subject: '', message: '', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [message, setMessage] = useState('')

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Le nom est obligatoire.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Un email valide est obligatoire.'
    if (!SUJETS.includes(form.subject)) e.subject = 'Choisissez un sujet.'
    if (!form.message.trim()) e.message = 'Le message est obligatoire.'
    if (!form.consent) e.consent = "Votre accord est nécessaire pour traiter la demande."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setStatus(null)
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await r.json()
      if (!r.ok || !data.success) throw new Error(data.message || "Erreur d'envoi")
      setMessage(data.message)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '', consent: false })
    } catch (err) {
      setMessage(err.message || "Impossible d'envoyer la demande. Réessayez plus tard.")
      setStatus('error')
    }
  }

  const input = 'mt-1 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100'
  const label = 'block text-sm font-semibold text-ink'
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader eyebrow="Contact" title="Envoyer un message" subtitle="Tous les champs marqués * sont obligatoires." />
        {status && (
          <div role="status" aria-live="polite" className={`mt-6 rounded-2xl p-4 ${status === 'success' ? 'bg-navy-50 text-navy-700' : 'bg-copper-50 text-copper-700'}`}>{message}</div>
        )}
        <form onSubmit={submit} noValidate className="mt-6 space-y-5">
          <div><label htmlFor="c-name" className={label}>Nom complet *</label>
            <input id="c-name" name="name" autoComplete="name" required className={input} focus-visible:ring-2 value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
            {errors.name && <p id="e-name" role="alert" className="mt-1 text-sm text-error">{errors.name}</p>}</div>
          <div><label htmlFor="c-email" className={label}>Email *</label>
            <input id="c-email" name="email" type="email" autoComplete="email" spellCheck={false} required className={input} value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
            {errors.email && <p id="e-email" role="alert" className="mt-1 text-sm text-error">{errors.email}</p>}</div>
          <div><label htmlFor="c-phone" className={label}>Téléphone (optionnel)</label>
            <input id="c-phone" name="phone" type="tel" autoComplete="tel" className={input} value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
          <div><label htmlFor="c-subject" className={label}>Sujet *</label>
            <select id="c-subject" name="subject" required className={input} value={form.subject} onChange={(e) => set('subject', e.target.value)} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'e-subject' : undefined}>
              <option value="">— Choisir —</option>
              {SUJETS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.subject && <p id="e-subject" role="alert" className="mt-1 text-sm text-error">{errors.subject}</p>}</div>
          <div><label htmlFor="c-message" className={label}>Message *</label>
            <textarea id="c-message" name="message" rows={6} required className={input} value={form.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-message' : undefined} />
            {errors.message && <p id="e-message" role="alert" className="mt-1 text-sm text-error">{errors.message}</p>}</div>
          <div className="flex items-start gap-3">
            <input id="c-consent" name="consent" type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 h-5 w-5 rounded border-navy-200 accent-navy-500" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'e-consent' : undefined} />
            <label htmlFor="c-consent" className="text-sm text-ink/90">J'accepte que mes données soient utilisées pour traiter ma demande. <a href="/politique-confidentialite" className="text-navy-500 underline">Politique de confidentialité</a></label>
          </div>
          {errors.consent && <p id="e-consent" role="alert" className="text-sm text-error">{errors.consent}</p>}
          <button type="submit" className="inline-flex min-h-[48px] items-center rounded-full bg-navy-500 px-8 font-semibold text-white transition-colors hover:bg-navy-600">Envoyer</button>
        </form>
      </div>
    </section>
  )
}
