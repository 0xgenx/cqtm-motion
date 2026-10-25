/**
 * Pré-montage automatique : supprime les silences et plans morts d'une
 * vidéo brute avant import dans Remotion — cf. TOOLKIT.md §2.
 *
 * Wrapper autour de la CLI Python `auto-editor` (WyattBlue/auto-editor,
 * open source, MIT) : ce script ne réimplémente rien, il l'installe au
 * besoin et l'appelle avec des réglages adaptés au dérushage de clips
 * courts (TikTok/Instagram).
 *
 * Prérequis système (une seule fois) :
 *   pip install auto-editor
 *   (ou : pipx install auto-editor, si tu préfères un environnement isolé)
 *
 * Usage :
 *   npx tsx pipeline/autoedit/autoEdit.ts chemin/vers/brut.mp4
 *   npx tsx pipeline/autoedit/autoEdit.ts chemin/vers/brut.mp4 --margin 0.3sec
 *
 * Produit <nom>_dérushé.mp4 à côté du fichier source.
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

function isAutoEditorInstalled(): boolean {
  const check = spawnSync("auto-editor", ["--version"], { stdio: "ignore" });
  return check.status === 0;
}

function main() {
  const args = process.argv.slice(2);
  const inputPath = args[0];

  if (!inputPath) {
    console.error("Usage: tsx pipeline/autoedit/autoEdit.ts <fichier.mp4> [--margin 0.2sec]");
    process.exit(1);
  }

  const resolvedInput = path.resolve(inputPath);
  if (!fs.existsSync(resolvedInput)) {
    console.error(`Fichier introuvable : ${resolvedInput}`);
    process.exit(1);
  }

  if (!isAutoEditorInstalled()) {
    console.error(
      [
        "`auto-editor` n'est pas installé sur cette machine.",
        "Installe-le une seule fois avec :",
        "  pip install auto-editor",
        "(ou : pipx install auto-editor)",
        "Puis relance cette commande.",
      ].join("\n")
    );
    process.exit(1);
  }

  const ext = path.extname(resolvedInput);
  const base = path.basename(resolvedInput, ext);
  const dir = path.dirname(resolvedInput);
  const outputPath = path.join(dir, `${base}_deruse${ext}`);

  // Marge par défaut autour de chaque plan gardé, pour ne pas couper trop sec
  // sur une respiration ou le début d'un mot. Ajustable via --margin.
  const marginFlagIndex = args.indexOf("--margin");
  const margin = marginFlagIndex >= 0 ? args[marginFlagIndex + 1] : "0.2sec";

  console.log(`Pré-montage de ${resolvedInput}...`);
  const result = spawnSync(
    "auto-editor",
    [resolvedInput, "--margin", margin, "--no-open", "-o", outputPath],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    console.error("auto-editor a échoué — voir la sortie ci-dessus.");
    process.exit(result.status ?? 1);
  }

  console.log(`Vidéo dérushée : ${outputPath}`);
}

main();
