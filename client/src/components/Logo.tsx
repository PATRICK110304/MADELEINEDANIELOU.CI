// ============================================================
// Logo.tsx — Badgé « Daniélou Abidjan »
// Conteneur carré parfait (aspect-square, bordure orange
// arrondie border-2 border-copper-500), image entièrement
// visible (object-fit: contain, aucun rognage, tampon ~7%).
// Taille réglable via `size` (header : 48, footer : 96).
// ============================================================
export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <span
      className="relative flex shrink-0 aspect-square items-center justify-center overflow-hidden rounded-full border-2 border-copper-500 bg-white transition-transform duration-300 group-hover:scale-105"
      style={{ width: size, height: size }}
    >
      <img
        src="/images/logo.png"
        alt="Logo Groupe Scolaire Daniélou Abidjan"
        className="h-[85%] w-[85%] object-contain"
      />
    </span>
  )
}
