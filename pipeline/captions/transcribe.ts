/**
 * Transcription locale (Whisper.cpp) pour sous-titres au mot près.
 * 100% local, gratuit, pas de clé API — cf. TOOLKIT.md §1.
 *
 * Usage :
 *   npx tsx pipeline/captions/transcribe.ts chemin/vers/audio.wav
 *
 * Produit un JSON de captions (format @remotion/captions) à côté du fichier
 * source, réutilisable par un composant <CaptionsOverlay> dans src/, ou
 * exportable en .srt pour TikTok/YouTube si tu préfères leurs sous-titres natifs.
 */
import path from "path";
import fs from "fs";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const WHISPER_VERSION = "1.7.3";
const MODEL = "medium" as const; // bon compromis précision/vitesse pour le FR

async function main() {
  const audioPath = process.argv[2];
  if (!audioPath) {
    console.error("Usage: tsx pipeline/captions/transcribe.ts <fichier.wav>");
    process.exit(1);
  }

  const resolvedAudioPath = path.resolve(audioPath);
  if (!fs.existsSync(resolvedAudioPath)) {
    console.error(`Fichier introuvable : ${resolvedAudioPath}`);
    process.exit(1);
  }

  const whisperFolder = path.join(process.cwd(), ".whisper-cpp");

  console.log("Installation de whisper.cpp (une seule fois)...");
  await installWhisperCpp({ to: whisperFolder, version: WHISPER_VERSION });

  console.log(`Téléchargement du modèle "${MODEL}" (une seule fois)...`);
  await downloadWhisperModel({ model: MODEL, folder: whisperFolder });

  console.log("Transcription en cours...");
  const whisperCppOutput = await transcribe({
    inputPath: resolvedAudioPath,
    whisperPath: whisperFolder,
    whisperCppVersion: WHISPER_VERSION,
    model: MODEL,
    tokenLevelTimestamps: true,
    language: "fr",
  });

  const { captions } = toCaptions({ whisperCppOutput });

  const outPath = resolvedAudioPath.replace(/\.[^.]+$/, ".captions.json");
  fs.writeFileSync(outPath, JSON.stringify(captions, null, 2), "utf-8");

  console.log(`Captions écrites dans ${outPath}`);
  console.log(`${captions.length} tokens transcrits.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
