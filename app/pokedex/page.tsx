"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import tierData from "@/data/tierList.json";
import dropsData from "@/data/drops.json";
import { getSpriteUrl } from "@/lib/pokemon";

type TierEntry = { pokemon: string; tier: string };
type DropEntry = { pokemon: string; drops: string[] };

const tierList = tierData as TierEntry[];
const drops = dropsData as DropEntry[];

const TIER_COLORS: Record<string, string> = {
  T1: "bg-yellow-500/20 text-yellow-400",
  T2: "bg-orange-500/20 text-orange-400",
  T3: "bg-red-500/20 text-red-400",
  T4: "bg-purple-500/20 text-purple-400",
  T5: "bg-blue-500/20 text-blue-400",
  T6: "bg-green-500/20 text-green-400",
  T7: "bg-gray-500/20 text-gray-400",
  "Ultra Rare": "bg-pink-500/20 text-pink-400",
  "Super Rare": "bg-indigo-500/20 text-indigo-400",
  Legendary: "bg-amber-500/20 text-amber-400",
};

const dropMap = new Map(drops.map((d) => [d.pokemon.toLowerCase(), d.drops]));
const tiers = ["All", "Legendary", "Ultra Rare", "Super Rare", "T1", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function PokedexPage() {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [shinyOnly, setShinyOnly] = useState(false);

  const filtered = useMemo(() => {
    return tierList.filter((e) => {
      if (shinyOnly && !e.pokemon.toLowerCase().startsWith("shiny")) return false;
      if (!shinyOnly && e.pokemon.toLowerCase().startsWith("shiny")) return false;
      if (tierFilter !== "All" && e.tier !== tierFilter) return false;
      if (query && !e.pokemon.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, tierFilter, shinyOnly]);

  return (
    <div>
      <h1 className="page-title">Pokédex</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search Pokémon…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input max-w-xs"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="input max-w-[160px]"
        >
          {tiers.map((t) => <option key={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={shinyOnly}
            onChange={(e) => setShinyOnly(e.target.checked)}
            className="accent-brand"
          />
          Shiny only
        </label>
      </div>

      <div className="text-xs text-gray-500 mb-3">{filtered.length} Pokémon</div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="pb-2 w-12"></th>
              <th className="pb-2">Pokémon</th>
              <th className="pb-2">Tier</th>
              <th className="pb-2">Drops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.map((entry, i) => {
              const entryDrops = dropMap.get(entry.pokemon.toLowerCase()) ?? [];
              const spriteUrl = getSpriteUrl(entry.pokemon);
              return (
                <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-1 w-12">
                    {spriteUrl ? (
                      <Image
                        src={spriteUrl}
                        alt={entry.pokemon}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-800/50" />
                    )}
                  </td>
                  <td className="py-2">
                    <Link
                      href={`/pokedex/${encodeURIComponent(entry.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                      className="font-medium text-gray-100 hover:text-brand transition-colors"
                    >
                      {entry.pokemon}
                    </Link>
                  </td>
                  <td className="py-2">
                    <span className={`badge ${TIER_COLORS[entry.tier] ?? "bg-gray-700 text-gray-400"}`}>
                      {entry.tier}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-1">
                      {entryDrops.slice(0, 5).map((d, j) => (
                        <span key={j} className="badge bg-gray-800 text-gray-400">{d}</span>
                      ))}
                      {entryDrops.length > 5 && (
                        <span className="badge bg-gray-800 text-gray-500">+{entryDrops.length - 5}</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
