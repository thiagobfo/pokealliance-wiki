"use client";

import { useState } from "react";
import dgMobsData from "@/data/dgMobs.json";
import dgItemsData from "@/data/dgItems.json";

type DgMob = { pokemon: string; players: string; mobs: string; xp: string; xpPerHour: string; mobList: string[] };
type DgItem = { pokemon: string; players: string; items: string[] };

const dgMobs = dgMobsData as DgMob[];
const dgItems = dgItemsData as DgItem[];

const itemMap = new Map(dgItems.map((d) => [d.pokemon.toLowerCase(), d.items]));

export default function DungeonsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"mobs" | "items">("mobs");

  const filtered = dgMobs.filter((d) =>
    d.pokemon.toLowerCase().includes(query.toLowerCase()) ||
    d.mobList.some((m) => m.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <h1 className="page-title">Dungeons</h1>

      <div className="flex gap-2 mb-4">
        {(["mobs", "items"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-brand text-gray-900" : "bg-gray-800 text-gray-400 hover:text-gray-100"}`}
          >
            {t === "mobs" ? "Mobs & XP" : "Drops"}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search dungeon or Pokémon…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-6"
      />

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th>Dungeon</th>
              <th>Players</th>
              {tab === "mobs" ? (
                <>
                  <th>Mobs</th>
                  <th>XP</th>
                  <th>XP/h</th>
                  <th>Mob Types</th>
                </>
              ) : (
                <th>Items</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.map((dg, i) => {
              const items = itemMap.get(dg.pokemon.toLowerCase()) ?? [];
              return (
                <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                  <td className="font-medium text-gray-100">{dg.pokemon}</td>
                  <td className="text-gray-400">{dg.players}</td>
                  {tab === "mobs" ? (
                    <>
                      <td className="text-gray-400">{dg.mobs}</td>
                      <td className="text-gray-300">{dg.xp ? Number(dg.xp).toLocaleString() : "—"}</td>
                      <td className="text-brand font-medium">
                        {dg.xpPerHour ? `${Math.round(Number(dg.xpPerHour) / 1000)}k` : "—"}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {dg.mobList.map((m, j) => (
                            <span key={j} className="badge bg-gray-800 text-gray-400">{m}</span>
                          ))}
                        </div>
                      </td>
                    </>
                  ) : (
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {items.map((item, j) => (
                          <span key={j} className="badge bg-gray-800 text-gray-400">{item}</span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
