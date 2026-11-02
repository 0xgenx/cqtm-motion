/**
 * Format « Recette muette » : une recette (ou un process d'usine) racontée
 * sans voix ni texte, en coupes très serrées (~1 plan/seconde), avec
 * bruitages ASMR et un compteur final lisible dans toutes les langues.
 * Voir docs/recette-muette.md.
 */

export type SilentShot = {
  /**
   * Chemin du rush dans public/ (ex: "silent-recipe/nugget/clip03.mp4"),
   * ou null tant que le clip Grok n'est pas généré : un carton de
   * prévisualisation s'affiche à la place, avec la description du plan.
   */
  src: string | null;
  /** Seconde du rush où le plan commence (un clip Grok de 10 s donne 3-5 plans). */
  from?: number;
  /** Durée du plan à l'écran en secondes, à vitesse normale. */
  seconds: number;
  /** Description du plan : affichée sur le carton tant que src est null. */
  description: string;
  /** Rush Grok prévu pour ce plan (aide-mémoire affiché sur le carton). */
  plannedClip?: string;
  /**
   * Plan ASMR (coulure, friture, croûte en macro…). Dans la variante
   * "tiktok", ces plans passent au ralenti pour dépasser une minute sans
   * générer de nouveaux rushes.
   */
  asmr?: boolean;
  /**
   * Mot-clé du bruitage joué au cut (recherche d'origine dans
   * public/audio/sfx/manifest.json, ex: "deep fry"). Ignoré s'il n'est pas
   * encore téléchargé.
   */
  sfx?: string;
  sfxVolume?: number;
  /** Léger zoom d'impact à l'entrée du plan (coupe « qui claque »). */
  punch?: boolean;
};

export type SilentCounter = {
  /**
   * Valeur finale du compteur (ex: 35 pour « 35 % »). null tant que le fait
   * n'est pas vérifié : le carton affiche alors « ? » (ne jamais publier ainsi).
   */
  value: number | null;
  /** Texte collé après le nombre (ex: " %"). Rester sur des symboles universels. */
  suffix?: string;
  /** Emoji au-dessus du nombre (ex: "🍗"). */
  emoji?: string;
  /** Codes des additifs alignés sous le compteur (ex: ["E450", "E160c"]). */
  badges?: string[];
  accentColor?: string;
  /** Durée du carton final en secondes. */
  seconds?: number;
  /** Bruitage à l'apparition de chaque badge. */
  badgeSfx?: string;
  /** Bruitage au moment où le compteur s'arrête. */
  endSfx?: string;
};

export type SilentRecipeProps = {
  shots: SilentShot[];
  counter: SilentCounter;
  /**
   * "reels" : rythme de référence (Reels/Shorts, ~45 s).
   * "tiktok" : plans ASMR ralentis pour passer la minute.
   */
  variant: "reels" | "tiktok";
  /** Vitesse des plans ASMR en variante tiktok (0.5 = deux fois plus long). */
  asmrSlowMotion?: number;
  /** Musique de fond dans public/ (ex: "audio/music/beat.mp3"), optionnelle. */
  music?: string | null;
  musicVolume?: number;
  /** Volume du son d'origine des rushes Grok (bruitages générés). */
  clipVolume?: number;
};
