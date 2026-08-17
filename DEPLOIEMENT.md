# 🚀 Publier « Le Londres de Sherlock Holmes » sur GitHub Pages (gratuit)

Le site est 100 % statique (HTML/CSS/JS + images + audio, ~10 Mo hors corpus) : aucun serveur requis.

## Option A — Interface GitHub (5 minutes, sans ligne de commande)
1. Créez un compte GitHub (gratuit) → bouton **New repository** → nom : `sherlock-london-map` → **Public** → Create.
2. Dans le dépôt : **Add file → Upload files** → glissez TOUT le contenu du dossier `sherlock-map/`
   (index.html, css/, js/, data/, assets/ — le dossier `corpus/` est optionnel : gardez-le si vous voulez montrer la méthode, il pèse 4 Mo).
3. **Settings → Pages** → Source : `Deploy from a branch` → Branch : `main` + `/ (root)` → Save.
4. Après ~2 minutes, votre carte est en ligne à `https://VOTRE-PSEUDO.github.io/sherlock-london-map/`.

## Option B — Ligne de commande (depuis ce workspace ou votre PC)
```bash
cd sherlock-map
git init && git add -A && git commit -m "Le Londres de Sherlock Holmes — carte interactive canon"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/sherlock-london-map.git
git push -u origin main
# puis Settings → Pages → main / root, comme ci-dessus
```

## Notes techniques
- **Tuiles de carte** : CARTO/OSM via CDN — fonctionne tel quel en ligne. Usage intensif ? Créez une clé gratuite MapTiler et remplacez l'URL des tuiles dans `js/app.js` (1 ligne).
- **Audio** : les navigateurs exigent un geste utilisateur avant de jouer un son — c'est déjà géré (tout son part d'un clic).
- **Domaine personnalisé** (optionnel) : Settings → Pages → Custom domain (ex. `sherlock.votre-domaine.com`).
- **Mise à jour** : modifiez les fichiers `data/*.js` (lieux, affaires, quiz) — aucune compétence en code requise, la structure est lisible et commentée.

## Idées de monétisation immédiates (cf. rapports stratégiques)
- QR code vers la carte dans vos livres KDP (et lien retour vers vos livres dans le panneau Méthode).
- Version poster de la carte (export haute résolution des tuiles + marqueurs) sur Etsy.
- La carte = produit d'appel gratuit → newsletter (« recevez la carte de Dartmoor en HD ») → catalogue.

## 🎵 Remplacer l'ambiance par votre propre musique / son
Le bouton 🔇/🔊 joue par défaut une pluie générative (créée par code, aucun fichier).
Pour utiliser VOTRE propre bande-son :
1. Créez ou choisissez votre fichier audio (musique, ambiance de rue victorienne, etc.).
2. Nommez-le exactement `ambience.mp3` et déposez-le dans `assets/audio/`.
3. C'est tout — le site le détecte automatiquement au chargement et le joue EN BOUCLE
   (volume 35 %) à la place de la pluie. Supprimez le fichier pour revenir à la pluie.
Conseils : préférez un fichier bouclable (fondu début/fin), 1-3 Mo en 128 kbps suffit ;
les navigateurs exigent un clic avant de jouer du son — c'est déjà géré par le bouton.
