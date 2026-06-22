"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TYPES, TYPE_COLORS, getEffectiveness, getCombinedEffectiveness, getEffectivenessLabel, type PokemonType } from "@/lib/typeChart";
import { getSpriteUrl } from "@/lib/pokemon";
import tierData from "@/data/tierList.json";

type TierEntry = { pokemon: string; tier: string; moveset: string };
const tierList = tierData as TierEntry[];

const TIER_ORDER = ["Legendary", "Mythic", "Ultra Rare", "Super Rare", "T1", "T2", "T3", "T4", "T5", "T6", "T7"];
const TIER_COLORS_MAP: Record<string, string> = {
  Legendary: "text-amber-400",
  Mythic: "text-rose-400",
  "Ultra Rare": "text-pink-400",
  "Super Rare": "text-indigo-400",
  T1: "text-yellow-400",
  T2: "text-orange-400",
  T3: "text-red-400",
  T4: "text-purple-400",
  T5: "text-blue-400",
  T6: "text-green-400",
  T7: "text-gray-400",
};

function TypeBadge({ type, selected, onClick }: { type: PokemonType; selected?: boolean; onClick?: () => void }) {
  const c = TYPE_COLORS[type];
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${c.bg} ${c.text} ${
        selected ? `${c.border} ring-2 ring-offset-1 ring-offset-gray-950 ring-current scale-105` : "border-transparent opacity-80 hover:opacity-100"
      }`}
    >
      {type}
    </button>
  );
}

function ClickableTypeTag({ type, selected, onClick }: { type: string; selected?: boolean; onClick?: () => void }) {
  const c = TYPE_COLORS[type as PokemonType];
  if (!c) return <span className="badge bg-gray-800 text-gray-400">{type}</span>;
  return (
    <button
      onClick={onClick}
      className={`inline-block px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${c.bg} ${c.text} ${
        selected ? `ring-2 ring-offset-1 ring-offset-gray-950 ring-current scale-105` : "opacity-80 hover:opacity-100"
      }`}
    >
      {type}
    </button>
  );
}

function TypeTag({ type }: { type: string }) {
  const c = TYPE_COLORS[type as PokemonType];
  if (!c) return <span className="badge bg-gray-800 text-gray-400">{type}</span>;
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${c.bg} ${c.text}`}>
      {type}
    </span>
  );
}

function PokemonList({ moveset }: { moveset: string }) {
  const pokemonByTier = useMemo(() => {
    const filtered = tierList.filter((p) => p.moveset === moveset && p.tier !== "?");
    const byTier = new Map<string, TierEntry[]>();
    filtered.forEach((p) => {
      if (!byTier.has(p.tier)) byTier.set(p.tier, []);
      byTier.get(p.tier)!.push(p);
    });
    return TIER_ORDER
      .filter((tier) => byTier.has(tier))
      .map((tier) => ({ tier, pokemon: byTier.get(tier)! }));
  }, [moveset]);

  if (pokemonByTier.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-100 mb-4">
        Pokémon with{" "}
        <span className={TYPE_COLORS[moveset as PokemonType]?.text ?? "text-gray-300"}>
          {moveset}
        </span>
        {" "}moveset
      </h2>
      <div className="space-y-4">
        {pokemonByTier.map(({ tier, pokemon }) => (
          <div key={tier} className="card">
            <h3 className={`text-sm font-bold mb-3 ${TIER_COLORS_MAP[tier] ?? "text-gray-400"}`}>
              {tier} <span className="text-gray-600 font-normal">({pokemon.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.map((p) => {
                const sprite = getSpriteUrl(p.pokemon);
                return (
                  <Link
                    key={p.pokemon}
                    href={`/pokedex/${encodeURIComponent(p.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                    className="group relative flex flex-col items-center"
                    title={p.pokemon}
                  >
                    {sprite ? (
                      <Image
                        src={sprite}
                        alt={p.pokemon}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 object-contain bg-gray-800 rounded-lg p-0.5 group-hover:bg-gray-700 group-hover:ring-1 group-hover:ring-brand transition-all"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500 group-hover:bg-gray-700 transition-all">
                        ?
                      </div>
                    )}
                    <span className="text-[10px] text-gray-500 group-hover:text-brand transition-colors mt-0.5 max-w-14 truncate text-center">
                      {p.pokemon}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type GroupedResult = { mult: number; label: string; color: string; types: string[] };

function groupByEffectiveness(results: { type: string; mult: number }[]): GroupedResult[] {
  const map = new Map<string, { mult: number; label: string; color: string; types: string[] }>();
  for (const r of results) {
    const { label, color } = getEffectivenessLabel(r.mult);
    const key = label;
    if (!map.has(key)) map.set(key, { mult: r.mult, label, color, types: [] });
    map.get(key)!.types.push(r.type);
  }
  return Array.from(map.values()).sort((a, b) => b.mult - a.mult);
}

export default function EffectivenessPage() {
  const [mode, setMode] = useState<"attack" | "defend">("attack");
  const [selected, setSelected] = useState<PokemonType[]>([]);
  const [highlightedType, setHighlightedType] = useState<string | null>(null);

  function switchMode(newMode: "attack" | "defend") {
    setMode(newMode);
    setSelected([]);
    setHighlightedType(null);
  }

  function toggleType(type: PokemonType) {
    if (mode === "attack") {
      setSelected((prev) => (prev[0] === type ? [] : [type]));
    } else {
      setSelected((prev) => {
        if (prev.includes(type)) return prev.filter((t) => t !== type);
        if (prev.length >= 2) return [prev[1], type];
        return [...prev, type];
      });
    }
    setHighlightedType(null);
  }

  const attackResults = mode === "attack" && selected.length === 1
    ? TYPES.map((def) => ({ type: def, mult: getEffectiveness(selected[0], def) }))
    : [];

  const defendResults = mode === "defend" && selected.length > 0
    ? TYPES.map((atk) => ({ type: atk, mult: getCombinedEffectiveness(atk, selected) }))
    : [];

  const attackGrouped = groupByEffectiveness(attackResults);
  const defendGrouped = groupByEffectiveness(defendResults);

  const showPokemonFor = mode === "attack" ? selected[0] ?? null : highlightedType;

  return (
    <div>
      <h1 className="page-title">Effectiveness</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode("attack")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "attack" ? "bg-brand text-gray-900" : "bg-gray-800 text-gray-400 hover:text-gray-100"
          }`}
        >
          Attack
        </button>
        <button
          onClick={() => switchMode("defend")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "defend" ? "bg-brand text-gray-900" : "bg-gray-800 text-gray-400 hover:text-gray-100"
          }`}
        >
          Defend
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        {mode === "attack"
          ? "Select an attack type to see which defending types it's strong or weak against."
          : "Select 1 or 2 defending types, then click an attack type to see Pokémon with that moveset."}
      </p>

      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {mode === "attack" ? "Attack" : "Defending Pokémon"} Type
          {selected.length > 0 && `: ${selected.join(" / ")}`}
        </h2>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              selected={selected.includes(type)}
              onClick={() => toggleType(type)}
            />
          ))}
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => { setSelected([]); setHighlightedType(null); }}
            className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear selection
          </button>
        )}
      </div>

      {selected.length === 0 && (
        <p className="text-gray-500 text-sm">Select a type above to see effectiveness.</p>
      )}

      {mode === "attack" && attackGrouped.length > 0 && (
        <div className="space-y-4">
          {attackGrouped.map(({ label, color, types }) => (
            <div key={label} className="card">
              <h3 className={`text-sm font-bold mb-3 ${color}`}>{label}</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <TypeTag key={type} type={type} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "defend" && defendGrouped.length > 0 && (
        <div className="space-y-4">
          {defendGrouped.map(({ label, color, types }) => (
            <div key={label} className="card">
              <h3 className={`text-sm font-bold mb-3 ${color}`}>{label}</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <ClickableTypeTag
                    key={type}
                    type={type}
                    selected={highlightedType === type}
                    onClick={() => setHighlightedType(highlightedType === type ? null : type)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPokemonFor && <PokemonList moveset={showPokemonFor} />}
    </div>
  );
}
