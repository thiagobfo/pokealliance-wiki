import ids from "@/data/pokemonIds.json";

const map = ids as Record<string, number>;

function resolveId(name: string): number | undefined {
  return map[name.toLowerCase()];
}

export function getSpriteUrl(name: string): string {
  const isShiny = name.toLowerCase().startsWith("shiny ");
  const base = isShiny ? name.slice(6).trim() : name;
  const id = resolveId(base);
  if (!id) return "";
  return isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getArtworkUrl(name: string): string {
  const base = name.toLowerCase().startsWith("shiny ") ? name.slice(6).trim() : name;
  const id = resolveId(base);
  if (!id) return "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
