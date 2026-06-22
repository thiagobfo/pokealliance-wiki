"use client";

import { useState } from "react";
import boostData from "@/data/boost.json";

type Boost = { type: string; fragment: string; stone: string; items: string[] };
const boost = boostData as Boost[];

const TYPE_COLORS: Record<string, string> = {
  Bug: "bg-green-700/30 text-green-400 border-green-700/50",
  Dark: "bg-gray-700/30 text-gray-300 border-gray-600/50",
  Dragon: "bg-indigo-700/30 text-indigo-400 border-indigo-700/50",
  Electric: "bg-yellow-600/30 text-yellow-400 border-yellow-600/50",
  Fairy: "bg-pink-600/30 text-pink-400 border-pink-600/50",
  Fighting: "bg-red-700/30 text-red-400 border-red-700/50",
  Fire: "bg-orange-600/30 text-orange-400 border-orange-600/50",
  Flying: "bg-sky-600/30 text-sky-400 border-sky-600/50",
  Ghost: "bg-purple-700/30 text-purple-400 border-purple-700/50",
  Grass: "bg-emerald-600/30 text-emerald-400 border-emerald-600/50",
  Ground: "bg-amber-700/30 text-amber-400 border-amber-700/50",
  Ice: "bg-cyan-600/30 text-cyan-400 border-cyan-600/50",
  Normal: "bg-gray-600/30 text-gray-300 border-gray-600/50",
  Poison: "bg-purple-600/30 text-purple-400 border-purple-600/50",
  Psychic: "bg-pink-700/30 text-pink-400 border-pink-700/50",
  Rock: "bg-stone-600/30 text-stone-400 border-stone-600/50",
  Steel: "bg-slate-600/30 text-slate-400 border-slate-600/50",
  Water: "bg-blue-600/30 text-blue-400 border-blue-600/50",
};

export default function BoostPage() {
  const [query, setQuery] = useState("");

  const filtered = boost.filter((b) =>
    b.type.toLowerCase().includes(query.toLowerCase()) ||
    b.items.some((i) => i.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <h1 className="page-title">Boost</h1>
      <p className="text-gray-400 text-sm mb-6">Items required to boost each Pokémon type.</p>

      <input
        type="text"
        placeholder="Search type or item…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((b) => (
          <div key={b.type} className={`card border ${TYPE_COLORS[b.type] ?? "border-gray-700"}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-sm">{b.type}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-500">Fragment: </span>
                <span className="text-gray-300">{b.fragment}</span>
              </div>
              <div>
                <span className="text-gray-500">Stone: </span>
                <span className="text-gray-300">{b.stone}</span>
              </div>
              {b.items.length > 0 && (
                <div>
                  <span className="text-gray-500">Special items: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {b.items.map((item, i) => (
                      <span key={i} className="badge bg-gray-800 text-gray-400">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
