"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TYPES, TYPE_COLORS, getEffectiveness, type PokemonType } from "@/lib/typeChart";
import { getSpriteUrl } from "@/lib/pokemon";
import tierData from "@/data/tierList.json";

type TierEntry = { pokemon: string; tier: string; moveset: string };
const tierList = tierData as TierEntry[];

const ROLES = ["DPS Finalizador", "DPS HardCC", "Off Tanker", "Tanker"] as const;
type Role = (typeof ROLES)[number];

const TIERS_ORDER = ["T3", "T2", "T1", "Super Rare", "Ultra Rare", "Legendary", "Mythic"] as const;

const BASE_DAMAGE: Record<Role, Record<string, number>> = {
  "DPS Finalizador": { T3: 40000, T2: 50000 },
  "DPS HardCC":      { T3: 35000, T2: 45000, T1: 54000, "Super Rare": 60000, "Ultra Rare": 70000, Legendary: 80000, Mythic: 90000 },
  "Off Tanker":      { T3: 30000, T2: 40000, T1: 50000, "Super Rare": 55000, "Ultra Rare": 65000, Legendary: 75000, Mythic: 80000 },
  "Tanker":          { T3: 30000, T2: 30000, T1: 32000, "Super Rare": 32000, "Ultra Rare": 34000, Legendary: 35000, Mythic: 35000 },
};

const LEVEL_SCALE: Record<Role, number> = {
  "DPS Finalizador": 0.001665,
  "DPS HardCC":      0.001665,
  "Off Tanker":      0.000959,
  "Tanker":          0.000959,
};
const BASE_LEVEL = 150;

function scaleDamage(base: number, level: number, effectiveness: number, role: Role): number {
  const levelMult = 1 + (level - BASE_LEVEL) * LEVEL_SCALE[role];
  return base * Math.max(levelMult, 0) * effectiveness;
}

const VARIANCE = 0.02;

function formatDmg(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(2)}k`;
  return value.toFixed(0);
}

function formatRange(value: number): string {
  const lo = value * (1 - VARIANCE);
  const hi = value * (1 + VARIANCE);
  return `${formatDmg(lo)} – ${formatDmg(hi)}`;
}

const EFFECTIVENESS_OPTIONS = [
  { mult: 0.023, label: "Immune",           color: "text-red-500" },
  { mult: 0.381, label: "Not Effective",    color: "text-orange-400" },
  { mult: 1,     label: "Neutral",          color: "text-gray-300" },
  { mult: 1.93,  label: "Super Effective",  color: "text-green-400" },
  { mult: 3.725, label: "Double SE",        color: "text-green-300" },
];

const TIER_COLORS_MAP: Record<string, string> = {
  T3: "text-red-400",
  T2: "text-orange-400",
  T1: "text-yellow-400",
  "Super Rare": "text-indigo-400",
  "Ultra Rare": "text-pink-400",
  Legendary: "text-amber-400",
  Mythic: "text-rose-400",
};

export default function CalculatorPage() {
  const [moveset, setMoveset] = useState<string>("");
  const [role, setRole] = useState<Role | "">("");
  const [level, setLevel] = useState(150);

  const movesetEffectiveness = useMemo(() => {
    if (!moveset) return [];
    return TYPES.map((def) => ({ type: def, mult: getEffectiveness(moveset, def) }));
  }, [moveset]);

  const pokemonMatches = useMemo(() => {
    if (!moveset || !role) return [];
    const roleTiers = Object.keys(BASE_DAMAGE[role as Role] ?? {});
    return tierList.filter(
      (p) => p.moveset === moveset && roleTiers.includes(p.tier) && p.tier !== "?"
    );
  }, [moveset, role]);

  const hasInputs = moveset && role && level > 0;

  return (
    <div>
      <h1 className="page-title">Damage Calculator</h1>
      <p className="text-gray-400 text-sm mb-6">
        Base values at level 150, no attack buffs. Damage scales linearly with level.
        <span className="text-gray-500"> In-game damage may vary ±2% per hit.</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Moveset
          </label>
          <select
            value={moveset}
            onChange={(e) => setMoveset(e.target.value)}
            className="input"
          >
            <option value="">Select type…</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role | "")}
            className="input"
          >
            <option value="">Select role…</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Level
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value) || 0)}
            className="input"
          />
        </div>
      </div>

      {moveset && (
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            <span className={TYPE_COLORS[moveset as PokemonType]?.text}>{moveset}</span> Effectiveness
          </h2>
          <div className="space-y-2">
            {[
              { label: "Super Effective", color: "text-green-400", filter: (m: number) => m >= 1.5 },
              { label: "Ineffective", color: "text-orange-400", filter: (m: number) => m > 0.05 && m < 0.9 },
              { label: "Immune", color: "text-red-500", filter: (m: number) => m <= 0.05 },
            ].map(({ label, color, filter }) => {
              const types = movesetEffectiveness.filter((e) => filter(e.mult));
              if (types.length === 0) return null;
              return (
                <div key={label} className="flex items-start gap-2">
                  <span className={`text-xs font-bold ${color} w-28 shrink-0 pt-0.5`}>{label}:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {types.map(({ type }) => {
                      const c = TYPE_COLORS[type as PokemonType];
                      return (
                        <span key={type} className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${c?.bg} ${c?.text}`}>
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasInputs && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th>Tier</th>
                <th>Base (Lv.150)</th>
                <th>Lv.{level}</th>
                {EFFECTIVENESS_OPTIONS.map(({ label }) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {TIERS_ORDER.map((tier) => {
                const base = BASE_DAMAGE[role as Role]?.[tier];
                if (base == null) return null;
                const r = role as Role;
                const scaled = scaleDamage(base, level, 1, r);
                return (
                  <tr key={tier} className="hover:bg-gray-800/40 transition-colors">
                    <td className={`font-semibold ${TIER_COLORS_MAP[tier] ?? "text-gray-300"}`}>{tier}</td>
                    <td className="text-gray-500 font-mono">{formatDmg(base)}</td>
                    <td className="text-gray-200 font-mono font-medium">
                      <div>{formatDmg(scaled)}</div>
                      <div className="text-[10px] text-gray-600">{formatRange(scaled)}</div>
                    </td>
                    {EFFECTIVENESS_OPTIONS.map(({ mult, color }) => {
                      const dmg = scaleDamage(base, level, mult, r);
                      return (
                        <td key={mult} className={`font-mono ${color}`}>
                          <div>{formatDmg(dmg)}</div>
                          <div className="text-[10px] text-gray-600">{formatRange(dmg)}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasInputs && pokemonMatches.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-100 mb-4">
            <span className={TYPE_COLORS[moveset as PokemonType]?.text}>{moveset}</span> {role} Pokémon
          </h2>
          <p className="text-gray-500 text-xs mb-3">
            Pokémon with {moveset} moveset in tiers available for {role}.
          </p>
          <div className="flex flex-wrap gap-2">
            {pokemonMatches.map((p) => {
              const sprite = getSpriteUrl(p.pokemon);
              return (
                <Link
                  key={p.pokemon}
                  href={`/pokedex/${encodeURIComponent(p.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                  className="group relative flex flex-col items-center"
                  title={`${p.pokemon} (${p.tier})`}
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
      )}
    </div>
  );
}
