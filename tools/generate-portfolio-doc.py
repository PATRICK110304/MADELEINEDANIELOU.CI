from docx import Document
from docx.shared import Pt, Cm, RGBColor
import os

OUT = '/home/patrick/Bureau/PORTFOLIO-PROJETS'
BLEU = RGBColor(0x0B, 0x5C, 0xA0)

d = Document()
s = d.sections[0]
s.top_margin = Cm(2); s.bottom_margin = Cm(2)
s.left_margin = Cm(2.2); s.right_margin = Cm(2.2)
st = d.styles['Normal']; st.font.name = 'Calibri'; st.font.size = Pt(10.5)
for n, size in [('Title', 22), ('Heading 1', 14), ('Heading 2', 11.5)]:
    x = d.styles[n]; x.font.name = 'Calibri'; x.font.size = Pt(size); x.font.bold = True; x.font.color.rgb = BLEU

p = d.add_paragraph('Portfolio — projets livrés'); p.style = d.styles['Title']
q = d.add_paragraph("Patrick N'Dri Kouakou Angelin — développeur web")
q.runs[0].italic = True

d.add_heading('Introduction', 1)
d.add_paragraph('Deux sites internet complets livrés pour des groupes scolaires à Abidjan. Chaque projet comprend un site public, un espace d’administration sécurisé, des documents professionnels remis à l’école et un accompagnement à la prise en main.')

d.add_heading('Projet 1 — Groupe Scolaire Farandole', 1)
d.add_paragraph('Site en ligne : https://farandoleci.vercel.app')
d.add_paragraph('Domaine final : farandole.ci (déjà possédé par l’école).')
d.add_heading('Ce qui a été réalisé', 2)
for i in [
    'Site vitrine complet : établissement, pédagogie, vie scolaire, actualités, galerie, contact.',
    'Visite virtuelle 360° du campus avec parcours plein écran et contrôles sur mobile.',
    'Web Radio des élèves : épisodes, lecteur audio, téléchargement MP3, publication depuis l’administration.',
    'Inscriptions en ligne : dossier complet, référence unique remise au parent, espace de suivi.',
    'Administration sécurisée : dossiers, actualités, messages, épisodes, double authentification.',
    '18 fiches PDF officielles et tarifs 2026-2027 téléchargeables.',
]:
    d.add_paragraph(i, style='List Bullet')
d.add_heading('Technologies', 2)
d.add_paragraph('Next.js 14, React, Tailwind CSS, Prisma, PostgreSQL Neon, Vercel, Kuula, fichiers chiffrés AES-256.')
d.add_heading('Documents livrés', 2)
d.add_paragraph('Cahier des charges, guide de test, tarifs 2026-2027, connexion admin confidentielle avec QR code 2FA, texte d’email.')
d.add_heading('Captures', 2)
d.add_paragraph('farandole-accueil-375.png (téléphone) et farandole-accueil-1280.png (ordinateur).')
d.add_heading('Tarif', 2)
d.add_paragraph('350 000 FCFA — développement clé en main, hébergement et services gratuits inclus.')

d.add_heading('Projet 2 — Groupe Scolaire Madeleine-Daniélou Abidjan', 1)
d.add_paragraph('Site en ligne : https://madeleinedanielou.vercel.app')
d.add_paragraph('API : https://madeleinedanielou-api.fly.dev')
d.add_heading('Ce qui a été réalisé', 2)
for i in [
    'Site institutionnel complet : établissement, enseignements, projet éducatif, guides parents, actualités, contact.',
    'Galerie intelligente : photos classées par événement, WebP, orientation EXIF corrigée, lightbox clavier et tactile.',
    'Pré-inscription en ligne en 3 étapes avec référence unique et consentement conforme.',
    'Administration en 6 modules : vue d’ensemble, pré-inscriptions, documents, podcasts, photos, messages.',
    'Authentification Supabase, base PostgreSQL, journal d’audit, page /admin en noindex.',
    'Sécurité active : limitation des tentatives, blocage automatique des IP, agent de surveillance, alerte avec boutons « Bloquer / Ce n’est pas une attaque » sur téléphone.',
    'Pages légales et politique de confidentialité, polices hébergées localement, accessibilité Lighthouse 100/100.',
]:
    d.add_paragraph(i, style='List Bullet')
d.add_heading('Technologies', 2)
d.add_paragraph('React 19, Vite, TypeScript, Tailwind 4, Express 4, Vercel, Fly.io, Supabase Auth, PostgreSQL, Resend.')
d.add_heading('Documents livrés', 2)
d.add_paragraph('Dossier de livraison en 6 fichiers (Lire d’abord, cahier des charges, guide de test, tarifs, connexion admin, texte email) et 7 documents complémentaires.')
d.add_heading('Captures', 2)
d.add_paragraph('madeleine-accueil-375.png (téléphone) et madeleine-accueil-1280.png (ordinateur).')
d.add_heading('Tarif', 2)
d.add_paragraph('450 000 FCFA — formule clé en main 12 mois.')

d.add_heading('Points communs aux deux projets', 1)
for i in [
    'Design responsive : téléphones, tablettes, ordinateurs et grands écrans.',
    'Accessibilité et lisibilité soignées, navigation clavier et contrastes vérifiés.',
    'Documentation professionnelle remise à l’école avec guide de test et modalités de contact.',
    'Hébergement et déploiement automatique, sécurité et sauvegardes de la base.',
]:
    d.add_paragraph(i, style='List Bullet')

d.add_heading('Développeur — contact', 1)
d.add_paragraph('📞 05 00 18 39 20 (appels + WhatsApp)')
d.add_paragraph('✉️ patrickndri120@gmail.com')
d.add_paragraph('💼 Portfolio : https://patrickdev-portfolio.vercel.app')
d.add_paragraph('💻 GitHub : https://github.com/PATRICK110304')

d.save(f'{OUT}/PRESENTATION-PROJETS.docx')
print('PRESENTATION-PROJETS.docx créé')
