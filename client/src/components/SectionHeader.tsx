// ============================================================
// client/src/components/SectionHeader.tsx
// En-tête de section réutilisable : sur-titre BLEU discret avec
// filets jaune-orangé, titre Playfair ORANGE (grands titres
// uniquement), sous-titre encre doux.
// Cohérence typographique garantie sur tout le site.
// ============================================================

/**
 * @param {string}  eyebrow   Libellé bleu au-dessus du titre
 * @param {string}  title     Titre principal (Playfair Display, orange)
 * @param {string}  subtitle  Sous-titre descriptif (optionnel)
 * @param {boolean} light     Mode sur photo (texte clair)
 * @param {string}  align     'center' (défaut) | 'left'
 */
export default function SectionHeader({ eyebrow, title, subtitle, light = false, align = 'center' }) {
  const centered = align === 'center'
  return (
    <div className={`mx-auto mb-12 max-w-2xl lg:mb-16 ${centered ? 'text-center' : 'text-left'}`}>
      {/* Sur-titre : filet jaune-orangé + lettres espacées (petit texte bleu) */}
      <p className={`mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase text-navy-500 ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-copper-400" aria-hidden="true" />
        {eyebrow}
        {centered && <span className="h-px w-8 bg-copper-400" aria-hidden="true" />}
      </p>

      <h2 className={`font-display text-3xl leading-tight font-semibold sm:text-4xl lg:text-[2.6rem] ${light ? 'text-white' : 'text-copper-500'}`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-white/90' : 'text-ink/95'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
