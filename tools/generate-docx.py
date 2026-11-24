from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUT = os.environ.get('GSMD_DOCS_DIR', '/home/patrick/Bureau/Documents-GSMD')
os.makedirs(OUT, exist_ok=True)

BLEU = RGBColor(0x0B, 0x5C, 0xA0)
CORAIL = RGBColor(0xD9, 0x53, 0x2B)
GRIS = RGBColor(0x55, 0x5B, 0x66)


def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hexcolor)
    tcPr.append(shd)


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


def table(d, headers, rows, widths=None):
    t = d.add_table(rows=1, cols=len(headers))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = ''
        run = hdr[i].paragraphs[0].add_run(h)
        run.bold = True
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        run.font.size = Pt(9)
        shade(hdr[i], '0B5CA0')
    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = ''
            run = cells[i].paragraphs[0].add_run(str(val))
            run.font.size = Pt(9)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    d.add_paragraph()
    return t


def bullets(d, items):
    for it in items:
        d.add_paragraph(it, style='List Bullet')


# ---------------------------------------------------------------- 1
d = base('1. Connexions et accès', 'À remplir par le développeur lors de la remise — ne jamais inscrire de mot de passe dans ce document.')
d.add_heading('1. Accès au site', 2)
table(d, ['Service', 'Adresse', 'Connexion nécessaire', 'Identifiant'], [
    ['Site public', 'https://madeleinedanielou.vercel.app', 'Non', '—'],
    ['Espace administration', 'https://madeleinedanielou.vercel.app/admin/dashboard', 'Oui (Supabase Auth)', 'admin@madeleinedanielou.ci'],
    ['API (monitoring)', 'https://madeleinedanielou-api.fly.dev/api/health', 'Non', '—'],
], [4, 6.2, 3.6, 4.2])

d.add_heading('2. Comptes propriétaires à transférer à l’école', 2)
table(d, ['Service', 'URL du tableau de bord', 'Ce que l’école y trouve', 'Transféré (oui/non)'], [
    ['Vercel (site)', 'https://vercel.com/angelin-projet/madeleinedanielou', 'Déploiements, domaine, variables VITE_*', '☐'],
    ['Fly.io (API)', 'https://fly.io/apps/madeleinedanielou-api', 'Machines, secrets, logs, redémarrage', '☐'],
    ['Supabase', 'https://supabase.com/dashboard/project/ldvzwxhscuppqpqrgnmf', 'Utilisateurs Auth, tables, journal d’audit', '☐'],
    ['Resend', 'https://resend.com/domains', 'Domaine vérifié, clés API, emails envoyés', '☐'],
    ['Registrar du domaine', '[URL du registrar]', 'Gestion DNS du nom de domaine', '☐'],
], [3, 5.4, 6.2, 3.2])

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
    'Régénérer la clé Resend (elle a été partagée dans un chat) puis mettre à jour le secret Fly.',
    'Activer les rôles (direction / secrétariat / communication) avec ADMIN_ROLES et app_metadata.role.',
    'Conserver le journal d’audit public.audit_log (consultations et exports).',
])

d.add_heading('5. Attestation de remise', 2)
table(d, ['Élément remis', 'Destinataire', 'Date', 'Signature'], [
    ['Lien du site et accès admin', '', '', ''],
    ['Comptes propriétaires (Vercel/Fly/Supabase/Resend)', '', '', ''],
    ['Nom de domaine et DNS', '', '', ''],
], [7, 4, 3, 4])
d.save(f'{OUT}/01-Connexions-et-acces.docx')

# ---------------------------------------------------------------- 2
d = base('2. Fonctionnalités à ajouter', 'Éléments restants après la mise en ligne — à valider avec la direction.')
d.add_paragraph('Priorités : P1 = à faire avant la communication officielle, P2 = à prévoir, P3 = confort.')
rows = [
    ['F1', 'Corriger l’histoire du site', 'P1', '1913 (Communauté), 1962 à Adjamé, inauguration le 15/01/2021', 'Direction / ancien site'],
    ['F2', 'Corriger les horaires', 'P1', '7h30–17h00, pause 12h45–13h45 ; supprimer 7h–16h', 'Secrétariat'],
    ['F3', 'Remplacer le « Mot de la Direction »', 'P1', 'Texte officiel à fournir', 'Direction'],
    ['F4', 'Menu de la cantine à jour', 'P1', 'Semaine 16–20/11/2026 + mise à jour chaque lundi', 'Secrétariat'],
    ['F5', 'Bloquer les classes indisponibles', 'P1', 'CE2, CM1, 6e–3e, Terminale indisponibles selon la source', 'Secrétariat'],
    ['F6', 'Remplacer PDF et audios de démonstration', 'P1', 'Fiches, règlements et épisodes réels', 'Secrétariat'],
    ['F7', 'Compléter réseau et partenaires', 'P1', 'Rome retiré, Cocody/Ermont ajoutés, Prosuma, NSIA, Nexans, DCC, Guilde, TBC', 'Communication'],
    ['F8', 'Ajouter les albums annuels', 'P2', '2023-2024, 2024-2025, 2025-2026', 'Communication'],
    ['F9', 'Ajouter le planning des inscriptions', 'P2', 'PDF 2026-2027 depuis l’ancien site', 'Secrétariat'],
    ['F10', 'Mettre en place les rôles admin', 'P1', 'direction / secrétariat / communication', 'Direction'],
    ['F11', 'Module « Actualités » dans l’admin', 'P2', 'Créer/éditer une actualité sans passer par le code', 'Développeur'],
    ['F12', 'Finaliser les détails admin', 'P2', 'Deep-link des onglets, chargement du bouton de connexion', 'Développeur'],
    ['F13', 'Améliorer le formulaire', 'P2', 'name/autocomplete, focus premier champ invalide, aria-live', 'Développeur'],
    ['F14', 'Détails mobiles/accessibilité', 'P3', 'safe-area, overscroll, transition-all, reduced-motion', 'Développeur'],
    ['F15', 'Domaine + Resend vérifié', 'P1', 'DNS, SPF/DKIM/DMARC, emails délivrés', 'Développeur + registrar'],
    ['F16', 'Déclaration ARTCI / droit à l’image', 'P1', 'Récépissé et autorisations à fournir', 'Direction'],
]
table(d, ['N°', 'Fonctionnalité / correction', 'Priorité', 'Description', 'Responsable'], rows, [1.2, 4.4, 1.8, 7.2, 3.4])
d.add_heading('Notes', 2)
bullets(d, [
    'Aucune information n’a été inventée : les éléments ci-dessus viennent du site officiel ou du diagnostic technique.',
    'Chaque élément validé par l’école peut être intégré sans refaire le site.',
    'Les montants et abonnements sont détaillés dans le document 04.',
])
d.save(f'{OUT}/02-Fonctionnalites-a-ajouter.docx')

# ---------------------------------------------------------------- 3
d = base('3. Documents à fournir', 'Pièces à demander à l’école — checklist à cocher lors de l’entretien.')
rows = [
    ['Nom de domaine exact + gestionnaire DNS', 'Direction / registrar', 'Facture ou espace « Domaines » du registrar', 'Installation du domaine', '☐'],
    ['Nom et qualité du directeur de publication', 'Direction', 'Statuts / registre de l’association', 'Mentions légales', '☐'],
    ['Coordonnées de l’hébergeur actuel', 'Direction / comptabilité', 'Facture ou contrat d’hébergement', 'Mentions légales', '☐'],
    ['Durées de conservation', 'Secrétariat / direction', 'Règlement intérieur ou note de direction', 'Politique de confidentialité', '☐'],
    ['Récépissé de déclaration ARTCI', 'Direction', 'Dossier administratif (numéro + date)', 'Conformité', '☐'],
    ['Autorisations de droit à l’image', 'Secrétariat', 'Dossiers parents (site web + réseaux)', 'Légalité des photos', '☐'],
    ['Vrai mot de la Direction', 'Direction', 'Texte officiel', 'Page « Qui sommes-nous »', '☐'],
    ['Vrais PDF et fichiers audio', 'Secrétariat', 'Fiches, règlements, épisodes', 'Documents et Web Radio', '☐'],
    ['Planning inscriptions 2026-2027', 'Secrétariat', 'PDF de l’ancien site', 'Page Scolarité', '☐'],
    ['URL Facebook officielle', 'Communication', 'Ancien site / page Facebook', 'Footer et contact', '☐'],
    ['Liste des partenaires + statut UNESCO', 'Communication', 'Page « Partenaires » de l’ancien site', 'Page Partenaires', '☐'],
    ['Rôles admin et emails associés', 'Direction', 'Décision de la direction', 'Comptes Supabase Auth', '☐'],
    ['Adresse d’expédition des emails', 'Direction', 'Boîte groupescolaire@madeleinedanielou.ci', 'Resend / formulaire contact', '☐'],
]
table(d, ['Document / information', 'À demander à', 'Où le trouver', 'Utilisé pour', 'Reçu'], rows, [5.4, 3.2, 4.8, 4.2, 1.4])
d.add_heading('À remettre de ton côté', 2)
bullets(d, [
    'Le lien du site : https://madeleinedanielou.vercel.app',
    'Le devis et la facture (document 04).',
    'Les accès administrateurs via un lien de réinitialisation — jamais par email avec le mot de passe en clair.',
    'Une attestation d’hébergement et de domaine une fois le domaine installé.',
])
d.save(f'{OUT}/03-Documents-a-fournir.docx')

# ---------------------------------------------------------------- 4
d = base('4. Tarifs et abonnements', 'Montants indicatifs à confirmer — devis à faire valider par un comptable.')
d.add_heading('1. Prix de développement proposés', 2)
table(d, ['Option', 'Montant TTC conseillé', 'Ce que l’école paie'], [
    ['A. Développement seul', '300 000 FCFA', 'Elle règle à part le domaine et l’hébergement (~50–80 000 FCFA/an, à vérifier)'],
    ['B. Tout compris 12 mois (recommandé)', '450 000 FCFA', 'Rien d’autre pendant 12 mois : domaine, hébergement, base, emails inclus'],
    ['C. Tout compris + formation + suivi 1 an', '600 000 FCFA', 'Rien d’autre, avec 2 h de formation au secrétariat'],
], [5.4, 3.8, 9.8])
d.add_paragraph('Reconduction estimée à partir de l’année 2 : 50 000 à 80 000 FCFA/an (domaine + infrastructure).')

d.add_heading('2. Solutions gratuites', 2)
table(d, ['Service', 'Ce que ça apporte', 'Avantages', 'Inconvénients / limites'], [
    ['Vercel Hobby', 'Hébergement du site React', 'Gratuit, déploiement automatique depuis GitHub, HTTPS', 'Usage non commercial selon les conditions ; à vérifier pour une école'],
    ['Supabase Free', 'Base PostgreSQL + Auth', 'Gratuit, tableau de bord complet, JWT', 'Quotas limités (base, bande passante, emails Auth) ; à confirmer'],
    ['Resend Free', 'Envoi des emails du formulaire', 'Gratuit jusqu’à un certain volume mensuel', 'Domaine à vérifier quand même ; quota quotidien'],
    ['Dépôt GitHub public', 'Sauvegarde du code et historique', 'Gratuit, traçabilité des modifications', 'Le code est visible par tous si le dépôt est public'],
], [3.4, 4.4, 5.4, 5.8])

d.add_heading('3. Solutions payantes', 2)
table(d, ['Service', 'Coût indicatif', 'Avantages'], [
    ['Vercel Pro', '~20 USD / membre / mois (à vérifier)', 'Usage commercial, domaines multiples, analytics, meilleurs quotas'],
    ['Supabase Pro', '~25 USD / mois (à vérifier)', 'Base plus large, sauvegardes étendues, support, projets multiples'],
    ['Resend Pro', '~20 USD / mois (à vérifier)', 'Volume d’emails plus élevé, plusieurs domaines, support'],
    ['Fly.io (API)', 'Quelques USD / mois pour 1 machine partagée', 'API Node toujours disponible, logs, redémarrage automatique ; pas de plan gratuit permanent'],
    ['Nom de domaine .ci', '~10 000–30 000 FCFA / an (selon registrar)', 'Adresse institutionnelle crédible, email au nom de l’école'],
    ['Cloudinary (option)', 'Offre gratuite limitée puis forfaits', 'Stockage cloud des photos, transformation WebP automatique'],
], [3.4, 4.4, 11.2])
d.add_paragraph('Les tarifs ci-dessus sont indicatifs : ils doivent être vérifiés sur les sites officiels au moment de la facturation.')

d.add_heading('4. Recommandation', 2)
bullets(d, [
    'Option B — 450 000 FCFA tout compris 12 mois : l’école n’a rien à payer de supplémentaire et le domaine porte son nom.',
    'Vérifier l’abonnement Vercel actuel avant de signer : s’il est payant, l’intégrer dans le montant.',
    'Prévoir une reconduction de 50 000 à 80 000 FCFA/an à partir de l’année 2.',
    'Faire valider TVA, NIF et mentions légales par un comptable avant d’émettre la facture.',
])
d.save(f'{OUT}/04-Tarifs-et-abonnements.docx')


# ---------------------------------------------------------------- 5
d = base('5. Facturation sans comptable', 'Démarche pratique — informations générales, à confirmer auprès de la DGI (dgi.ci).')
d.add_heading('1. Première vérification à faire', 2)
bullets(d, [
    'Demander au secrétariat de l’école si elle exige un NIF (numéro d’identification fiscale) pour régler un prestataire. Les établissements paient souvent par virement et le demandent.',
    'Si un NIF est exigé : le demander à la DGI (dgi.ci ou centre des impôts le plus proche) AVANT d’envoyer la facture. Je n’en invente aucun.',
    'Si aucun NIF n’est exigé : émettre une facture avec la mention « NIF en cours d’attribution » et la régulariser dès obtention.',
    'Se renseigner sur le régime adapté (entreprise individuelle / auto-entrepreneur) directement auprès de la DGI : les conditions et pièces varient.',
])
d.add_heading('2. Modèle de facture sans NIF (à adapter)', 2)
table(d, ['Champ', 'Valeur à renseigner'], [
    ['Facture n°', '[ANNÉE-001] du [DATE]'],
    ['Prestataire', '[VOTRE NOM OU RAISON SOCIALE]'],
    ['Adresse / téléphone / email', '[VOS COORDONNÉES]'],
    ['NIF', 'NIF en cours d’attribution — à fournir dès obtention'],
    ['Client', 'Groupe Scolaire Madeleine-Daniélou Abidjan'],
    ['Désignation', 'Développement et mise en ligne du site institutionnel (12 mois tout compris)'],
    ['Montant HT', '[………] FCFA'],
    ['TVA', 'TVA non applicable en l’absence d’assujettissement — à confirmer'],
    ['Total TTC à payer', '450 000 FCFA (option recommandée)'],
    ['Paiement', 'Virement / espèces / mobile money — [MODALITÉS]'],
], [4.6, 14.4])
d.add_heading('3. À faire après encaissement', 2)
bullets(d, [
    'Conserver une copie du devis signé, de la facture et de la preuve de paiement.',
    'Déclarer le revenu selon le régime communiqué par la DGI.',
    'En cas de contrôle, présenter ces pièces : elles prouvent la prestation et la date.',
    'Mettre à jour la facture avec le NIF dès qu’il est attribué.',
])
d.add_heading('4. Ce que je ne peux pas décider à ta place', 2)
bullets(d, [
    'Ton statut juridique et ton numéro fiscal : ils dépendent de ton dossier personnel.',
    'Le taux de TVA applicable : à confirmer auprès de la DGI.',
    'La mention exacte à utiliser en l’absence de NIF : à valider avec le centre des impôts.',
])
d.add_paragraph('Ce document est une aide pratique, pas un avis comptable ou fiscal. Pour une somme de ce montant, un seul échange avec la DGI ou un centre de gestion agréé peut sécuriser toute la démarche.')
d.save(f'{OUT}/05-Facturation-sans-comptable.docx')

# ---------------------------------------------------------------- 6
d = base('6. Sécurisation et alertes de connexion', 'Notification à chaque connexion à l’espace administration GSMD.')
d.add_paragraph('Une alerte est désormais envoyée lorsqu’un administrateur se connecte. Le message contient uniquement : le compte, la date, l’adresse IP et le type d’appareil. Jamais de mot de passe ni de jeton.')
d.add_heading('1. Options de notification', 2)
table(d, ['Option', 'Coût', 'Avantages', 'Inconvénients'], [
    ['Email via Resend', 'Gratuit dans le quota', 'Déjà configuré, fiable, historique dans la boîte mail', 'Nécessite le domaine vérifié dans Resend'],
    ['Webhook (CallMeBot / Zapier / Make)', 'Gratuit ou selon service', 'Simple à brancher, possible WhatsApp', 'Service non officiel pour WhatsApp, fiabilité variable'],
    ['Twilio WhatsApp', 'Payant (à l’usage)', 'API WhatsApp officielle, fiable', 'Compte Twilio + numéro, coût par message'],
    ['Twilio appel vocal', 'Payant (à l’usage)', 'Appel immédiat en cas de connexion', 'Coût par minute, nécessite un numéro'],
    ['Journal d’audit seul', 'Inclus', 'Aucune dépendance externe', 'Aucune alerte en temps réel'],
], [4.4, 3.2, 6.4, 6.0])
d.add_heading('2. Ce que l’école doit décider', 2)
bullets(d, [
    'Qui reçoit l’alerte (email et/ou numéro WhatsApp et/ou numéro d’appel).',
    'Quel canal retenir : gratuit (email/webhook) ou payant officiel (Twilio).',
    'Si un appel est souhaité en plus du message.',
])
d.add_heading('3. Ce que tu dois me transmettre (jamais dans le chat)', 2)
bullets(d, [
    'Email de réception : à écrire toi-même dans ADMIN_NOTIFY_EMAIL via les secrets Fly.',
    'Webhook : l’URL complète fournie par ton service (CallMeBot/Zapier/Make).',
    'Twilio : Account SID, Auth Token, numéros From/To — à saisir dans les secrets Fly, pas dans un email.',
    'Commande : flyctl secrets set ADMIN_NOTIFY_EMAIL="..." -a madeleinedanielou-api',
])
d.add_heading('4. Vérification après configuration', 2)
bullets(d, [
    'Se connecter une fois à /admin/dashboard.',
    'Vérifier la réception du message ou de l’appel.',
    'Contrôler la ligne « connexion_admin » dans la table public.audit_log (Supabase).',
    'Ne jamais transmettre le mot de passe admin par WhatsApp : utiliser un lien de réinitialisation Supabase.',
])
d.add_heading('5. Sécurité déjà en place', 2)
bullets(d, [
    'Authentification Supabase Auth (JWT vérifié côté serveur à chaque requête).',
    'Limitation des tentatives de connexion et des notifications.',
    'Page /admin en noindex, secrets hors du dépôt, Helmet et CORS strict.',
    'Journal d’audit des consultations et exports.',
])
d.save(f'{OUT}/06-Securisation-et-alertes.docx')

print('Documents créés dans', OUT)
for f in sorted(os.listdir(OUT)):
    print(' -', f, os.path.getsize(os.path.join(OUT, f)), 'octets')
