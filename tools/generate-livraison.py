from docx import Document
from docx.shared import Pt, Cm, RGBColor
import os

OUT = '/home/patrick/Bureau/GSMD-LIVRAISON'
os.makedirs(OUT, exist_ok=True)

BLEU = RGBColor(0x0B, 0x5C, 0xA0)
CORAIL = RGBColor(0xD9, 0x53, 0x2B)


def doc(title, subtitle):
    d = Document()
    s = d.sections[0]
    s.top_margin = Cm(2); s.bottom_margin = Cm(2)
    s.left_margin = Cm(2.2); s.right_margin = Cm(2.2)
    st = d.styles['Normal']; st.font.name = 'Calibri'; st.font.size = Pt(10.5)
    for n, size in [('Title', 22), ('Heading 1', 14), ('Heading 2', 11.5)]:
        x = d.styles[n]; x.font.name = 'Calibri'; x.font.size = Pt(size); x.font.bold = True; x.font.color.rgb = BLEU
    p = d.add_paragraph(title); p.style = d.styles['Title']
    q = d.add_paragraph(subtitle); q.runs[0].italic = True; q.runs[0].font.color.rgb = CORAIL
    return d


def h1(d, t): d.add_heading(t, 1)
def h2(d, t): d.add_heading(t, 2)
def p(d, t): d.add_paragraph(t)
def b(d, items):
    for i in items: d.add_paragraph(i, style='List Bullet')


def contact(d):
    h1(d, 'Développeur — contact')
    p(d, '📞 05 00 18 39 20 (appels + WhatsApp)')
    p(d, '✉️ patrickndri120@gmail.com')
    p(d, '💼 Portfolio : https://patrickdev-portfolio.vercel.app')
    p(d, '💻 GitHub : https://github.com/PATRICK110304')
    p(d, 'Pour un entretien, une formation ou une question, écrire ou appeler en précisant « Entretien site GSMD ».')


SITE = 'https://madeleinedanielou.vercel.app'
API = 'https://madeleinedanielou-api.fly.dev'

# ---------------------------------------------------------------- 0
d = doc("Groupe Scolaire Madeleine-Daniélou Abidjan — Livraison du site internet",
        f'Site en ligne : {SITE} — novembre 2026')
h1(d, 'Contenu de ce dossier')
b(d, [
    "0-LIRE-D'ABORD — ce résumé : le site, le tarif, les documents et le contact.",
    '1-CAHIER-DES-CHARGES — le document complet : fonctionnalités, sécurité, hébergement, tarif détaillé, ce que l’école doit fournir.',
    '2-GUIDE-DE-TEST — à imprimer ou envoyer : page par page, quoi vérifier, sur téléphone et sur ordinateur.',
    '3-TARIFS-ET-ABONNEMENTS — ce que coûte le site, ce qui est gratuit, ce qui peut devenir payant plus tard.',
    '4-CONNEXION-ADMIN — comment ouvrir l’espace de gestion et comment réagir aux alertes de sécurité.',
    '5-TEXTE-POUR-EMAIL.txt — le message à copier-coller pour envoyer ce dossier à l’école.',
])
h1(d, 'Tarif du site — résumé')
p(d, 'Développement clé en main (12 mois) : 450 000 FCFA TTC — 50 % à la commande, 50 % à la livraison.')
p(d, 'Hébergement du site (Vercel) : GRATUIT aujourd’hui.')
p(d, 'API et base de données (Fly.io + Supabase) : GRATUITES aujourd’hui dans les quotas.')
p(d, 'Nom de domaine : si l’école le possède déjà, sa connexion est INCLUSE et le renouvellement annuel reste à sa charge auprès du registrar.')
p(d, 'Emails (Resend) : gratuits dans le quota après vérification du domaine.')
p(d, 'Maintenance : corrections de contenu pendant 1 mois incluses ; bugs du code corrigés gratuitement à vie.')
h1(d, 'Résumé en 30 secondes')
b(d, [
    'Site vitrine complet : établissement, enseignements, projet éducatif, guides parents, actualités, galerie, Web Radio, contact.',
    'Galerie intelligente : photos classées par événement, affichage adapté, lightbox utilisable au clavier et au toucher.',
    'Pré-inscription en ligne : le parent remplit le dossier sur son téléphone et reçoit une référence (ex. INS-2026-A00A5C).',
    'Espace d’administration sécurisé : pré-inscriptions, documents, podcasts, photos et messages.',
    'Protection active : limitation des tentatives, blocage automatique des IP suspectes, alerte à chaque connexion avec boutons « Bloquer / Ce n’est pas une attaque » sur le téléphone.',
    'Parfaitement lisible sur petit téléphone, tablette, ordinateur et grand écran.',
])
contact(d)
d.save(f'{OUT}/0-LIRE-D ABORD.docx')

# ---------------------------------------------------------------- 1
d = doc('Cahier des charges — Site internet du Groupe Scolaire Madeleine-Daniélou Abidjan',
        'Version de livraison — novembre 2026')
p(d, f'Site en ligne : {SITE}')
p(d, 'Domaine final : madeleinedanielou.ci — à connecter dès que l’école le transmet.')
h1(d, '1. Présentation générale')
p(d, 'Site officiel du Groupe Scolaire Madeleine-Daniélou Abidjan, établissement de filles d’inspiration chrétienne ouvert à toutes, à Bingerville (400 m du carrefour de la Cité SIR, quartier Agbassi). Le site s’adapte automatiquement aux téléphones, tablettes, ordinateurs et grands écrans.')
h1(d, '2. Fonctionnalités réalisées')
h2(d, '2.1 Site public')
b(d, [
    'Accueil avec diaporama de trois photos, texte lisible, bouton toujours au même endroit, pastilles et contrôle de pause.',
    'Pages institutionnelles : qui sommes-nous, notre école, équipe, infrastructures, projet éducatif, guides parents.',
    'Enseignements : maternelle, primaire, collège, lycée, langues et options (contenus repris du site officiel).',
    'Vie du GSMD : actualités, résultats, galeries, cérémonie, radio, partenaires, contact.',
    'Pré-inscription en ligne : formulaire en 3 étapes, référence unique générée par le serveur, consentement non précoché.',
    'Galerie photos : événements, mosaïque, lightbox clavier/tactile, photos optimisées WebP avec orientation corrigée.',
    'Pages légales : mentions légales et politique de confidentialité, avec les champs restant à valider par l’école.',
])
h2(d, '2.2 Espace d’administration')
b(d, [
    'Tableau de bord : 4 indicateurs cliquables, bloc « À traiter », activité récente en dates relatives, actions rapides.',
    'Pré-inscriptions : compteurs par statut, répartition par niveau, recherche, filtres, export CSV, changement de statut.',
    'Documents, podcasts et photos : ajout, mise à jour, suppression, avec contrôle des fichiers envoyés.',
    'Messages de contact : liste, statut traité/non traité.',
    'Menu latéral avec pastilles de compteur, tiroir sur mobile, lien « Voir le site », déconnexion séparée.',
])
h2(d, '2.3 Sécurité et protection')
b(d, [
    'Connexion Supabase Auth : identité vérifiée côté serveur à chaque requête, jeton à durée limitée.',
    'Limitation des tentatives : 5 connexions / 15 min, 5 messages de contact / heure, 300 requêtes / 15 min.',
    'Blocage automatique : 10 échecs de connexion en 15 min → adresse bloquée 30 min, message d’alerte envoyé.',
    'Agent de surveillance : analyse toutes les 15 minutes, résumé en français, alerte et blocage prudent des adresses suspectes.',
    'Alerte interactive : chaque message contient « Bloquer cette connexion » et « Ce n’est pas une attaque », cliquables sur téléphone sans mot de passe.',
    'Journal d’audit : consultations et exports enregistrés dans la base.',
    'Page /admin en noindex, en-têtes de sécurité, CORS strict, secrets hors du dépôt.',
])
h1(d, '3. Hébergement et technologies')
p(d, 'Site : Vercel (déploiement automatique depuis GitHub). API : Fly.io. Base : Supabase PostgreSQL. Envoi d’emails : Resend. Authentification : Supabase Auth.')
h1(d, '4. Tarif détaillé')
p(d, 'Développement clé en main : 450 000 FCFA TTC. Paiement : 50 % à la commande, 50 % à la livraison.')
p(d, 'Ce prix couvre la conception, le développement, la sécurisation, la mise en ligne, la formation à l’administration et les corrections de contenu pendant 1 mois.')
b(d, [
    'Hébergement Vercel : gratuit aujourd’hui.',
    'API Fly.io et base Supabase : gratuites aujourd’hui dans les quotas ; la machine reste allumée pour la surveillance (quelques USD/mois à surveiller).',
    'Emails Resend : gratuits dans le quota, après vérification du domaine.',
    'Nom de domaine : connexion incluse si l’école le possède déjà ; renouvellement annuel à sa charge.',
    'À partir de l’année 2 : prévoir 50 000 à 80 000 FCFA/an pour le domaine et les services.',
])
h1(d, '5. Ce que l’école doit fournir')
b(d, [
    '☐ Le nom de domaine exact et l’accès au registrar ou la délégation DNS.',
    '☐ Le nom et la qualité du directeur de publication, les coordonnées de l’hébergeur actuel.',
    '☐ Les durées de conservation des données et la référence de déclaration ARTCI si elle existe.',
    '☐ Les autorisations de droit à l’image pour les photos d’élèves.',
    '☐ Les corrections de contenu signalées : histoire, horaires, mot de la Direction, menu de la cantine, classes disponibles.',
    '☐ Les vrais PDF et fichiers audio officiels, le planning des inscriptions 2026-2027.',
    '☐ L’URL Facebook officielle, la liste des partenaires et le statut UNESCO.',
    '☐ La décision sur les rôles admin (direction, secrétariat, communication) et les emails associés.',
])
h1(d, '6. Évolutions possibles')
b(d, [
    'Module d’actualités géré depuis l’administration.',
    'Albums annuels et planning des inscriptions intégrés.',
    'Notifications WhatsApp ou appel téléphonique (service officiel payant) en plus de l’email.',
    'Cloudflare gratuit devant le site dès le domaine disponible (protection DDoS et WAF).',
])
contact(d)
d.save(f'{OUT}/1-CAHIER-DES-CHARGES.docx')

# ---------------------------------------------------------------- 2
d = doc('Guide de test — Site du Groupe Scolaire Madeleine-Daniélou Abidjan',
        'À suivre depuis un téléphone OU un ordinateur — 15 à 20 minutes')
p(d, f'Site : {SITE}')
h1(d, 'A. Visite des pages publiques (10 min)')
p(d, 'Tester sur TÉLÉPHONE d’abord (cas d’usage principal des parents), puis sur ordinateur.')
b(d, [
    '☐ Accueil : les trois photos du diaporama s’affichent ; le bouton « Mettre en pause » fonctionne ; les pastilles sont faciles à toucher.',
    '☐ Le texte du hero reste lisible et le bouton de pré-inscription ne bouge pas d’une diapositive à l’autre.',
    '☐ Qui sommes-nous / Enseignements / Projet éducatif / Guides parents : chaque page s’ouvre, titres et textes lisibles.',
    '☐ Galerie : cliquer une carte événement ouvre sa galerie ; cliquer une photo ouvre le lightbox ; Échap et les flèches fonctionnent.',
    '☐ Photos : défilement fluide, pas de photos à l’envers, images légères.',
    '☐ Contact : envoyer un message de test ; la confirmation s’affiche.',
])
h1(d, 'B. Pré-inscription (le test clé)')
b(d, [
    '☐ Ouvrir la page Inscriptions puis le formulaire de pré-inscription.',
    '☐ Remplir les deux premières étapes avec des données de TEST (ex. « TEST DIRECTION », téléphone fictif).',
    '☐ À la troisième étape : la case de consentement est bien vide au départ et le lien vers la politique de confidentialité s’ouvre.',
    '☐ Envoyer : une référence apparaît (ex. INS-2026-XXXX) — la noter.',
    '☐ Vérifier dans l’administration que le dossier de test est bien présent.',
])
h1(d, 'C. Espace d’administration (5-10 min)')
p(d, 'Identifiants et procédure : voir le fichier 4-CONNEXION-ADMIN.')
b(d, [
    '☐ Ouvrir /admin/dashboard et se connecter avec le compte autorisé.',
    '☐ Tableau de bord : les 4 cartes, le bloc « À traiter » et les actions rapides s’affichent.',
    '☐ Cliquer chaque onglet : Pré-inscriptions, Documents, Podcasts, Photos, Messages.',
    '☐ Sur téléphone : le bouton menu ouvre le tiroir, les onglets sont accessibles, la fermeture fonctionne.',
    '☐ Déclencher une connexion : le message d’alerte doit partir ; les boutons « Bloquer » et « Ce n’est pas une attaque » doivent agir.',
    '☐ Se déconnecter puis se reconnecter.',
])
h1(d, 'D. Checklist tous appareils')
b(d, [
    '☐ Petit téléphone Android : tout tient à l’écran, pas de défilement horizontal bizarre.',
    '☐ iPhone : boutons faciles à toucher au pouce, encoche respectée.',
    '☐ Tablette : deux colonnes, menus complets.',
    '☐ Ordinateur : sous-menus accessibles au clavier, lien « Aller au contenu » au premier Tab.',
    '☐ Projecteur / TV : le texte reste lisible au fond de la salle.',
])
h1(d, 'E. En cas de problème')
b(d, [
    'Une page ne charge pas : vérifier la connexion, réessayer ; si ça persiste, noter la page et l’heure.',
    'Un bouton ne fait rien : noter l’appareil et la page.',
    'Une alerte n’arrive pas : vérifier que le domaine est bien vérifié dans Resend.',
    'Une adresse bloquée par erreur : appeler le développeur, le déblocage prend quelques secondes.',
])
contact(d)
d.save(f'{OUT}/2-GUIDE-DE-TEST.docx')

# ---------------------------------------------------------------- 3
d = doc('Tarifs et abonnements — Groupe Scolaire Madeleine-Daniélou Abidjan',
        'Montants indicatifs à confirmer — devis à valider par l’école')
h1(d, '1. Le travail du développeur')
b(d, [
    'Option A — Développement seul : 300 000 FCFA TTC. L’école gère le domaine et l’hébergement.',
    'Option B — Clé en main 12 mois (recommandé) : 450 000 FCFA TTC. L’école ne paie rien d’autre pendant un an.',
    'Option C — Clé en main + formation + suivi 1 an : 600 000 FCFA TTC.',
    'Paiement : 50 % à la commande, 50 % à la livraison.',
    'À partir de l’année 2 : 50 000 à 80 000 FCFA/an pour le domaine et les services.',
])
h1(d, '2. Ce qui est gratuit aujourd’hui')
b(d, [
    'Vercel (hébergement du site) : gratuit, déploiement automatique, HTTPS. Limite : usage non commercial selon les conditions, à vérifier pour une école.',
    'Supabase (base et connexion) : gratuite dans les quotas. Limite : quota d’emails et de base à surveiller.',
    'Resend (emails) : gratuit jusqu’à un certain volume. Limite : domaine à vérifier obligatoirement.',
    'GitHub (code source) : gratuit, historique des modifications. Limite : dépôt public visible par tous.',
])
h1(d, '3. Ce qui peut devenir payant')
b(d, [
    'Vercel Pro : environ 20 USD / membre / mois — usage commercial, statistics avancées.',
    'Supabase Pro : environ 25 USD / mois — base plus large, sauvegardes étendues.',
    'Resend Pro : environ 20 USD / mois — volume d’emails plus élevé.',
    'Fly.io : quelques USD / mois pour garder l’API et l’agent de surveillance actifs.',
    'Nom de domaine .ci : environ 10 000 à 30 000 FCFA / an selon le registrar — à la charge de l’école si elle le possède.',
    'Twilio (WhatsApp ou appel) : payant à l’usage — officiel et fiable, seulement si l’école le souhaite.',
])
h1(d, '4. Recommandation')
b(d, [
    'Partir sur l’option B : 450 000 FCFA tout compris la première année, sans mauvaise surprise pour l’école.',
    'Si l’école possède déjà le domaine, sa connexion est incluse et son renouvellement reste à sa charge.',
    'Les montants payants ne sont jamais engagés sans accord écrit de l’école.',
    'TVA, NIF et mentions légales à valider avec la DGI avant facturation.',
])
contact(d)
d.save(f'{OUT}/3-TARIFS-ET-ABONNEMENTS.docx')

# ---------------------------------------------------------------- 4
d = doc('Connexion à l’administration et alertes de sécurité',
        'À transmettre uniquement à la personne désignée par la direction')
h1(d, '1. Ouverture de l’espace')
b(d, [
    f'Adresse : {SITE}/admin/dashboard',
    'Compte autorisé : admin@madeleinedanielou.ci',
    'Le mot de passe n’est pas écrit dans ce document. Il est remis séparément par le développeur, ou réinitialisé depuis Supabase → Authentication → Users.',
    'En cas d’oubli : utiliser « Send magic link » / « Reset password » depuis le tableau de bord Supabase.',
])
h1(d, '2. Ce qui se passe à chaque connexion')
b(d, [
    'Un message est envoyé au responsable désigné : compte utilisé, heure, adresse technique de l’appareil.',
    'Le message arrive par email (gratuit), ou par WhatsApp / appel si l’école choisit une option payante.',
    'Le message contient deux boutons : « Bloquer cette connexion » et « Ce n’est pas une attaque ».',
])
h1(d, '3. Comment réagir')
b(d, [
    'Vous reconnaissez la personne : appuyez sur « Ce n’est pas une attaque ». Le blocage est annulé immédiatement.',
    'Vous ne reconnaissez pas : appuyez sur « Bloquer cette connexion ». L’accès est bloqué pour une heure de plus.',
    'Aucun mot de passe à saisir : le lien du message suffit. Il ne fonctionne qu’une fois.',
    'Si une personne légitime est bloquée par erreur, appeler le développeur : le déblocage prend quelques secondes.',
])
h1(d, '4. Bonnes habitudes')
b(d, [
    'Ne jamais envoyer le mot de passe dans un groupe WhatsApp.',
    'Choisir un mot de passe unique, avec majuscules, chiffres et symbole.',
    'Ne pas transmettre les clés Resend, la chaîne de base de données ou les tokens d’hébergement.',
])
contact(d)
d.save(f'{OUT}/4-CONNEXION-ADMIN.docx')

# ---------------------------------------------------------------- 5
email = """TEXTE À COPIER-COLLER DANS VOTRE E-MAIL
=======================================

OBJET : Site internet du Groupe Scolaire Madeleine-Daniélou Abidjan — livraison et guide de test

VERSION COMPLÈTE (recommandée)
------------------------------

Bonjour,

J'ai l'honneur de vous transmettre le site internet du Groupe Scolaire
Madeleine-Daniélou Abidjan, aujourd'hui en ligne et fonctionnel :

    https://madeleinedanielou.vercel.app

Vous trouverez en pièces jointes :

  1. Le cahier des charges : fonctionnalités, sécurité, hébergement, tarif,
     documents à fournir ;
  2. Le guide de test : un pas-à-pas simple (15 à 20 minutes), sur téléphone
     et sur ordinateur ;
  3. Les tarifs et abonnements : ce qui est inclus, ce qui est gratuit,
     ce qui peut devenir payant plus tard ;
  4. La connexion à l'espace d'administration et les alertes de sécurité
     (à transmettre uniquement à la personne désignée par la direction) ;
  5. Ce résumé « Lire d'abord ».

Le site comprend notamment les pages institutionnelles, les enseignements,
la galerie photos, la pré-inscription en ligne et un espace d'administration
protégé. Chaque connexion à l'administration déclenche une alerte avec des
boutons permettant de bloquer immédiatement une activité suspecte depuis un
téléphone.

Je reste disponible pour un entretien (au bureau de l'école, par téléphone
ou en visio) afin de présenter le site, valider les contenus, former l'équipe
et organiser la mise en service.

Pour toute question :

    📞 05 00 18 39 20 (appels + WhatsApp)
    ✉️ patrickndri120@gmail.com
    💼 https://patrickdev-portfolio.vercel.app
    💻 https://github.com/PATRICK110304

Cordialement,

Patrick
Développeur web

VERSION COURTE
--------------

Bonjour,

Le site du Groupe Scolaire Madeleine-Daniélou Abidjan est en ligne :
https://madeleinedanielou.vercel.app

En pièces jointes : le cahier des charges, le guide de test (15 min),
les tarifs, et la connexion à l'administration (à transmettre seulement à
la personne désignée).

Je reste à votre disposition pour un entretien à votre convenance.

📞 05 00 18 39 20 · ✉️ patrickndri120@gmail.com
💼 https://patrickdev-portfolio.vercel.app · 💻 https://github.com/PATRICK110304

Cordialement, Patrick — Développeur web

CONSEILS D'ENVOI
----------------
• Joindre les fichiers 0, 1, 2 et 3 au premier email.
• Envoyer le fichier 4 SÉPARÉMENT, uniquement à la personne désignée.
• Le nom de domaine et les informations légales sont à confirmer avec l'école.
"""
open(f'{OUT}/5-TEXTE-POUR-EMAIL.txt', 'w').write(email)

print('Dossier GSMD-LIVRAISON créé :')
for f in sorted(os.listdir(OUT)):
    print(' -', f, os.path.getsize(os.path.join(OUT, f)), 'octets')
