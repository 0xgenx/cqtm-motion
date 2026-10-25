/**
 * Recherche et téléchargement de bruitages (SFX) depuis Freesound, filtrés
 * **CC0 uniquement** (domaine public, zéro attribution requise) — cf.
 * TOOLKIT.md §3. Pas de dépendance npm tierce : appel direct à l'API REST
 * Freesound (le wrapper npm `freesound` est abandonné depuis des années).
 *
 * Prérequis : une clé API gratuite sur https://freesound.org/apiv2/apply/
 * exportée dans l'environnement : FREESOUND_API_KEY=xxxx
 *
 * Usage :
 *   npx tsx pipeline/sfx/sfx.ts "whoosh transition" --count 3
 *   npx tsx pipeline/sfx/sfx.ts "stamp impact" --count 1
 *
 * Télécharge les previews haute qualité (mp3) dans public/audio/sfx/ et
 * met à jour public/audio/sfx/manifest.json (nom → fichier + métadonnées),
 * consommé par src/sfx/sfx.ts côté composition.
 */
import fs from "fs";
import path from "path";

const API_BASE = "https://freesound.org/apiv2";
const OUT_DIR = path.join(process.cwd(), "public", "audio", "sfx");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");

type FreesoundResult = {
  id: number;
  name: string;
  license: string;
  duration: number;
  previews: { "preview-hq-mp3": string };
};

type ManifestEntry = {
  query: string;
  freesoundId: number;
  name: string;
  file: string;
  durationSeconds: number;
  license: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readManifest(): ManifestEntry[] {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
}

function writeManifest(entries: ManifestEntry[]) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

async function searchCC0(query: string, count: number): Promise<FreesoundResult[]> {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FREESOUND_API_KEY manquante. Crée une clé gratuite sur https://freesound.org/apiv2/apply/ puis exporte-la : export FREESOUND_API_KEY=xxxx"
    );
  }

  const params = new URLSearchParams({
    query,
    token: apiKey,
    filter: 'license:"Creative Commons 0"',
    fields: "id,name,license,duration,previews",
    sort: "rating_desc",
    page_size: String(Math.min(count * 3, 30)), // marge pour filtrer les doublons de nom
  });

  const res = await fetch(`${API_BASE}/search/text/?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Freesound API a renvoyé ${res.status} : ${await res.text()}`);
  }

  const json = (await res.json()) as { results: FreesoundResult[] };
  return json.results.slice(0, count);
}

async function downloadPreview(result: FreesoundResult, destPath: string) {
  const res = await fetch(result.previews["preview-hq-mp3"]);
  if (!res.ok) {
    throw new Error(`Échec du téléchargement pour "${result.name}" (${res.status})`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

async function main() {
  const args = process.argv.slice(2);
  const countFlagIndex = args.indexOf("--count");
  const count = countFlagIndex >= 0 ? parseInt(args[countFlagIndex + 1], 10) : 1;
  const query = args.filter((a, i) => a !== "--count" && i !== countFlagIndex + 1).join(" ");

  if (!query) {
    console.error('Usage: tsx pipeline/sfx/sfx.ts "<recherche>" [--count N]');
    process.exit(1);
  }

  console.log(`Recherche CC0 pour "${query}"...`);
  const results = await searchCC0(query, count);

  if (results.length === 0) {
    console.error("Aucun résultat CC0 trouvé pour cette recherche.");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = readManifest();

  for (const result of results) {
    const slug = `${slugify(query)}-${result.id}`;
    const fileName = `${slug}.mp3`;
    const destPath = path.join(OUT_DIR, fileName);

    console.log(`Téléchargement : ${result.name} (id ${result.id})...`);
    await downloadPreview(result, destPath);

    manifest.push({
      query,
      freesoundId: result.id,
      name: result.name,
      file: fileName,
      durationSeconds: result.duration,
      license: result.license,
    });
  }

  writeManifest(manifest);
  console.log(`${results.length} son(s) ajouté(s) dans public/audio/sfx/`);
  console.log(`Manifeste à jour : ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
