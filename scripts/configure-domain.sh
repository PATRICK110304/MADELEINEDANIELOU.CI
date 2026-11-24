#!/usr/bin/env bash
# ============================================================
# configure-domain.sh <domaine> [sous-domaine-www]
# Exécute les étapes Vercel + Fly une fois le domaine connu.
# Ne touche pas aux secrets Resend/Supabase (à faire dans les
# dashboards respectifs, voir DEPLOIEMENT-DOMAINE.md).
# ============================================================
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: bash scripts/configure-domain.sh madeleinedanielou.ci"
  exit 1
fi

DOMAIN="$1"
WWW="${2:-www.$DOMAIN}"
FLY_APP="madeleinedanielou-api"

export FLYCTL_INSTALL="${FLYCTL_INSTALL:-$HOME/.fly}"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

echo "→ Vercel : ajout de $DOMAIN et $WWW"
vercel domains add "$DOMAIN" || true
vercel domains add "$WWW" || true
vercel domains ls

echo "→ Fly : CORS autorisé pour $DOMAIN et $WWW"
flyctl secrets set "CLIENT_URL=https://$DOMAIN,https://$WWW" --app "$FLY_APP"
flyctl apps restart "$FLY_APP"

echo "→ Supabase : à renseigner dans Authentication → URL Configuration"
echo "   Site URL      : https://$DOMAIN"
echo "   Redirect URLs : https://$DOMAIN/**, https://$WWW/**, http://localhost:5173/**"
echo
echo "→ Resend : vérifier $DOMAIN (SPF, DKIM, DMARC) dans resend.com/domains"
echo "Terminé. Relire DEPLOIEMENT-DOMAINE.md pour les pages légales."
