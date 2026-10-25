import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export type SfxManifestEntry = {
  query: string;
  freesoundId: number;
  name: string;
  file: string;
  durationSeconds: number;
  license: string;
};

/**
 * Charge public/audio/sfx/manifest.json (généré par pipeline/sfx/sfx.ts).
 * Utilise delayRender/continueRender pour que le rendu attende le fetch —
 * nécessaire car le manifeste est un fichier public chargé en runtime,
 * pas un import statique bundlé.
 */
export function useSfxManifest(): SfxManifestEntry[] {
  const [manifest, setManifest] = useState<SfxManifestEntry[]>([]);

  useEffect(() => {
    const handle = delayRender("Chargement du manifeste SFX");

    fetch(staticFile("audio/sfx/manifest.json"))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SfxManifestEntry[]) => setManifest(data))
      .catch(() => setManifest([])) // pas de manifeste = pas de SFX, on ne bloque pas le rendu
      .finally(() => continueRender(handle));
  }, []);

  return manifest;
}

/**
 * Trouve le premier son du manifeste dont la requête d'origine contient
 * `query` (ex: findSfx(manifest, "whoosh")). Retourne le chemin staticFile
 * prêt à passer à <Audio src={...} />, ou null si rien n'a été téléchargé
 * pour cette recherche (lance d'abord `npx tsx pipeline/sfx/sfx.ts "whoosh"`).
 */
export function findSfx(
  manifest: SfxManifestEntry[],
  query: string
): string | null {
  const entry = manifest.find((m) =>
    m.query.toLowerCase().includes(query.toLowerCase())
  );
  return entry ? staticFile(`audio/sfx/${entry.file}`) : null;
}
