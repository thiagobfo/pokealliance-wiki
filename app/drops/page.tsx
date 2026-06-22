"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dropsData from "@/data/drops.json";

type DropEntry = { pokemon: string; drops: string[] };
const drops = dropsData as DropEntry[];

// Build reverse map: item → pokemon[]
const itemMap = new Map<string, string[]>();
drops.forEach(({ pokemon, drops: items }) => {
  items.forEach((item) => {
    const key = item.toLowerCase();
    if (!itemMap.has(key)) itemMap.set(key, []);
    itemMap.get(key)!.push(pokemon);
  });
});
const allItems = Array.from(itemMap.keys()).sort();

export default function DropsPage() {
  const [mode, setMode] = useState<"byItem" | "byPokemon">("byItem");
  const [query, setQuery] = useState("");

  const itemResults = useMemo(() => {
    if (!query.trim()) return [];
    return allItems
      .filter((item) => item.includes(query.toLowerCase()))
      .map((item) => ({ item, pokemon: itemMap.get(item)! }));
  }, [query]);

  const pokemonResults = useMemo(() => {
    if (!query.trim()) return [];
    return drops.filter((d) => d.pokemon.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div>
      <h1 className="page-title">Item Drops</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("byItem"); setQuery(""); }}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "byItem" ? "bg-brand text-gray-900" : "bg-gray-800 text-gray-400 hover:text-gray-100"}`}
        >
          Search by Item
        </button>
        <button
          onClick={() => { setMode("byPokemon"); setQuery(""); }}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "byPokemon" ? "bg-brand text-gray-900" : "bg-gray-800 text-gray-400 hover:text-gray-100"}`}
        >
          Search by Pokémon
        </button>
      </div>

      <input
        type="text"
        placeholder={mode === "byItem" ? "Search item name…" : "Search Pokémon name…"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-6"
      />

      {mode === "byItem" && query && (
        <div className="space-y-4">
          {itemResults.length === 0 && <p className="text-gray-500 text-sm">No items found.</p>}
          {itemResults.map(({ item, pokemon }) => (
            <div key={item} className="card">
              <div className="font-semibold text-brand mb-2 capitalize">{item}</div>
              <div className="flex flex-wrap gap-1.5">
                {pokemon.map((p) => (
                  <Link
                    key={p}
                    href={`/pokedex/${encodeURIComponent(p.toLowerCase().replace(/ /g, "-"))}`}
                    className="badge bg-gray-800 text-gray-300 hover:text-brand hover:bg-gray-700 transition-colors"
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "byPokemon" && query && (
        <div className="space-y-4">
          {pokemonResults.length === 0 && <p className="text-gray-500 text-sm">No Pokémon found.</p>}
          {pokemonResults.map(({ pokemon, drops: items }) => (
            <div key={pokemon} className="card">
              <Link
                href={`/pokedex/${encodeURIComponent(pokemon.toLowerCase().replace(/ /g, "-"))}`}
                className="font-semibold text-brand hover:underline mb-2 block"
              >
                {pokemon}
              </Link>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                  <span key={i} className="badge bg-gray-800 text-gray-400">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!query && (
        <p className="text-gray-500 text-sm">
          {mode === "byItem"
            ? `Search from ${allItems.length} unique items across all Pokémon.`
            : `Search from ${drops.length} Pokémon entries.`}
        </p>
      )}
    </div>
  );
}
