import type { SilentRecipeProps, SilentShot } from "./types";

/**
 * Pilote « NUGGET — l'usine muette » (docs/recette-muette.md, §5).
 *
 * Sept rushes Grok de 10 s, découpés en plans d'environ une seconde.
 * Tant qu'un rush n'existe pas, src reste à null et un carton s'affiche.
 * Pour brancher un rush : déposer le fichier dans
 * public/silent-recipe/nugget/ et remplacer null par
 * "silent-recipe/nugget/clipXX.mp4" sur les plans concernés.
 *
 * ⚠️ Faits non vérifiés : la part de viande et la liste d'additifs d'un
 * nugget industriel type doivent être confirmées (Open Food Facts) avant
 * publication. Le compteur reste à null (« ? ») d'ici là, et les badges
 * E450 / E160c sont une hypothèse de casting tirée de la bible.
 */

// Raccourci : un plan découpé dans un rush Grok.
const cut = (
  plannedClip: string,
  from: number,
  seconds: number,
  description: string,
  extra: Partial<SilentShot> = {}
): SilentShot => ({ src: null, plannedClip, from, seconds, description, ...extra });

const shots: SilentShot[] = [
  // 1 — L'arrivée du méchant (accroche < 2 s)
  cut("clip01.mp4", 0, 1.3, "Plan large : ligne de nuit, un filet de poulet seul sur le tapis", { sfx: "factory hum" }),
  cut("clip01.mp4", 1.5, 1.1, "E450 apparaît derrière le tapis, sourire carnassier", { punch: true, sfx: "deep boom" }),
  cut("clip01.mp4", 3, 0.9, "Gros plan : ses yeux se plissent", { punch: true }),

  // 2 — Le broyage
  cut("clip01.mp4", 4, 1.1, "Mains à quatre doigts : il jette le filet dans la trémie", { sfx: "meat grinder" }),
  cut("clip01.mp4", 5.5, 1.4, "Macro : la pâte de poulet sort du hachoir", { asmr: true }),
  cut("clip01.mp4", 7.5, 0.9, "Il ricane sans bruit, poussière blanche qui tombe"),

  // 3 — La poudre (prompt complet dans la doc, §6.2)
  cut("clip02.mp4", 0, 1.1, "Il regarde la pâte, puis l'objectif", { punch: true }),
  cut("clip02.mp4", 2, 1.6, "Macro ralenti : la poudre blanche coule de sa paume", { asmr: true, sfx: "powder pour" }),
  cut("clip02.mp4", 5, 1.6, "Macro : la pâte gonfle et devient brillante", { asmr: true, sfx: "squish" }),
  cut("clip02.mp4", 8, 1.1, "Snap zoom : ricanement silencieux", { punch: true }),

  // 4 — Le moulage
  cut("clip03.mp4", 0, 1.1, "Presse hydraulique qui descend", { sfx: "hydraulic press" }),
  cut("clip03.mp4", 2, 0.9, "Formes de nuggets parfaits qui tombent", { punch: true, sfx: "hydraulic press" }),
  cut("clip03.mp4", 4, 1.1, "E450 fait rouler un nugget cru entre deux doigts"),
  cut("clip03.mp4", 6.5, 1.3, "Plan large : nuggets alignés à l'infini sur le tapis"),

  // 5 — Bain de pâte et panure (ASMR, comme le reel)
  cut("clip04.mp4", 0, 1.4, "Macro : nugget plongé dans la pâte liquide", { asmr: true, sfx: "liquid pour" }),
  cut("clip04.mp4", 2, 1.6, "Macro ralenti : coulure épaisse qui s'égoutte", { asmr: true }),
  cut("clip04.mp4", 5, 1.4, "Nuage de chapelure, le nugget roule dedans", { asmr: true, sfx: "breadcrumbs" }),
  cut("clip04.mp4", 8, 1.2, "Panure en macro, grains qui tombent", { asmr: true }),

  // 6 — E160c repeint la panure
  cut("clip05.mp4", 0, 1.1, "E160c entre dans le cadre, pinceau dégoulinant", { punch: true, sfx: "wet brush" }),
  cut("clip05.mp4", 2, 1.3, "Coup de pinceau : la panure pâle devient orange doré", { sfx: "wet brush" }),
  cut("clip05.mp4", 5, 1.1, "Il savoure, la pâte paprika coule de ses doigts"),
  cut("clip05.mp4", 7.5, 1.1, "Rangée de nuggets désormais dorés", { punch: true }),

  // 7 — Friture (ASMR)
  cut("clip06.mp4", 0, 1.2, "Chute dans l'huile, éclaboussure ralentie", { asmr: true, sfx: "deep fry" }),
  cut("clip06.mp4", 2, 1.8, "Friture en macro, bulles autour de la croûte", { asmr: true }),
  cut("clip06.mp4", 5, 1.4, "Panier relevé, l'huile s'égoutte", { asmr: true, sfx: "oil drip" }),
  cut("clip06.mp4", 8, 1.4, "Macro de la croûte dorée", { asmr: true }),

  // 8 — Surgélation
  cut("clip07.mp4", 0, 1.3, "Tunnel de froid, souffle glacé", { sfx: "cold wind" }),
  cut("clip07.mp4", 2, 1.1, "Le givre recouvre les nuggets", { punch: true }),

  // 9 — La coupe (plan récompense, comme le fromage qui coule)
  cut("clip07.mp4", 4, 1.1, "Couteau au-dessus d'un nugget", { sfx: "knife crispy" }),
  cut("clip07.mp4", 5.5, 2.0, "Macro ralenti : la coupe révèle une pâte homogène, sans fibre", { asmr: true }),
  cut("clip07.mp4", 8, 1.3, "Le nugget revient sur le tapis, à la place du filet du début (boucle)"),
];

export const nuggetPilotProps: SilentRecipeProps = {
  shots,
  counter: {
    value: null, // À remplir après vérification (part de viande, en %).
    suffix: " %",
    emoji: "🍗",
    badges: ["E450", "E160c"], // Hypothèse de casting : à confirmer sur une étiquette type.
    seconds: 3,
    badgeSfx: "pop",
    endSfx: "deep boom",
  },
  variant: "reels",
  asmrSlowMotion: 0.45,
  music: null,
  musicVolume: 0.4,
  clipVolume: 1,
};
