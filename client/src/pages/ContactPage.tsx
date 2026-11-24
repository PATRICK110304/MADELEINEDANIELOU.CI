// ============================================================
// client/src/pages/ContactPage.jsx — Contact & géolocalisation
// Coordonnées officielles + carte Google Maps du campus
// (Cité SIR, Bingerville) + réseaux sociaux.
// ============================================================
import { contact, social, mission } from '../data/content'
import Icon from '../components/Icons'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import ContactForm from '../components/ContactForm'
import { coordonnees } from '../data/infos-ecole'

export default function ContactPage() {
  return (
    <>
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader as="h1"
            eyebrow="Contact"
            title="Écrire, appeler, nous rendre visite"
            subtitle="Le secrétariat du Groupe Scolaire Daniélou Abidjan vous accueille et répond à toutes vos questions."
          />
        </Reveal>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* ----- Coordonnées officielles ----- */}
          <Reveal>
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-3xl bg-white p-8 shadow-lg shadow-ink/5 ring-1 ring-navy-100">
                <ul className="space-y-5 text-sm text-ink/95">
                  <li className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-500">
                      <Icon name="mapPin" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">Adresse</span>
                      {contact.adresse}
                      <span className="mt-0.5 block text-xs text-ink/95">{contact.bp}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-500">
                      <Icon name="phone" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">Téléphones</span>
                      {contact.telephone}
                      <span className="block">{contact.telephoneMobile}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-500">
                      <Icon name="mail" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">Email</span>
                      <a href={`mailto:${contact.email}`} className="transition-colors hover:text-navy-500">{contact.email}</a>
                    </span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-500">
                      <Icon name="clock" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">Horaires</span>
                      {contact.horaires}
                    </span>
                  </li>
                </ul>

                {/* Réseaux sociaux */}
                <div className="mt-7 flex items-center gap-3 border-t border-navy-100 pt-6">
                  <span className="text-xs font-semibold tracking-[0.25em] text-ink/95 uppercase">Suivez-nous</span>
                  {social.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.name} — Groupe Scolaire Daniélou-Abidjan`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
                    >
                      <Icon name={s.icon} className="h-5 w-5" filled />
                    </a>
                  ))}
                </div>
              </div>

              {/* Citation officielle */}
              <div className="rounded-3xl bg-mist p-8 ring-1 ring-navy-100">
                <span className="font-display text-5xl leading-none text-copper-400" aria-hidden="true">“</span>
                <blockquote className="font-display text-lg leading-relaxed font-medium text-ink italic">
                  {mission.citation}
                </blockquote>
                <p className="mt-4 text-sm font-semibold text-navy-500">— {mission.citationAuteur}</p>
              </div>
            </div>
          </Reveal>

          {/* ----- Carte de géolocalisation ----- */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-4">
              <div className="overflow-hidden rounded-3xl shadow-lg shadow-ink/5 ring-1 ring-navy-100">
                <iframe
                  title="Carte — Groupe Scolaire Madeleine-Daniélou, Bingerville"
                  src="https://www.google.com/maps?q=Groupe%20Scolaire%20Madeleine%20Dani%C3%A9lou%20Bingerville%20C%C3%B4te%20d%27Ivoire&output=embed"
                  className="h-96 w-full lg:h-[28rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-md shadow-ink/5 ring-1 ring-navy-100">
                <p className="text-sm leading-relaxed text-ink/95">
                  À <strong className="text-ink">400 m du carrefour de la Cité SIR</strong>, au quartier
                  <strong className="text-ink"> Agbassi de Bingerville</strong>.
                </p>
                <a
                  href={contact.geoloc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-500 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-600 shadow-lg shadow-navy-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon name="mapPin" className="h-4 w-4" />
                  Ouvrir l'itinéraire
                  <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
      <ContactForm />
    </>
  )
}
