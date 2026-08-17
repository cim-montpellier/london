# 🎩 PROJET VITRINE — « LE LONDRES DE SHERLOCK HOLMES » Carte interactive cinématographique
Chef de projet : Agent Arena · Démarré le 17/08/2026

## VISION
La carte littéraire interactive la plus complète jamais réalisée sur le canon holmésien :
tous les lieux londoniens des 4 romans + 56 nouvelles, sourcés par citations exactes
(méthode canon-first), habillage photoréaliste cinématographique « 1895 », et des
interactions ludiques originales (poursuites animées, brouillard de découverte,
quiz de déduction, chasse à Moriarty, annexes 221B et Tamise).

## MACHINE À ÉTATS (une phase = un « CONTINUER » de l'utilisateur)

| Phase | Contenu | Images | Statut |
|---|---|---|---|
| **P0 — SOCLE** | Corpus canon téléchargé (9 vol.) ✔ · extraction brute 226 lieux ✔ · architecture app ✔ · carte Leaflet mode « 1895 » ✔ · 35 lieux majeurs curés avec citations ✔ · panneau latéral, filtres, recherche ✔ · 2 poursuites animées (fiacre STUD + vedette Aurora SIGN) ✔ · 10 visuels héros ✔ · serveur live ✔ | 10 | ✅ TERMINÉ |
| **P1 — GAZETTEER COMPLET** | Passe canon-first systématique livre par livre → 100+ lieux avec citation/référence chapitre · badge CANON/DÉDUIT pour les adresses fictives géolocalisées · filtre par récit (60 histoires) · 10 images de lieux supplémentaires | 10 | ✅ TERMINÉ (108 lieux, 12 catégories, 45 récits couverts) |
| **P2 — POURSUITES & AFFAIRES** | Mode « scrollytelling » : 6 grandes affaires rejouées pas à pas sur la carte (STUD, SIGN, REDH, SCAN, EMPT, BRUC) · itinéraires animés multi-étapes · chronologie 1881-1914 avec curseur | 10 | ✅ TERMINÉ (6 affaires, 44 étapes, timeline 1874-1914) |
| **P3 — ANNEXES IMMERSIVES** | Plan interactif du salon du 221B (hotspots : le fauteuil, le V.R. en balles, la persane à tabac…) · carte annexe de la poursuite sur la Tamise · carte « Angleterre des affaires » (Dartmoor, Reichenbach…) | 10 | ✅ TERMINÉ (14 hotspots 221B, annexe Tamise 8 étapes, 12 lieux hors Londres) |
| **P4 — JEUX** | Chasse à Moriarty · Quiz Élémentaire · Brouillard de Londres · Missions des Irréguliers | 6 | ✅ TERMINÉ |
| **P5 — AMBIANCE SONORE & FINITIONS** | 8 citations audio (2 voix choisies par l'utilisateur : Holmes=voice-00, Watson=voice-01) · ambiance pluie générative WebAudio (zéro fichier) · galerie des voix (panneau Méthode) · bouton ♪ contextuel par lieu · page Méthode finalisée · DEPLOIEMENT.md GitHub Pages | 0 img / 8 audio | ✅ TERMINÉ |
| **P6 — BONUS** (optionnel) | Version anglaise · export posters des cartes · easter eggs supplémentaires | — | ⏳ |

## RÈGLES DE PRODUCTION
1. Canon-first : aucun lieu sans citation source (texte Gutenberg, livre+récit référencés).
2. Adresses fictives (221B, Saxe-Coburg Sq., Pondicherry Lodge…) : géolocalisation argumentée + badge « position déduite ».
3. ≤ 10 images générées par réponse ; style unifié « photoréalisme cinématographique 1895, brume, becs de gaz, grain pellicule ».
4. Tout l'état du projet vit dans ce fichier + /data ; chaque phase reprend où la précédente s'est arrêtée.
5. UI en français, citations BILINGUES : VO exacte (preuve canon vérifiable) + traduction française maison en dessous. Décision utilisateur du 17/08. Fichier : data/quotes_fr.js, couverture 100 % (QC automatisé).

## DÉCISIONS TECHNIQUES
- Leaflet 1.9 (CDN) + tuiles CARTO/OSM passées en mode « 1895 » (filtre sépia + vignettage + grain).
- Données = data/locations.js (JS embarqué, pas de fetch → robustesse).
- Serveur : python http.server 0.0.0.0:8000 (aperçu live). Déploiement final : GitHub Pages.
- Animations poursuites : interpolation sur polylignes (requestAnimationFrame).

## JOURNAL
- 17/08 P0 : corpus 9 volumes téléchargé (685k mots) ; extraction regex → 226 candidats ; app socle construite ; 35 lieux curés ; 2 poursuites ; 10 images ; serveur lancé.
- 17/08 P1 : gazetteer 106 lieux (data/locations.js + locations_p1.js) ; badges canon/déduit ; filtre par récit (44 récits couverts, sélecteur avec titres complets) ; 10 nouvelles images (Appledore, Norwood, Irréguliers, Covent Garden, Pondicherry, Aldgate, Briony, Camden House, Simpson's, Alpha Inn) → 20 lieux illustrés au total ; QC : 0 doublon, 0 entrée incomplète, 0 image manquante, syntaxe OK, HTTP 200.
- 17/08 P2 : mode Affaires (scrollytelling) : STUD (7 étapes), SIGN (8), SCAN (6), REDH (7), EMPT (8), BRUC (8) = 44 étapes, marqueurs numérotés + itinéraire pointillé + flyTo par étape, navigation Précédent/Suivant/pastilles ; timeline 1874-1914 (curseur, 60 récits datés, lieux grisés dynamiquement, compteur) ; 10 images d'étapes (RACHE, arrestation de Hope, grenier Sholto, Toby à l'aube, mariage St Monica, Good-night Mister Sherlock Holmes, cave aux napoléons, révélation du libraire, Moran à la fenêtre, brouillard de novembre) ; QC : syntaxe OK, 0 image manquante, timeline 100% couverte, HTTP 200. Bug guillemets attrapé par QC et corrigé.
- 17/08 P3 : annexe 221B (overlay plein écran : illustration maîtresse du salon + 14 hotspots sourcés — 18 citations re-vérifiées dans le corpus, dont seven-per-cent solution — progression « objets découverts x/14 ») ; annexe Tamise (mini-carte Leaflet dédiée mode 1895, 8 étapes commentées Westminster→Plumstead avec images début/fin) ; annexe Angleterre (12 sites hors Londres : Dartmoor, Stoke Moran, Reichenbach, Canterbury, Sussex des abeilles… zoom national auto) ; 10 images (salon, babouche, V.R., coin chimie, Stradivarius, buste de cire, 2 Tamise, Chien de Dartmoor, Reichenbach) ; QC : 0 image manquante, syntaxe OK, HTTP 200 ; correction géo Birlstone (Sussex).
- 17/08 P4 : mode Jeux complet — Chasse à Moriarty (5 énigmes séquentielles cliquées sur la carte, citations à l'appui, écran de victoire avec portrait du Professeur) ; Quiz Élémentaire (20 questions géolocalisées mélangées, flyTo par question, explications sourcées, 4 grades : Client/Irrégulier/Watson/Mycroft avec badges photoréalistes) ; Brouillard de Londres (canvas destination-out : lanterne autour du centre carte + trous permanents par lieu consigné, HUD x/106) ; Missions des Irréguliers (8 repérages chronométrés 75 s, shillings + prime de rapidité, paye finale, seuil guinée=21s) ; jeux branchés sur le clic marqueur sans casser l'exploration ; QC : cibles 100 % valides, 0 doublon, 6 images présentes, syntaxe OK, HTTP 200.

- 17/08 P5 : audio — 8 répliques canon (Holmes : Afghanistan, 17 marches, Napoleon of crime, Aurora, the woman ; Watson : cesspool, gigantic hound, best and wisest) reliées aux lieux (♪ dans les tooltips + bouton dans le panneau) + galerie complète dans Méthode ; ambiance « pluie sur Baker Street » 100 % générative (WebAudio : bruit filtré + LFO rafales + rumeur grave 44 Hz, toggle 🔇/🔊 topbar) ; page Méthode enrichie (bilan complet + crédits) ; DEPLOIEMENT.md (GitHub Pages pas à pas + monétisation) ; QC GLOBAL FINAL : 106 lieux, 6 affaires/44 étapes, 2 poursuites, 14 hotspots, 8 étapes Tamise, 12 sites Angleterre, 20 quiz + 5 énigmes + 8 missions (cibles 100 % valides), 46 images (0 manquante), 8 audio (0 manquant), syntaxe OK, HTTP 200, site ~10 Mo. PROJET LIVRÉ. ✔

- 17/08 P5bis : bilinguisme des citations (décision utilisateur : option « Pléiade ») — data/quotes_fr.js (150 traductions maison, domaine public) ; helper bq() appliqué aux 6 surfaces (panneau lieu, Angleterre, étapes d'affaires, hotspots 221B, Tamise, chasse à Moriarty) ; style .vf discret sous la VO ; règle 5 mise à jour ; QC : 188 citations (40 notices déjà FR + 148 VO), 0 VO sans traduction, syntaxe OK, HTTP 200.

- 17/08 P6 (audit + bilinguisme FR/EN) :
  · AUDIT COMPLET : 66 fichiers servis HTTP 200 (100 %), syntaxe validée sur les 8 JS, 106 lieux (0 champ manquant, 0 coordonnée aberrante, 0 statut invalide), 44 sigles tous datés, 8 clips audio présents et reliés à des lieux valides, 14 hotspots dans le cadre, 20 questions quiz avec réponses valides.
  · OPTION LANGUE FR/EN : bouton EN/FR dans la barre (préférence mémorisée en localStorage). Nouveaux fichiers : data/i18n_en_locations.js (106 lieux traduits : name/desc/fun) et data/i18n_en_content.js (UI 86 clés ×2, 6 affaires/44 étapes, 14 objets du salon, 8 étapes Tamise, 12 sites Angleterre, 5 énigmes Moriarty, 20 questions de quiz, 4 grades, 8 missions). Moteur : T()/locName()/caseStepText()… + applyLang() qui retraduit toute l'UI à chaud (modes, filtres reconstruits, splash, panneaux, overlays, jeux) et rafraîchit les vues ouvertes. Comportement des citations : FR = VO + traduction française ; EN = VO seule (le texte original EST l'anglais). Tooltips dynamiques par fonction (retraduits au survol).
  · QC I18N : 0 lieu sans EN, affaires synchronisées, 14/14, 8/8, 20/20 (options alignées), 8/8, 5/5, 4/4, 0 site Angleterre manquant, 86/86 clés UI identiques FR/EN. HTTP 200.
  PROJET COMPLET ET BILINGUE. ✔

- 17/08 P7 (FOND DE CARTE D'ÉPOQUE — retour utilisateur « fond laid/illisible ») :
  · Remplacement du fond CARTO+filtre sépia par de VRAIES cartes victoriennes géoréférencées (National Library of Scotland, CC-BY) : base = OS one-inch 2nd ed. 1885-1900 (toute l'Angleterre, z≤16) + surcouche OS London 1890s (immeuble par immeuble, z10-18, errorTile transparent hors emprise). Testé par sondes HTTP sur tuiles réelles avant intégration (z7→z18, points extrêmes du gazetteer : Plumstead/Brixton/Hampstead/Woolwich OK ; Harrow Weald et Gravesend hors emprise → retombent sur le one-inch).
  · Bouton 🗺️ 1895 / 🌙 Nuit dans la barre (bascule fond victorien / fond sombre stylisé, préférence localStorage).
  · Habillage adapté : filtre léger sepia(.18) sur papier (le sombre reste en mode nuit), vignette allégée, grain réduit, marqueurs réduits (22px/30px) avec liseré crème pour lisibilité sur papier + désencombrement par zoom (z<12 : majeurs seuls ; z12 : majeurs+canon ; z≥13 : tout).
  · Annexe Tamise passée sur le même fond d'époque. QC : syntaxe OK, HTTP 200.

- 17/08 P7bis (SÉLECTEUR DE FONDS, suggestion utilisateur) : liste déroulante dans la barre remplaçant le bouton bascule. Registre BASEMAPS extensible — 6 fonds testés par sondes HTTP avant intégration : 🗺️ Londres 1895 (OS 1inch + London 5ft NLS), 🚂 Angleterre 1890 (1inch seul), 🌙 Nuit victorienne (CARTO voyager + filtre sombre), 📜 Parchemin épuré (CARTO light + sépia), 🏙️ Londres moderne (OSM), 🛰️ Vue aérienne (Esri — comparaison alors/aujourd'hui). Habillage par fond via classes body tile-css-* (filtres et vignette adaptés à chaque style), labels bilingues FR/EN reconstruits au changement de langue, préférence localStorage. Booth Poverty Map testée : pas de serveur de tuiles public → écartée. QC : syntaxe OK, HTTP 200.

## CAMPAGNE D'ILLUSTRATION TOTALE (P8) — 1 image par point d'intérêt
Style verrouillé : « Photorealistic cinematic still, Victorian London 1881-1902, 35mm film grain, teal-amber grade, ultra detailed » (cohérence collection).
Reste à produire : 86 lieux + 10 sites Angleterre = 96 images → 10 lots de ≤10 (un lot par « CONTINUER »).
- LOT 1 ✅ (fait, lié, QC ok) : pinchin, stmonica, parklane, whitehall, godolphin, caulfield, woolwich, northumberland, bowstreet, trafalgar
- LOT 2 ✅ (fait, lié, QC ok) : bakerstation, paddington, waterloo, charingcross, montague, threadneedle, kennington, brookstreet, wigmore, audley
- LOT 3 ✅ (9/10 — goodge bloquée par modération [scène de rixe], reportée en tête du lot 4 avec prompt apaisé « après la bagarre »)
- LOT 4 ✅ (10/10 dont reprise goodge réussie, lié, QC ok)
- LOT 5 ✅ (10/10, lié, QC ok — howestreet décalé lot 6)
- LOT 6 ✅ (10/10, lié, QC ok — strand décalé lot 7)
- LOT 7 ✅ (10/10, lié, QC ok — lowther décalé lot 8)
- LOT 8 ✅ (10/10, lié, QC ok — limehouse décalé lot 9)
- LOT 9 ⏳ : limehouse, camberwell_house, wisteria_esher, aldersgate, gravesend, bart_morgue, langham + Angleterre : Stoke Moran, Trumpington, Douvres, Canterbury
- LOT 10 ✅ (5 img neuves + réutilisation loc_shoscombe — CAMPAGNE TERMINÉE)
Après chaque lot : liaison img dans data/*.js + QC existence fichiers + HTTP 200.

- 17/08 P8 TERMINÉE — CAMPAGNE D'ILLUSTRATION TOTALE : 106/106 lieux de Londres + 12/12 sites d'Angleterre illustrés. 96 images produites en 10 lots (2 incidents gérés : goodge bloquée par modération → reprise « aftermath » réussie ; 2 réutilisations intelligentes stokemoran/shoscombe). Style unifié « cinématographique 1895 » sur toute la collection. QC final : 0 image manquante, 0 orpheline, HTTP 200. Chaque point de la carte a désormais son illustration. ✔

- 17/08 P9 (retrait des mentions IA du site, demande utilisateur) : légendes d'images FR/EN → « Reconstitution photoréaliste — édition canon » / « Photorealistic reconstruction — canon edition » ; crédits du panneau Méthode réécrits (« Illustrations et lectures audio : créations originales de l'éditeur », mention Arena.ai retirée, compteur d'illustrations corrigé 36→140) ; QC grep exhaustif sur *.js/*.html/*.css : 0 occurrence restante ; DEPLOIEMENT.md (non servi) vérifié ; HTTP 200. NB : PROJET_ETAT.md et DEPLOIEMENT.md sont des documents de travail internes non affichés sur le site.

- 17/08 P10 (complétion visuelle annexes + musique custom) : salon 221B 11/14 hotspots illustrés (+6 : couteau, fauteuil du client, fenêtres, scrap-books, gasogène, dix-sept marches — restent 3 : peau d'ours, solution 7%, malle) ; Tamise : image PAR ÉTAPE (6/8 : départ, sortie Aurora, Pool, projecteur Greenwich, coup de feu Blackwall, marais — restent 2 : Face à la Tour, trésor au fond) ; moteur thShow() mis à jour (s.img au lieu de img_start/img_end) ; AMBIANCE PERSONNALISABLE : si assets/audio/ambience.mp3 existe (détection HEAD au chargement), il est joué en boucle à 35% à la place de la pluie générative — mode d'emploi ajouté à DEPLOIEMENT.md ; QC : 0 fichier manquant, syntaxe OK, HTTP 200. Prochain tour : 5 images restantes (3 hotspots + 2 Tamise).

- 17/08 P10 TERMINÉE : salon 221B 14/14 hotspots illustrés ✔ · Tamise 8/8 étapes illustrées ✔ (dont l'affût face à la Tour et le trésor coulant dans les profondeurs) · solution 7% traitée par l'écrin de maroquin (anti-modération) · QC INTÉGRAL : 145 images référencées, 0 manquante, 0 orpheline, 9 fichiers audio, syntaxe OK, HTTP 200. TOUS LES POINTS DU SITE SONT ILLUSTRÉS. Musique custom : déposer assets/audio/ambience.mp3 (doc dans DEPLOIEMENT.md). PROJET COMPLET. 🎩

- 17/08 P11 (complétion des AFFAIRES, signalement utilisateur) : audit → seulement 10/44 étapes illustrées. Stratégie en 2 temps : (1) réutilisation intelligente de 24 images existantes parfaitement raccord avec les étapes (Criterion, St Barts, 221B, Lyceum, Thaddeus, Jacobson, chase_aurora, Langham, Pope's Court, Saxe-Coburg, St James's Hall, Aldersgate, Park Lane, Baker St nuit, Camden, salon restauré, Aldgate, Woolwich, Caulfield, Goldini…) ; (2) 10 images NEUVES pour les moments sans équivalent : les six perles de Mary, Holmes palefrenier, la lettre d'adieu d'Irene, l'indignation de Jabez Wilson, l'arrestation de John Clay, la collision du bibliophile, la capture de Moran, le cambriolage patriotique, la souricière de Charing Cross, l'épingle d'émeraude. RÉSULTAT : 44/44 étapes illustrées ✔ (STUD 7/7, SIGN 8/8, SCAN 6/6, REDH 7/7, EMPT 8/8, BRUC 8/8), 0 fichier manquant, HTTP 200. Le scrollytelling est désormais 100 % visuel.

- 17/08 P12 (contrôle qualité visuel utilisateur — 7 régénérations) :
  · Motif 1 — ressemblance à un acteur réel (interdite) sur case_sign_pearls, case_redh_wilson, case_stud_rache, loc_thaddeus → régénérées avec physionomies CANONIQUES de Sidney Paget/Conan Doyle (Holmes : très maigre, front haut dégarni, nez aquilin en bec de faucon, lèvres minces — Thaddeus : petit, chauve, couronne de cheveux roux, dents jaunes irrégulières) + consigne explicite « original fictional face, resembling no real actor or celebrity » dans chaque prompt.
  · Motif 2 — incohérences de scène sur case_empt_bookseller (révélation illogique), case_redh_clay (action confuse), game_moriarty (composition) → régénérées en « single coherent scene/action » avec logique lumineuse à source unique ; Moriarty conforme à FINA (front en dôme, yeux enfoncés, oscillation reptilienne).
  · Contrôle visuel effectué sur 3 images (pearls, clay, moriarty) : conformes. HTTP 200.
  RÈGLE DE PRODUCTION AJOUTÉE : tout personnage récurrent = description canonique verbale verrouillée + interdiction de célébrités, à copier dans chaque prompt futur.
