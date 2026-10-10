# Boîte à outils motion design CQTM

Recherche des briques à assembler pour couvrir les deux besoins : (1) monter automatiquement une vidéo brute (sous-titres, bruitages, effets) et (2) composer des vidéos animées avec personnages, comme les épisodes E-numbers/À l'usine/Produit décortiqué.

## 1. Sous-titres automatiques — `@remotion/install-whisper-cpp` + `@remotion/captions`

Officiel Remotion, 100% local (whisper.cpp), gratuit, pas de clé API, timestamps au mot près.

- Installe et fait tourner Whisper localement sur le son extrait de la vidéo
- Sort une transcription avec timing précis par mot
- `@remotion/captions` fournit les composants pour afficher ces sous-titres avec le style qu'on veut : classique en bas, karaoké mot-par-mot, ou **aucun affichage à l'écran** si on préfère générer un `.srt` exportable séparément (utile pour TikTok/YouTube qui gèrent leurs propres sous-titres)
- Doc : https://www.remotion.dev/docs/captions/transcribing , https://remotion.dev/docs/install-whisper-cpp/convert-to-captions

→ Répond directement au "monte-moi ça tout seul" : on reste dans l'écosystème Remotion, zéro service tiers payant.

## 2. Pré-montage automatique (silences, coupes) — `auto-editor`

[WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor) (open source, CLI, Python) — "Effort free video editing". Détecte et supprime automatiquement les silences/plans morts d'une vidéo brute avant import, pour ne garder que les passages utiles.

→ Étape de pré-traitement avant que la vidéo entre dans Remotion : raccourcit le travail de dérushage.

## 3. Bruitages (SFX) — Freesound API

[freesound.org](https://freesound.org/help/developers) — bibliothèque énorme de sons sous licence Creative Commons, API gratuite, wrapper npm disponible ([`freesound`](https://npmjs.com/package/freesound)).

**Attention licence** : filtrer uniquement les sons **CC0** (domaine public, zéro attribution requise) pour rester cohérent avec ta règle "aucun partenariat, aucune dépendance à une marque" — les CC-BY demandent de créditer l'auteur, ce qui n'est pas adapté à des shorts TikTok/Instagram.

## 4. Musique de fond

Pour les vidéos qui sortent du cadre TikTok (YouTube, Instagram si tu veux la musique intégrée plutôt qu'ajoutée à la publication comme aujourd'hui) : bibliothèques libres de droits à intégrer en local dans le repo (dossier `public/audio/`), pour rester 100% autonome sans dépendance API à chaque rendu.

## 5. Personnages et effets visuels — composition Remotion

Tes personnages sont aujourd'hui générés par Grok/Aurora (clips vidéo + voix incluse) — ce ne sont pas des assets statiques à animer dans Remotion, mais des **clips sources à composer, transitionner et habiller**. Le rôle de Remotion ici :

- **`@remotion/transitions`** : transitions pro entre clips (cut, fade, wipe, slide) au lieu d'un montage CapCut manuel
- **`@remotion/lottie`** : pour des éléments graphiques additionnels en vecteur (logo loupe animé, icônes, effets de surcouche) qui ne viennent pas de Grok
- **Effets maison en React/CSS** : zoom Ken Burns (remplace le workaround CapCut), glitch, flash, vignette, grain, surimpression de texte choc — tout scriptable et réutilisable d'un épisode à l'autre sans repartir de zéro
- **Overlays sonores synchronisés** aux cuts et aux effets (swoosh sur une transition, impact sur un texte qui claque)

## Prochaine étape

Une fois qu'on a une vidéo brute à traiter (ou un premier clip Grok), ce toolkit se transforme en pipeline concret dans `src/` : `transcribe.ts` (sous-titres), `autoEdit.ts` (silences), `sfx.ts` (bruitages), et des compositions Remotion qui les assemblent.
