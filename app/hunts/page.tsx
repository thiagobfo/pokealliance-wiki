"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSpriteUrl } from "@/lib/pokemon";
import { TYPES, TYPE_COLORS, getCombinedStandardEffectiveness, getStandardEffectiveness, type PokemonType } from "@/lib/typeChart";
import huntsData from "@/data/hoennHunts.json";
import tierData from "@/data/tierList.json";

type Hunt = { pokemon: string; location: string; types: string[] };
type TierEntry = { pokemon: string; tier: string; moveset: string };

const hunts = huntsData as Hunt[];
const tierList = tierData as TierEntry[];
const tierMap = new Map(tierList.map((t) => [t.pokemon.toLowerCase(), t]));

export default function HuntsPage() {
  const [query, setQuery] = useState("");
  const [moveset1, setMoveset1] = useState("");
  const [moveset2, setMoveset2] = useState("");

  const selectedMovesets = [moveset1, moveset2].filter(Boolean);

  const results = useMemo(() => {
    if (selectedMovesets.length === 0 && !query) return hunts;

    return hunts.filter((hunt) => {
      if (query && !hunt.pokemon.toLowerCase().includes(query.toLowerCase())) return false;

      if (selectedMovesets.length === 0) return true;

      const huntInfo = tierMap.get(hunt.pokemon.toLowerCase());
      const huntMoveset = huntInfo?.moveset ?? "?";

      return selectedMovesets.every((atkType) => {
        const eff = getCombinedStandardEffectiveness(atkType, hunt.types);
        if (eff < 2) return false;
        if (huntMoveset !== "?" && getStandardEffectiveness(huntMoveset, atkType) >= 2) return false;
        return true;
      });
    });
  }, [query, selectedMovesets]);

  return (
    <div>
      <h1 className="page-title">Hoenn Hunts</h1>
      <p className="text-gray-400 text-sm mb-6">
        Hoenn / Tubos hunting locations (Lvl 350+). Select 1 or 2 movesets to find hunts where all are super effective and safe.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Pokémon…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />
        <select
          value={moveset1}
          onChange={(e) => setMoveset1(e.target.value)}
          className="input"
        >
          <option value="">Moveset 1</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={moveset2}
          onChange={(e) => setMoveset2(e.target.value)}
          className="input"
        >
          <option value="">Moveset 2</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        {results.length} Pokémon
        {selectedMovesets.length > 0 && (
          <span>
            {" "}— all {selectedMovesets.map((m) => {
              const tc = TYPE_COLORS[m as PokemonType];
              return tc ? m : m;
            }).join(" + ")} SE and safe
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {results.map((h) => {
          const sprite = getSpriteUrl(h.pokemon);
          return (
            <div key={h.pokemon} className="card flex flex-col items-center text-center p-3 gap-1.5">
              <Link
                href={`/pokedex/${encodeURIComponent(h.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                className="group"
              >
                {sprite ? (
                  <Image
                    src={sprite}
                    alt={h.pokemon}
                    width={56}
                    height={56}
                    unoptimized
                    className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">?</div>
                )}
              </Link>
              <Link
                href={`/pokedex/${encodeURIComponent(h.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                className="text-xs font-medium text-gray-200 hover:text-brand transition-colors truncate w-full"
              >
                {h.pokemon}
              </Link>
              <div className="flex gap-1 justify-center">
                {h.types.map((t) => {
                  const tc = TYPE_COLORS[t as PokemonType];
                  return tc ? (
                    <span key={t} className={`text-[9px] font-bold px-1 py-0.5 rounded ${tc.bg} ${tc.text}`}>{t}</span>
                  ) : null;
                })}
              </div>
              {h.location.startsWith("http") && (
                <a
                  href={h.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-brand hover:underline"
                >
                  View map
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
