from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

OUT = os.environ.get('GSMD_DOCS_DIR', '/home/patrick/Bureau/Documents-GSMD')
os.makedirs(OUT, exist_ok=True)

BLEU = RGBColor(0x0B, 0x5C, 0xA0)
CORAIL = RGBColor(0xD9, 0x53, 0x2B)
GRIS = RGBColor(0x55, 0x5B, 0x66)


def base(title, subtitle):
    d = Document()
    sec = d.sections[0]
    sec.top_margin = Cm(2)
    sec.bottom_margin = Cm(2)
    sec.left_margin = Cm(2.2)
    sec.right_margin = Cm(2.2)
    st = d.styles['Normal']
    st.font.name = 'Calibri'
    st.font.size = Pt(10.5)
    st.font.color.rgb = GRIS
    for name, size in [('Heading 1', 18), ('Heading 2', 13), ('Heading 3', 11)]:
        s = d.styles[name]
        s.font.name = 'Calibri'
        s.font.size = Pt(size)
        s.font.color.rgb = BLEU
        s.font.bold = True
    p = d.add_paragraph()
    p.style = d.styles['Heading 1']
    p.add_run(title)
    p2 = d.add_paragraph(subtitle)
    p2.runs[0].italic = True
    p2.runs[0].font.color.rgb = CORAIL
    footer = sec.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = footer.add_run('Groupe Scolaire Madeleine-Daniélou Abidjan — document modifiable')
    r.font.size = Pt(8)
    r.font.color.rgb = GRIS
    return d


def bullets(d, items):
    for it in items:
        d.add_paragraph(it, style='List Bullet')


def contact(d):
    d.add_heading('Coordonnées du développeur', 2)
    bullets(d, [
        'Gmail : patrickndri120@gmail.com',
        'Portfolio : https://patrickdev-portfolio.vercel.app',
        'GitHub : https://github.com/PATRICK110304',
        'LinkedIn : [VOTRE URL LINKEDIN — À TRANSMETTRE]',
        'Renseignements à confirmer avant envoi.',
    ])


# ---------------------------------------------------------------- 1
d = base('1. Connexions et accès', 'À remplir lors de la remise — ne jamais inscrire de mot de passe.')
d.add_heading('1. Accès au site', 2)
bullets(d, [
    'Site public : https://madeleinedanielou.vercel.app — aucune connexion requise.',
    'Espace administration : https://madeleinedanielou.vercel.app/admin/dashboard — connexion Supabase Auth, identifiant admin@madeleinedanielou.ci.',
    'API monitoring : https://madeleinedanielou-api.fly.dev/api/health — aucune connexion requise.',
])
d.add_heading('2. Comptes propriétaires à transférer à l’école', 2)
bullets(d, [
    'Vercel — https://vercel.com/angelin-projet/madeleinedanielou — déploiements, domaine, variables VITE_* — transféré : ☐',
    'Fly.io — https://fly.io/apps/madeleinedanielou-api — machines, secrets, logs, redémarrage — transféré : ☐',
    'Supabase — https://supabase.com/dashboard/project/ldvzwxhscuppqpqrgnmf — utilisateurs Auth, tables, journal d’audit — transféré : ☐',
    'Resend — https://resend.com/domains — domaine vérifié, clés API, emails envoyés — transféré : ☐',
    'Registrar du domaine — [URL du registrar] — gestion DNS — transféré : ☐',
])
d.add_heading('3. Procédure de connexion à l’administration', 2)
bullets(d, [
    'Ouvrir https://madeleinedanielou.vercel.app/admin/dashboard',
    'Saisir l’email du compte autorisé, puis le mot de passe remis séparément.',
    'En cas d’oubli : réinitialiser depuis Supabase → Authentication → Users → « Send magic link » / « Reset password ».',
    'Le mot de passe ne doit jamais être envoyé par email ni inscrit dans un document partagé.',
    'Se déconnecter via le bouton « Déconnexion » en bas du menu latéral.',
])
d.add_heading('4. Règles de sécurité', 2)
bullets(d, [
    'Ne jamais communiquer la clé secrète Resend, la chaîne DATABASE_URL ni les tokens Fly/Vercel.',
    'Ces valeurs sont stockées dans les secrets Fly.io et dans le dashboard Supabase.',
    'Régénérer la clé Resend (partagée dans un chat) puis mettre à jour le secret Fly.',
    'Activer les rôles (direction / secrétariat / communication) avec ADMIN_ROLES et app_metadata.role.',
    'Conserver le journal d’audit public.audit_log (consultations et exports).',
])
d.add_heading('5. Attestation de remise', 2)
bullets(d, [
    'Lien du site et accès admin — destinataire : ___ — date : ___ — signature : ___',
    'Comptes propriétaires (Vercel/Fly/Supabase/Resend) — destinataire : ___ — date : ___ — signature : ___',
    'Nom de domaine et DNS — destinataire : ___ — date : ___ — signature : ___',
])
contact(d)
d.save(f'{OUT}/01-Connexions-et-acces.docx')

# ---------------------------------------------------------------- 2
d = base('2. Fonctionnalités à ajouter', 'Éléments restants — à valider avec la direction.')
d.add_paragraph('Priorités : P1 = avant la communication officielle, P2 = à prévoir, P3 = confort.')
d.add_heading('Priorité P1', 2)
bullets(d, [
    'F1 — Corriger l’histoire : 1913 (Communauté), 1962 à Adjamé, inauguration le 15/01/2021. Responsable : Direction.',
    'F2 — Corriger les horaires : 7h30–17h00, pause 12h45–13h45 ; supprimer 7h–16h. Responsable : Secrétariat.',
    'F3 — Remplacer le « Mot de la Direction » par le texte officiel. Responsable : Direction.',
    'F4 — Menu de la cantine à jour : semaine 16–20/11/2026 et mise à jour chaque lundi. Responsable : Secrétariat.',
    'F5 — Bloquer les classes indisponibles : CE2, CM1, 6e–3e, Terminale. Responsable : Secrétariat.',
    'F6 — Remplacer les PDF et audios de démonstration par les fichiers officiels. Responsable : Secrétariat.',
    'F7 — Compléter réseau et partenaires : Rome retiré, Cocody/Ermont ajoutés, Prosuma, NSIA, Nexans, DCC, Guilde, TBC. Responsable : Communication.',
    'F10 — Mettre en place les rôles admin : direction / secrétariat / communication. Responsable : Direction.',
    'F15 — Domaine et Resend vérifié : DNS, SPF/DKIM/DMARC, emails délivrés. Responsable : Développeur + registrar.',
    'F16 — Déclaration ARTCI et autorisations de droit à l’image. Responsable : Direction.',
])
d.add_heading('Priorité P2', 2)
bullets(d, [
    'F8 — Ajouter les albums annuels 2023-2024, 2024-2025, 2025-2026. Responsable : Communication.',
    'F9 — Ajouter le planning des inscriptions 2026-2027 (PDF source). Responsable : Secrétariat.',
    'F11 — Module « Actualités » dans l’admin : créer/éditer sans passer par le code. Responsable : Développeur.',
    'F12 — Finaliser les détails admin : deep-link des onglets, chargement du bouton de connexion. Responsable : Développeur.',
    'F13 — Améliorer le formulaire : name/autocomplete, focus premier champ invalide, aria-live. Responsable : Développeur.',
])
d.add_heading('Priorité P3', 2)
bullets(d, [
    'F14 — Détails mobiles et accessibilité : safe-area, overscroll, transition-all, reduced-motion. Responsable : Développeur.',
])
d.add_heading('Notes', 2)
bullets(d, [
    'Aucune information n’a été inventée : tout vient du site officiel ou du diagnostic technique.',
    'Chaque élément validé par l’école peut être intégré sans refaire le site.',
    'Les montants et abonnements sont détaillés dans le document 04.',
])
contact(d)
d.save(f'{OUT}/02-Fonctionnalites-a-ajouter.docx')

# ---------------------------------------------------------------- 3
d = base('3. Documents à fournir', 'Pièces à demander à l’école — checklist à cocher lors de l’entretien.')
d.add_heading('Pièces à demander', 2)
bullets(d, [
    'Nom de domaine exact et gestionnaire DNS — à demander à : Direction / registrar — où le trouver : facture ou espace « Domaines » — utilisé pour : installation du domaine — reçu : ☐',
    'Nom et qualité du directeur de publication — Direction — statuts / registre de l’association — mentions légales — reçu : ☐',
    'Coordonnées de l’hébergeur actuel — Direction / comptabilité — facture ou contrat d’hébergement — mentions légales — reçu : ☐',
    'Durées de conservation — Secrétariat / direction — règlement intérieur ou note de direction — politique de confidentialité — reçu : ☐',
    'Récépissé de déclaration ARTCI — Direction — dossier administratif (numéro + date) — conformité — reçu : ☐',
    'Autorisations de droit à l’image — Secrétariat — dossiers parents (site web + réseaux) — légalité des photos — reçu : ☐',
    'Vrai mot de la Direction — Direction — texte officiel — page « Qui sommes-nous » — reçu : ☐',
    'Vrais PDF et fichiers audio — Secrétariat — fiches, règlements, épisodes — documents et Web Radio — reçu : ☐',
    'Planning des inscriptions 2026-2027 — Secrétariat — PDF de l’ancien site — page Scolarité — reçu : ☐',
    'URL Facebook officielle — Communication — ancien site / page Facebook — footer et contact — reçu : ☐',
    'Liste des partenaires et statut UNESCO — Communication — page « Partenaires » de l’ancien site — page Partenaires — reçu : ☐',
    'Rôles admin et emails associés — Direction — décision de la direction — comptes Supabase Auth — reçu : ☐',
    'Adresse d’expédition des emails — Direction — boîte groupescolaire@madeleinedanielou.ci — Resend / formulaire contact — reçu : ☐',
])
d.add_heading('À remettre de ton côté', 2)
bullets(d, [
    'Le lien du site : https://madeleinedanielou.vercel.app',
    'Le devis et la facture (document 04).',
    'Les accès administrateurs via un lien de réinitialisation — jamais le mot de passe par email.',
    'Une attestation d’hébergement et de domaine une fois le domaine installé.',
])
contact(d)
d.save(f'{OUT}/03-Documents-a-fournir.docx')

# ---------------------------------------------------------------- 4
d = base('4. Tarifs et abonnements', 'Montants indicatifs à confirmer — devis à faire valider par un comptable.')
d.add_heading('1. Prix de développement proposés', 2)
bullets(d, [
    'Option A — Développement seul : 300 000 FCFA TTC. L’école règle à part le domaine et l’hébergement (~50 000–80 000 FCFA/an, à vérifier).',
    'Option B — Tout compris 12 mois (recommandé) : 450 000 FCFA TTC. L’école ne paie rien d’autre : domaine, hébergement, base, emails inclus.',
    'Option C — Tout compris + formation + suivi 1 an : 600 000 FCFA TTC. Rien d’autre, avec 2 h de formation au secrétariat.',
    'Reconduction à partir de l’année 2 : 50 000 à 80 000 FCFA/an (domaine + infrastructure).',
])
d.add_heading('2. Solutions gratuites', 2)
bullets(d, [
    'Vercel Hobby — hébergement du site React — avantages : gratuit, déploiement automatique depuis GitHub, HTTPS — limite : usage non commercial selon les conditions, à vérifier pour une école.',
    'Supabase Free — base PostgreSQL et Auth — avantages : gratuit, tableau de bord complet, JWT — limite : quotas (base, bande passante, emails Auth) à confirmer.',
    'Resend Free — emails du formulaire — avantages : gratuit jusqu’à un certain volume — limite : domaine à vérifier quand même, quota quotidien.',
    'Dépôt GitHub public — sauvegarde du code — avantages : gratuit, historique des modifications — limite : code visible par tous.',
])
d.add_heading('3. Solutions payantes', 2)
bullets(d, [
    'Vercel Pro — ~20 USD / membre / mois (à vérifier) — avantages : usage commercial, domaines multiples, analytics, meilleurs quotas.',
    'Supabase Pro — ~25 USD / mois (à vérifier) — avantages : base plus large, sauvegardes étendues, support.',
    'Resend Pro — ~20 USD / mois (à vérifier) — avantages : volume d’emails plus élevé, plusieurs domaines, support.',
    'Fly.io (API) — quelques USD / mois pour 1 machine partagée — avantages : API toujours disponible, logs, redémarrage automatique ; pas de plan gratuit permanent.',
    'Nom de domaine .ci — ~10 000–30 000 FCFA / an (selon registrar) — avantages : adresse institutionnelle, email au nom de l’école.',
    'Cloudinary (option) — offre gratuite limitée puis forfaits — avantages : stockage cloud des photos, transformation WebP automatique.',
])
d.add_heading('4. Recommandation', 2)
bullets(d, [
    'Option B — 450 000 FCFA tout compris 12 mois : l’école n’a rien à payer de supplémentaire et le domaine porte son nom.',
    'Vérifier l’abonnement Vercel actuel avant de signer : s’il est payant, l’intégrer dans le montant.',
    'Prévoir une reconduction de 50 000 à 80 000 FCFA/an à partir de l’année 2.',
    'Faire valider TVA, NIF et mentions légales par un comptable avant d’émettre la facture.',
])
contact(d)
d.save(f'{OUT}/04-Tarifs-et-abonnements.docx')

# ---------------------------------------------------------------- 5
d = base('5. Facturation sans comptable', 'Démarche pratique — à confirmer auprès de la DGI (dgi.ci).')
d.add_heading('1. Première vérification', 2)
bullets(d, [
    'Demander à l’école si elle exige un NIF pour payer un prestataire. Les établissements paient souvent par virement et le demandent.',
    'Si un NIF est exigé : le demander à la DGI avant d’envoyer la facture. Je n’en invente aucun.',
    'Si aucun NIF n’est exigé : facture avec la mention « NIF en cours d’attribution », à régulariser dès obtention.',
    'Se renseigner sur le régime adapté (entreprise individuelle / auto-entrepreneur) directement à la DGI.',
])
d.add_heading('2. Modèle de facture sans NIF', 2)
for line in [
    'Facture n° [ANNÉE-001] du [DATE]',
    'Prestataire : [VOTRE NOM OU RAISON SOCIALE]',
    'Adresse / téléphone / email : [VOS COORDONNÉES]',
    'NIF : NIF en cours d’attribution — à fournir dès obtention',
    'Client : Groupe Scolaire Madeleine-Daniélou Abidjan',
    'Désignation : développement et mise en ligne du site institutionnel (12 mois tout compris)',
    'Montant HT : [………] FCFA',
    'TVA : TVA non applicable en l’absence d’assujettissement — à confirmer',
    'Total TTC à payer : 450 000 FCFA (option recommandée)',
    'Paiement : virement / espèces / mobile money — [MODALITÉS]',
]:
    p = d.add_paragraph(line)
    p.paragraph_format.left_indent = Cm(0.8)
d.add_heading('3. Après encaissement', 2)
bullets(d, [
    'Conserver une copie du devis signé, de la facture et de la preuve de paiement.',
    'Déclarer le revenu selon le régime communiqué par la DGI.',
    'Mettre à jour la facture avec le NIF dès qu’il est attribué.',
])
d.add_heading('4. Ce que je ne peux pas décider à ta place', 2)
bullets(d, [
    'Ton statut juridique et ton numéro fiscal : ils dépendent de ton dossier personnel.',
    'Le taux de TVA applicable : à confirmer auprès de la DGI.',
    'La mention exacte en l’absence de NIF : à valider avec le centre des impôts.',
    'Ce document est une aide pratique, pas un avis comptable ou fiscal.',
])
contact(d)
d.save(f'{OUT}/05-Facturation-sans-comptable.docx')

# ---------------------------------------------------------------- 6
d = base('6. Sécurisation et alertes de connexion', 'Notification à chaque connexion à l’espace administration.')
d.add_paragraph('Une alerte est envoyée lorsqu’un administrateur se connecte. Le message contient uniquement : compte, date, adresse IP et type d’appareil. Jamais de mot de passe ni de jeton.')
d.add_heading('1. Options de notification', 2)
bullets(d, [
    'Email via Resend — coût : gratuit dans le quota — avantages : déjà configuré, fiable, historique par email — limite : domaine à vérifier dans Resend.',
    'Webhook (CallMeBot / Zapier / Make) — coût : gratuit ou selon service — avantages : simple, possible WhatsApp — limite : service non officiel, fiabilité variable.',
    'Twilio WhatsApp — coût : payant à l’usage — avantages : API officielle, fiable — limite : compte et numéro à acheter.',
    'Twilio appel vocal — coût : payant à l’usage — avantages : appel immédiat — limite : coût par minute.',
    'Journal d’audit seul — coût : inclus — avantages : aucune dépendance — limite : pas d’alerte temps réel.',
])
d.add_heading('2. Ce que l’école doit décider', 2)
bullets(d, [
    'Qui reçoit l’alerte : email et/ou numéro WhatsApp et/ou numéro d’appel.',
    'Quel canal retenir : gratuit (email/webhook) ou payant officiel (Twilio).',
    'Si un appel est souhaité en plus du message.',
])
d.add_heading('3. Ce à transmettre (jamais dans le chat)', 2)
bullets(d, [
    'Email de réception : à écrire toi-même dans ADMIN_NOTIFY_EMAIL via les secrets Fly.',
    'Webhook : l’URL complète fournie par ton service (CallMeBot/Zapier/Make).',
    'Twilio : Account SID, Auth Token, numéros From/To — à saisir dans les secrets Fly.',
    'Commande : flyctl secrets set ADMIN_NOTIFY_EMAIL="..." -a madeleinedanielou-api',
])
d.add_heading('4. Vérification après configuration', 2)
bullets(d, [
    'Se connecter une fois à /admin/dashboard.',
    'Vérifier la réception du message ou de l’appel.',
    'Contrôler la ligne « connexion_admin » dans public.audit_log (Supabase).',
    'Ne jamais transmettre le mot de passe admin par WhatsApp : utiliser un lien de réinitialisation Supabase.',
])
d.add_heading('5. Sécurité déjà en place', 2)
bullets(d, [
    'Authentification Supabase Auth (JWT vérifié côté serveur à chaque requête).',
    'Limitation des tentatives de connexion et des notifications.',
    'Page /admin en noindex, secrets hors du dépôt, Helmet et CORS strict.',
    'Journal d’audit des consultations et exports.',
])
contact(d)
d.save(f'{OUT}/06-Securisation-et-alertes.docx')

# ---------------------------------------------------------------- 7
d = base('7. Protection IA et Cloudflare', 'Couches de défense supplémentaires — réglages à valider par l’école.')
d.add_heading('1. Les quatre couches mises en place', 2)
bullets(d, [
    'Limiteurs + JWT + RLS — bloquent le spam, les accès non autorisés et les abus de requêtes — coût inclus — aucune décision requise.',
    'Blocage IP deterministe — 10 échecs / 15 min → IP bloquée 30 min — coût inclus — à valider : seuil et durée.',
    'Agent IA de surveillance — analyse les échecs toutes les 15 min, résume en français, alerte — gratuit sans LLM, tokens si LLM — à choisir : LLM ou résumé deterministe.',
    'Cloudflare (à venir) — WAF, DDoS, Bot Fight avant Vercel/Fly — plan gratuit — à installer quand le domaine est connu.',
])
d.add_heading('2. Ce que fait l’agent IA', 2)
bullets(d, [
    'Lit uniquement les événements d’authentification (échecs, IP, email, date) — jamais de mot de passe.',
    'Détecte les pics d’échecs, plusieurs IP distinctes, les tentatives répétées sur le même compte.',
    'Produit un résumé en français : « 47 échecs depuis 3 IP en 15 min, cible admin@… ».',
    'Bloque prudemment les IP dépassant 4 échecs sur 15 min, pour 30 min, et envoie une alerte.',
    'Écrit chaque action dans le journal d’audit public.audit_log.',
])
d.add_heading('3. Sécurité du dispositif', 2)
bullets(d, [
    'Aucun blocage définitif : toutes les restrictions expirent après 30 min.',
    'Les IP de confiance (TRUSTED_IPS) ne sont jamais bloquées — y mettre l’IP du secrétariat.',
    'Déblocage immédiat : npm --workspace server run unblock -- <IP>.',
    'L’agent n’a pas accès aux secrets : il ne reçoit que des statistiques anonymisées.',
    'La machine Fly reste allumée pour que la surveillance tourne (quelques USD/mois).',
])
d.add_heading('4. Ce que tu dois décider / transmettre', 2)
bullets(d, [
    'IP du secrétariat : à mettre dans le secret Fly TRUSTED_IPS (à obtenir sur « whatismyip »).',
    'Canal d’alerte : à choisir puis identifiants saisis par toi dans les secrets Fly.',
    'LLM pour le résumé : secret Fly AI_API_KEY — optionnel, clé OpenAI-compatible. Sans clé, résumé gratuit.',
    'Cloudflare : compte à créer sur dash.cloudflare.com quand le domaine sera disponible.',
])
d.add_heading('5. Limites à connaître', 2)
bullets(d, [
    'Aucun système ne promet « zéro attaque » : un DDoS volumétrique est stoppé par Cloudflare, pas par l’agent.',
    'L’agent peut se tromper : les blocages sont courts et réversibles.',
    'Le LLM optionnel consomme des tokens uniquement lorsqu’une anomalie est détectée.',
    'Ces protections ne remplacent pas les sauvegardes Supabase ni les mises à jour du site.',
])
contact(d)
d.save(f'{OUT}/07-Protection-IA-et-Cloudflare.docx')

print('Documents créés sans tableaux dans', OUT)
for f in sorted(os.listdir(OUT)):
    print(' -', f, os.path.getsize(os.path.join(OUT, f)), 'octets')
