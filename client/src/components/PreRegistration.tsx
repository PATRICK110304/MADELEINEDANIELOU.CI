// ============================================================
// client/src/components/PreRegistration.jsx
// Section #preinscription — formulaire en 3 étapes connecté à
// l'API Express (POST /api/inscriptions) :
//   • Génération automatique du numéro de dossier unique
//     par le serveur (ex. INS-2026-8F3A21)
//   • Protection reCAPTCHA v3 (token envoyé si configuré)
//   • Repli automatique hors-ligne (référence MDL-…)
//   • Barre de progression, validation par étape, récapitulatif
// ============================================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { classeOptions, contact } from '../data/content'
import { submitInscription } from '../services/api'
import Icon from './Icons'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

/* ----- Libellés des étapes ----- */
const STEPS = [
  { id: 0, label: 'Élève' },
  { id: 1, label: 'Responsable' },
  { id: 2, label: 'Validation' },
]

/* ----- Valeurs initiales ----- */
const initialData = {
  elevePrenom: '', eleveNom: '', naissance: '', classe: '', origine: '',
  parentNom: '', lien: '', email: '', telephone: '', adresse: '', message: '',
  consent: false,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* ----- Champ réutilisable (label + erreur inline) ----- */
function Field({ label, error = null, children, required = true }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-navy-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

/* Styles des champs : focus orange, erreur rouge */
const inputCls = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/95 transition-all duration-200 outline-none focus:ring-4 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-navy-100 focus:border-orange-400 focus:ring-navy-100'
  }`

export default function PreRegistration() {
  const [step, setStep] = useState(0) // 0,1,2 — 3 = écran de succès
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [result, setResult] = useState(null) // { reference, offline }
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const set = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  /* ----- Validation par étape ----- */
  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!data.elevePrenom.trim()) e.elevePrenom = 'Prénom requis.'
      if (!data.eleveNom.trim()) e.eleveNom = 'Nom requis.'
      if (!data.naissance) e.naissance = 'Date de naissance requise.'
      if (!data.classe) e.classe = 'Veuillez choisir une classe.'
    }
    if (step === 1) {
      if (!data.parentNom.trim()) e.parentNom = 'Nom du responsable requis.'
      if (!EMAIL_RE.test(data.email)) e.email = 'Adresse e-mail invalide.'
      if (data.telephone.replace(/\D/g, '').length < 8) e.telephone = 'Numéro trop court.'
      if (!data.lien) e.lien = 'Veuillez préciser le lien de parenté.'
    }
    if (step === 2 && !data.consent) e.consent = 'Merci de confirmer votre accord.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => validate() && setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)

  /* ----- Envoi final vers l'API ----- */
  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      const res = await submitInscription(data)
      setResult(res) // { reference, offline? }
      setStep(3)
    } catch (err) {
      setApiError(err.message || 'Une erreur est survenue, merci de réessayer.')
    } finally {
      setLoading(false)
    }
  }

  /* ----- Écran de confirmation ----- */
  if (step === 3 && result) {
    return (
      <section id="preinscription" className="scroll-mt-24 bg-mist py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="animate-scale-in rounded-3xl bg-white p-10 text-center shadow-2xl lg:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-100 text-navy-500">
              <Icon name="check" className="h-10 w-10" />
            </div>
            <h3 className="font-display mt-6 text-3xl font-semibold text-ink">
              Pré-inscription enregistrée
            </h3>
            <p className="mt-3 leading-relaxed text-ink/95">
              {result.offline
                ? 'Vous êtes actuellement hors ligne : votre dossier a été préparé localement. Le secrétariat vous contactera pour le confirmer.'
                : 'Merci pour votre confiance. Notre secrétariat vous contactera sous 48 heures pour finaliser le dossier.'}
            </p>
            {/* Numéro de dossier unique généré par le serveur */}
            <p className="mt-6 inline-block rounded-xl bg-navy-50 px-6 py-3 font-mono text-lg font-semibold tracking-wider text-ink">
              Dossier n° {result.reference}
            </p>
            <p className="mt-4 text-sm text-ink/95">
              Conservez ce numéro — il vous sera demandé lors du rendez-vous.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-navy-600 shadow-lg shadow-navy-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Retour à l'accueil
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  /* ----- Formulaire principal ----- */
  return (
    <section id="preinscription" className="relative scroll-mt-24 overflow-hidden bg-mist py-20 lg:py-28">

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Pré-inscription en ligne"
            title="Réservez la place de votre enfant en 3 étapes"
            subtitle="Simple, rapide et sécurisé : un numéro de dossier unique vous est attribué et le secrétariat vous rappelle sous 48 heures."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-ink/10">
            {/* ----- Stepper ----- */}
            <div className="border-b border-navy-100 bg-navy-50/60 px-6 py-5 sm:px-10">
              <ol className="flex items-center">
                {STEPS.map((s, i) => (
                  <li key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                    <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                          i < step
                            ? 'bg-navy-500 text-white'
                            : i === step
                              ? 'bg-navy-600 text-white ring-4 ring-navy-200'
                              : 'bg-navy-200 text-ink/95'
                        }`}
                      >
                        {i < step ? <Icon name="check" className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className={`text-xs font-semibold sm:text-sm ${i <= step ? 'text-ink' : 'text-ink/95'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="mx-3 h-0.5 flex-1 rounded bg-navy-200">
                        <div className={`h-full rounded bg-navy-500 transition-all duration-500 ${i < step ? 'w-full' : 'w-0'}`} />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* ----- Corps du formulaire ----- */}
            <form onSubmit={submit} className="p-6 sm:p-10" noValidate>
              {/* ============ ÉTAPE 1 : ÉLÈVE ============ */}
              {step === 0 && (
                <div className="animate-fade-up grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Prénom de l'élève" error={errors.elevePrenom}>
                    <input type="text" value={data.elevePrenom} onChange={(e) => set('elevePrenom', e.target.value)} placeholder="Ex. : Aya" className={inputCls(errors.elevePrenom)} />
                  </Field>
                  <Field label="Nom de l'élève" error={errors.eleveNom}>
                    <input type="text" value={data.eleveNom} onChange={(e) => set('eleveNom', e.target.value)} placeholder="Ex. : Kouassi" className={inputCls(errors.eleveNom)} />
                  </Field>
                  <Field label="Date de naissance" error={errors.naissance}>
                    <input type="date" value={data.naissance} onChange={(e) => set('naissance', e.target.value)} className={inputCls(errors.naissance)} />
                  </Field>
                  <Field label="Classe demandée" error={errors.classe}>
                    <select value={data.classe} onChange={(e) => set('classe', e.target.value)} className={inputCls(errors.classe)}>
                      <option value="">— Sélectionner —</option>
                      {classeOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Établissement d'origine" required={false}>
                    <input type="text" value={data.origine} onChange={(e) => set('origine', e.target.value)} placeholder="Ex. : École primaire Saint-Jean" className={inputCls(false)} />
                  </Field>
                </div>
              )}

              {/* ============ ÉTAPE 2 : RESPONSABLE ============ */}
              {step === 1 && (
                <div className="animate-fade-up grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Nom complet du responsable" error={errors.parentNom}>
                    <input type="text" value={data.parentNom} onChange={(e) => set('parentNom', e.target.value)} placeholder="Ex. : M. Kouassi Jean" className={inputCls(errors.parentNom)} />
                  </Field>
                  <Field label="Lien de parenté" error={errors.lien}>
                    <select value={data.lien} onChange={(e) => set('lien', e.target.value)} className={inputCls(errors.lien)}>
                      <option value="">— Sélectionner —</option>
                      <option value="Père">Père</option>
                      <option value="Mère">Mère</option>
                      <option value="Tuteur légal">Tuteur légal</option>
                    </select>
                  </Field>
                  <Field label="Adresse e-mail" error={errors.email}>
                    <input type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="vous@exemple.ci" className={inputCls(errors.email)} />
                  </Field>
                  <Field label="Téléphone" error={errors.telephone}>
                    <div className="flex">
                      <span className="flex items-center rounded-l-xl border border-r-0 border-navy-100 bg-navy-50 px-3 text-sm font-semibold text-navy-700">+225</span>
                      <input type="tel" value={data.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder="27 22 00 00 00" className={`${inputCls(errors.telephone)} rounded-l-none`} />
                    </div>
                  </Field>
                  <Field label="Adresse de résidence" required={false}>
                    <input type="text" value={data.adresse} onChange={(e) => set('adresse', e.target.value)} placeholder="Quartier, commune, ville" className={inputCls(false)} />
                  </Field>
                  <Field label="Message (facultatif)" required={false}>
                    <textarea value={data.message} onChange={(e) => set('message', e.target.value)} rows={4} placeholder="Une question, une précision sur le dossier…" className={`${inputCls(false)} resize-none`} />
                  </Field>
                </div>
              )}

              {/* ============ ÉTAPE 3 : RÉCAPITULATIF ============ */}
              {step === 2 && (
                <div className="animate-fade-up">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 rounded-xl bg-navy-50/70 p-6 sm:grid-cols-2">
                    {[
                      ['Élève', `${data.elevePrenom} ${data.eleveNom}`],
                      ['Naissance', data.naissance],
                      ['Classe demandée', data.classe],
                      ['Établissement d’origine', data.origine || '—'],
                      ['Responsable', `${data.parentNom} (${data.lien})`],
                      ['E-mail', data.email],
                      ['Téléphone', `+225 ${data.telephone}`],
                      ['Adresse', data.adresse || '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs font-semibold tracking-wider text-ink/95 uppercase">{label}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
                      </div>
                    ))}
                    {data.message && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold tracking-wider text-ink/95 uppercase">Message</p>
                        <p className="mt-0.5 text-sm text-ink">{data.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Consentement */}
                  <label className="mt-6 flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-navy-300 accent-navy-500" />
                    <span className="text-sm text-ink/95">
                      Je certifie l'exactitude des informations et accepte d'être contacté(e) par le secrétariat
                      conformément à la{' '}
                      <Link
                        to="/politique-confidentialite"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-navy-500 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-navy-300"
                      >
                        politique de confidentialité
                      </Link>.{' '}
                      <span className="text-navy-500">*</span>
                    </span>
                  </label>
                  {errors.consent && <p className="mt-2 text-xs font-medium text-red-600">{errors.consent}</p>}

                  {/* Mention reCAPTCHA (affichée uniquement si activé côté client) */}
                  {import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
                    <p className="mt-3 text-[0.7rem] leading-relaxed text-ink/95">
                      Ce site est protégé par reCAPTCHA v3 —
                      <a className="underline" href="https://policies.google.com/privacy">confidentialité</a> ·
                      <a className="underline" href="https://policies.google.com/terms">conditions</a> Google.
                    </p>
                  )}
                </div>
              )}

              {/* ----- Erreur API éventuelle ----- */}
              {apiError && (
                <p className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <Icon name="x" className="h-4 w-4" />
                  {apiError}
                </p>
              )}

              {/* ----- Barre de navigation du formulaire ----- */}
              <div className="mt-9 flex items-center justify-between border-t border-navy-100 pt-7">
                {step > 0 ? (
                  <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50">
                    <Icon name="chevronLeft" className="h-4 w-4" />
                    Retour
                  </button>
                ) : (
                  <span className="flex items-center gap-2 text-xs text-ink/95">
                    <Icon name="phone" className="h-3.5 w-3.5" />
                    Aide : {contact.telephone}
                  </span>
                )}

                {step < 2 ? (
                  <button type="button" onClick={next} className="group inline-flex items-center gap-2 rounded-full bg-navy-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-500">
                    Continuer
                    <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-navy-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-navy-600 shadow-lg shadow-navy-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? 'Envoi en cours…' : 'Envoyer la pré-inscription'}
                    <Icon name="send" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
