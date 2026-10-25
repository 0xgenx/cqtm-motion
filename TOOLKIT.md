# Boîte à outils motion design CQTM

Recherche des briques à assembler pour couvrir les deux besoins : (1) monter automatiquement une vidéo brute (sous-titres, bruitages, effets) et (2) composer des vidéos animées avec personnages, comme les épisodes E-numbers/À l'usine/Produit décortiqué.

## 1. Sous-titres automatiques — `@remotion/install-whisper-cpp` + `@remotion/captions` ✅ installé

Officiel Remotion, 100% local (whisper.cpp), gratuit, pas de clé API, timestamps au mot près.

- Installe et fait tourner Whisper localement sur le son extrait de la vidéo
- Sort une transcription avec timing précis par mot
- `@remotion/captions` fournit les composants pour afficher ces sous-titres avec le style qu'on veut : classique en bas, karaoké mot-par-mot, ou **aucun affichage à l'écran** si on préfère générer un `.srt` exportable séparément (utile pour TikTok/YouTube qui gèrent leurs propres sous-titres)
- Doc : https://www.remotion.dev/docs/captions/transcribing , https://remotion.dev/docs/install-whisper-cpp/convert-to-captions

→ Répond directement au "monte-moi ça tout seul" : on reste dans l'écosystème Remotion, zéro service tiers payant.

**Implémenté** : `pipeline/captions/transcribe.ts` (lance Whisper, écrit un `.captions.json`) + `src/captions/CaptionsOverlay.tsx` (affichage karaoké mot-par-mot). Commande : `npm run transcribe -- fichier.wav`.

## 2. Pré-montage automatique (silences, coupes) — `auto-editor` ✅ installé

[WyattBlue/auto-editor](https://github.com/WyattBlue/auto-editor) (open source, CLI, Python) — "Effort free video editing". Détecte et supprime automatiquement les silences/plans morts d'une vidéo brute avant import, pour ne garder que les passages utiles.

→ Étape de pré-traitement avant que la vidéo entre dans Remotion : raccourcit le travail de dérushage.

**Implémenté** : `pipeline/autoedit/autoEdit.ts`, wrapper Node autour de la CLI Python (qui n'est pas un paquet npm — installation système requise une fois : `pip install auto-editor`). Commande : `npm run autoedit -- fichier.mp4`. Produit `fichier_deruse.mp4` à côté du fichier source.

## 3. Bruitages (SFX) — Freesound API ✅ installé

[freesound.org](https://freesound.org/help/developers) — bibliothèque énorme de sons sous licence Creative Commons, API gratuite.

**Attention licence** : filtrer uniquement les sons **CC0** (domaine public, zéro attribution requise) pour rester cohérent avec ta règle "aucun partenariat, aucune dépendance à une marque" — les CC-BY demandent de créditer l'auteur, ce qui n'est pas adapté à des shorts TikTok/Instagram.

**Implémenté** : `pipeline/sfx/sfx.ts` — appel direct à l'API REST Freesound (le wrapper npm `freesound` est abandonné depuis des années, pas utilisé), filtre `license:"Creative Commons 0"` systématique. Commande : `npm run sfx -- "whoosh transition" --count 3`. Télécharge dans `public/audio/sfx/` et tient à jour un `manifest.json`. Côté composition, `src/sfx/sfx.ts` (`useSfxManifest`, `findSfx`) et `src/sfx/SfxCue.tsx` chargent ce manifeste et placent le son à la bonne frame — déjà câblés en option dans `ClipSequence` (`sfxOnEnter`, un bruitage au cut) et `AnimatedText` (`sfx`, un impact à l'entrée du texte).

Prérequis : une clé API gratuite sur https://freesound.org/apiv2/apply/, exportée en `FREESOUND_API_KEY`.

## 4. Musique de fond

Pour les vidéos qui sortent du cadre TikTok (YouTube, Instagram si tu veux la musique intégrée plutôt qu'ajoutée à la publication comme aujourd'hui) : bibliothèques libres de droits à intégrer en local dans le repo (dossier `public/audio/`), pour rester 100% autonome sans dépendance API à chaque rendu.

## 5. Personnages et effets visuels — composition Remotion ✅ transitions + texte animé installés

Tes personnages sont aujourd'hui générés par Grok/Aurora (clips vidéo + voix incluse) — ce ne sont pas des assets statiques à animer dans Remotion, mais des **clips sources à composer, transitionner et habiller**. Le rôle de Remotion ici :

- **`@remotion/transitions`** : transitions pro entre clips (cut, fade, wipe, slide) au lieu d'un montage CapCut manuel — **implémenté** dans `src/transitions/ClipSequence.tsx` (démo : composition `Demo-ClipSequence-Transitions`)
- **`remotion-animated`** : au lieu de `@remotion/lottie` (qui demande des fichiers Lottie externes), on anime texte/formes directement en React avec easing/spring — **implémenté** dans `src/text/AnimatedText.tsx` (démo : composition `Demo-AnimatedText`). `@remotion/lottie` reste une option si tu veux un jour importer un vrai fichier Lottie (logo loupe vectoriel animé par ex.)
- **Effets maison en React/CSS** : zoom Ken Burns (remplace le workaround CapCut), glitch, flash, vignette, grain — toujours à faire au cas par cas, `AnimatedText` couvre déjà la surimpression de texte choc
- **Overlays sonores synchronisés** aux cuts et aux effets (swoosh sur une transition, impact sur un texte qui claque) — **implémenté** via `src/sfx/SfxCue.tsx`, câblé dans `ClipSequence` et `AnimatedText` (voir §3)

## 6. Skill officielle Remotion pour Claude Code

[`remotion-dev/claude-code-plugin`](https://remotion.dev/docs/ai/claude-code-plugin) — plugin **côté client** (pas une dépendance du repo) qui ajoute la commande `/remotion:remotion-create "description"` à Claude Code pour générer des compositions directement depuis une description texte.

Installation (à faire une fois, dans ton terminal, pas dans ce repo) :
```bash
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
```
Puis redémarrer Claude Code et lancer une session dans ce dossier.

## Prochaine étape

Tout le toolkit prévu est implémenté. Reste à utiliser : voir "Comment utiliser tout ça" dans le README. Templates officiels Remotion à récupérer au besoin si un nouveau format apparaît : [`template-tiktok`](https://github.com/remotion-dev/template-tiktok) (sous-titres clé en main), [`template-audiogram`](https://github.com/remotion-dev/template-audiogram) (clip audio → vidéo avec waveform), [`template-prompt-to-motion-graphics-saas`](https://remotion.dev/templates/prompt-to-motion-graphics) (texte → composition).
