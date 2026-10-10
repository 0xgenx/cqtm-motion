# cqtm-motion

Templates vidéo motion design codés avec [Remotion](https://remotion.dev), pour les formats récurrents de Monsieur L : **Ce Que Tu Manges / E-numbers**, **Ça vs Ça**, **Aethyr**.

## Pourquoi Remotion ici

Chaque format vidéo répété (intro E-numbers, slide "Ça vs Ça", story de veille actu) devient un **composant React réutilisable** : on change les props (texte, couleurs, numéro de slide), le rendu s'exporte en vidéo automatiquement. Zéro refaire-le-montage-à-la-main à chaque épisode.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre le studio Remotion dans le navigateur pour prévisualiser et ajuster les compositions en direct.

## Rendre une vidéo

```bash
npx remotion render CQTM-Story out/video.mp4
```

## Templates disponibles

### `CQTM-Story` (`src/StorySlide.tsx`)
Format story 9:16 (1080×1920), pensé pour les stories/TikTok de veille actu et les épisodes E-numbers :
- Titre en fondu + léger scale à l'entrée
- Sous-titre optionnel
- **Numéro de slide incrusté en bas** (position configurable `bottom-left` / `bottom-right`) — pour connaître l'ordre de publication, conformément à la consigne permanente.
- Couleur d'accent et fond personnalisables par props

Props : `title`, `subtitle`, `slideNumber`, `totalSlides`, `accentColor`, `backgroundColor`, `numberPosition`.

## À venir

- Template intro générique "Ça vs Ça" (versus deux produits/plats)
- Template Aethyr (univers dark fantasy)
- Export automatisé en lot (batch render) pour une série de slides en une commande
