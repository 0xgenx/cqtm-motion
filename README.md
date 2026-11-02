# cqtm-motion

Templates vidéo motion design codés avec [Remotion](https://remotion.dev), pour les formats récurrents de Monsieur L : **Ce Que Tu Manges / E-numbers**, **Ça vs Ça**, **Aethyr**.

## Pourquoi Remotion ici

Chaque format vidéo répété (intro E-numbers, slide "Ça vs Ça", story de veille actu) devient un **composant React réutilisable** : on change les props (texte, couleurs, numéro de slide), le rendu s'exporte en vidéo automatiquement. Zéro refaire-le-montage-à-la-main à chaque épisode.

## Prérequis une seule fois

| Outil | Pourquoi | Installation |
|---|---|---|
| Node.js 20+ | Fait tourner Remotion | déjà sur ta machine (HP OmniBook) |
| `auto-editor` | Pré-montage auto des silences | `pip install auto-editor` |
| Clé API Freesound | Télécharger des bruitages CC0 | gratuite sur https://freesound.org/apiv2/apply/, puis `export FREESOUND_API_KEY=xxxx` (ou dans un fichier `.env`, déjà ignoré par Git) |
| Skill Claude Code Remotion | Générer des compositions par description dans Claude Code | `claude plugin marketplace add remotion-dev/claude-code-plugin` puis `claude plugin install remotion@remotion` (une fois, dans ton terminal — pas dans ce repo) |

Whisper.cpp (sous-titres) ne nécessite rien à installer à la main : `npm run transcribe` l'installe tout seul au premier lancement.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre le studio Remotion dans le navigateur pour prévisualiser et ajuster les compositions en direct. Toutes les compositions (`CQTM-Story`, `Demo-ClipSequence-Transitions`, `Demo-AnimatedText`, `Demo-Sfx-Wiring`) apparaissent dans la liste à gauche — clique dessus pour prévisualiser, la timeline se joue en direct.

## Comment produire un épisode, étape par étape

1. **Dérusher une vidéo brute** (si tu pars d'un enregistrement long avec des silences) :
   ```bash
   npm run autoedit -- chemin/vers/brut.mp4
   ```
   → produit `brut_deruse.mp4` à côté.

2. **Générer les sous-titres** (sur l'audio extrait de ta source, ou une voix off isolée) :
   ```bash
   npm run transcribe -- chemin/vers/audio.wav
   ```
   → produit `audio.captions.json`, à importer et passer à `<CaptionsOverlay captions={...} />`.

3. **Récupérer des bruitages** pour les cuts/impacts/textes choc :
   ```bash
   npm run sfx -- "whoosh transition" --count 3
   npm run sfx -- "stamp impact" --count 1
   ```
   → télécharge dans `public/audio/sfx/` et met à jour `manifest.json`. Dans ta composition : `const manifest = useSfxManifest(); const whoosh = findSfx(manifest, "whoosh");`

4. **Composer la vidéo** dans `src/` en combinant les briques ci-dessous (StorySlide, ClipSequence, AnimatedText, CaptionsOverlay), avec les SFX câblés en props.

5. **Prévisualiser** avec `npm run dev`, ajuster en direct.

6. **Rendre la vidéo finale** :
   ```bash
   npx remotion render <id-de-ta-composition> out/video.mp4
   ```

Pour générer une composition de zéro depuis une simple description, une fois la skill installée (voir prérequis) : ouvre Claude Code dans ce dossier et lance `/remotion:remotion-create "description de la vidéo"`.

## Templates et briques disponibles

### `CQTM-Story` (`src/StorySlide.tsx`)
Format story 9:16 (1080×1920), pensé pour les stories/TikTok de veille actu et les épisodes E-numbers :
- Titre en fondu + léger scale à l'entrée
- Sous-titre optionnel
- **Numéro de slide incrusté en bas** (position configurable `bottom-left` / `bottom-right`) — pour connaître l'ordre de publication, conformément à la consigne permanente.
- Couleur d'accent et fond personnalisables par props

Props : `title`, `subtitle`, `slideNumber`, `totalSlides`, `accentColor`, `backgroundColor`, `numberPosition`.

### `AnimatedText` (`src/text/AnimatedText.tsx`)
Texte choc réutilisable (titre, call-out, stat) avec entrée fondu + translation + scale, via [`remotion-animated`](https://github.com/stefanwittwer/remotion-animated). Remplace les effets "texte qui claque" codés à la main slide par slide. Prop `sfx` optionnelle pour un impact synchronisé à l'entrée. Démo : composition `Demo-AnimatedText` (sans son) et `Demo-Sfx-Wiring` (avec, une fois un son "impact" téléchargé).

### `ClipSequence` (`src/transitions/ClipSequence.tsx`)
Enchaîne plusieurs clips (rendus Grok/Aurora, slides, habillages) avec des transitions pro (`fade`, `slide`, `wipe`) via [`@remotion/transitions`](https://remotion.dev/docs/transitions) — remplace le montage manuel CapCut entre deux clips. Prop `sfxOnEnter` par clip pour un bruitage synchronisé au cut. Démo : composition `Demo-ClipSequence-Transitions`.

### `CaptionsOverlay` (`src/captions/CaptionsOverlay.tsx`)
Affiche des sous-titres mot par mot façon karaoké TikTok, à partir du JSON produit par `pipeline/captions/transcribe.ts`.

### `SilentRecipe` (`src/silent-recipe/`) — format « Recette muette »
Recette ou process d'usine raconté **sans voix ni texte** (audience internationale), en coupes franches d'environ une seconde, avec bruitages ASMR calés sur chaque coupe et un compteur final sans langue (emoji + chiffre + badges E). Analyse et angles : `docs/recette-muette.md`.

- **Pilote prêt** : `SilentRecipe-Nugget-Reels` (~42 s, Reels/Shorts) et `SilentRecipe-Nugget-TikTok` (~64 s : les plans ASMR passent au ralenti pour dépasser la minute, sans nouveau rush). La durée se recalcule toute seule.
- **Avant les rushes** : chaque plan s'affiche en carton (numéro, description, rush Grok prévu, barre de durée). On cale le rythme avant de dépenser des crédits.
- **Brancher un rush Grok** : déposer `clipXX.mp4` dans `public/silent-recipe/nugget/`, puis dans `src/silent-recipe/nuggetPilot.ts` remplacer `src: null` par `"silent-recipe/nugget/clipXX.mp4"` sur les plans de ce rush (`from` = seconde de départ dans le rush).
- **Par plan** : `seconds`, `asmr` (ralenti en version TikTok), `punch` (zoom d'impact), `sfx` (mot-clé du bruitage dans le manifeste).
- **Bruitages du pilote** à télécharger une fois : `factory hum`, `deep boom`, `meat grinder`, `powder pour`, `squish`, `hydraulic press`, `liquid pour`, `breadcrumbs`, `wet brush`, `deep fry`, `oil drip`, `cold wind`, `knife crispy`, `pop` (ex : `npm run sfx -- "deep fry" --count 1`).
- ⚠️ Le compteur du nugget est à `null` (affiche « ? ») tant que les faits ne sont pas vérifiés. Ne jamais publier dans cet état.

### SFX (`src/sfx/sfx.ts`, `src/sfx/SfxCue.tsx`)
`useSfxManifest()` charge la bibliothèque de sons téléchargés, `findSfx(manifest, "mot-clé")` retrouve un son par sa recherche d'origine, `<SfxCue src={...} startFrame={...} />` le place dans la composition. Ne bloque jamais le rendu si rien n'a encore été téléchargé (retourne `null`, pas d'erreur).

## Pipelines (hors composition, en ligne de commande)

| Commande | Fait quoi | Sort quoi |
|---|---|---|
| `npm run autoedit -- fichier.mp4` | Supprime silences/plans morts (auto-editor) | `fichier_deruse.mp4` |
| `npm run transcribe -- audio.wav` | Transcrit en local (Whisper) | `audio.captions.json` |
| `npm run sfx -- "recherche" --count N` | Télécharge N sons CC0 (Freesound) | fichiers dans `public/audio/sfx/` + `manifest.json` |

Détails techniques et choix de licence (CC0 uniquement) dans `TOOLKIT.md`.

## À venir

- Template intro générique "Ça vs Ça" (versus deux produits/plats)
- Template Aethyr (univers dark fantasy)
- Export automatisé en lot (batch render) pour une série de slides en une commande
- Musique de fond libre de droits intégrée en local (`public/audio/`), pour les formats YouTube/Instagram qui veulent la musique incrustée
