import { readFileSync, writeFileSync } from "fs";

const hunts = JSON.parse(readFileSync("data/hoennHunts.json", "utf-8"));
const ids = JSON.parse(readFileSync("data/pokemonIds.json", "utf-8"));

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function resolveId(name) {
  return ids[name.toLowerCase()] ?? null;
}

async function fetchTypes(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => capitalize(t.type.name));
}

async function main() {
  const results = [];
  let missing = [];

  for (let i = 0; i < hunts.length; i++) {
    const h = hunts[i];
    const id = resolveId(h.pokemon);
    if (!id) {
      console.log(`  ✗ No ID for: ${h.pokemon}`);
      missing.push(h.pokemon);
      results.push({ ...h, types: [] });
      continue;
    }

    const types = await fetchTypes(id);
    if (!types) {
      console.log(`  ✗ API failed for: ${h.pokemon} (id ${id})`);
      missing.push(h.pokemon);
      results.push({ ...h, types: [] });
      continue;
    }

    results.push({ ...h, types });

    if ((i + 1) % 20 === 0) {
      console.log(`  ✓ ${i + 1}/${hunts.length} fetched`);
    }
  }

  console.log(`\n✓ Done: ${results.length} Pokémon processed`);
  if (missing.length) console.log(`✗ Missing: ${missing.join(", ")}`);

  const json = JSON.stringify(results, null, 2);
  writeFileSync("data/hoennHunts.json", json, "utf-8");
  console.log("✓ Saved to data/hoennHunts.json");

  // Show some examples
  const swampert = results.find((r) => r.pokemon === "Swampert");
  const dragonite = results.find((r) => r.pokemon === "Dragonite");
  const gengar = results.find((r) => r.pokemon === "Gengar");
  console.log("\nExamples:");
  if (swampert) console.log(`  Swampert: ${JSON.stringify(swampert.types)}`);
  if (dragonite) console.log(`  Dragonite: ${JSON.stringify(dragonite.types)}`);
  if (gengar) console.log(`  Gengar: ${JSON.stringify(gengar.types)}`);
}

main();
