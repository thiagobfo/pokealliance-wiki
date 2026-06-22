"use client";

import { useState } from "react";
import medalsData from "@/data/medals.json";
import Link from "next/link";

type Medal = { pokemon: string; buff: string; debuff: string };
const medals = medalsData as Medal[];

export default function MedalsPage() {
  const [query, setQuery] = useState("");

  const filtered = medals.filter(
    (m) =>
      m.pokemon.toLowerCase().includes(query.toLowerCase()) ||
      m.buff.toLowerCase().includes(query.toLowerCase()) ||
      (m.debuff && m.debuff.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <h1 className="page-title">Medals</h1>

      <input
        type="text"
        placeholder="Search by Pokémon or buff type…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-6"
      />

      <div className="text-xs text-gray-500 mb-3">{filtered.length} medals</div>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th>Pokémon</th>
            <th>Buff</th>
            <th>Debuff</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {filtered.map((m, i) => (
            <tr key={i} className="hover:bg-gray-800/40 transition-colors">
              <td>
                <Link
                  href={`/pokedex/${encodeURIComponent(m.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                  className="font-medium text-gray-100 hover:text-brand transition-colors"
                >
                  {m.pokemon}
                </Link>
              </td>
              <td>
                <span className="text-green-400 text-sm">{m.buff}</span>
              </td>
              <td>
                <span className="text-red-400 text-sm">{m.debuff}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
