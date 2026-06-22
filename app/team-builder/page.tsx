"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSpriteUrl } from "@/lib/pokemon";
import { TYPES, TYPE_COLORS, getStandardEffectiveness, getCombinedStandardEffectiveness, type PokemonType } from "@/lib/typeChart";
import tierData from "@/data/tierList.json";
import huntsData from "@/data/hoennHunts.json";

type TierEntry = { pokemon: string; tier: string; moveset: string };
type Hunt = { pokemon: string; location: string; types: string[] };

const tierList = tierData as TierEntry[];
const hunts = huntsData as Hunt[];
const tierMap = new Map(tierList.map((t) => [t.pokemon.toLowerCase(), t]));

const MAX_TEAM = 6;

type TeamMember = {
  pokemon: string;
  moveset: string;
  tier: string;
  sprite: string;
};

function PokemonSearch({ onSelect, onClose }: { onSelect: (p: TeamMember) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return tierList
      .filter((p) => p.pokemon.toLowerCase().includes(q) && p.moveset !== "?" && p.tier !== "?")
      .slice(0, 20);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Pokémon…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input mb-3"
        />
        <div className="max-h-80 overflow-y-auto space-y-1">
          {results.map((p) => {
            const sprite = getSpriteUrl(p.pokemon);
            const tc = TYPE_COLORS[p.moveset as PokemonType];
            return (
              <button
                key={p.pokemon}
                onClick={() => onSelect({ pokemon: p.pokemon, moveset: p.moveset, tier: p.tier, sprite })}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
              >
                {sprite && (
                  <Image src={sprite} alt={p.pokemon} width={32} height={32} unoptimized className="w-8 h-8 object-contain" />
                )}
                <span className="text-sm text-gray-200 flex-1">{p.pokemon}</span>
                {tc && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tc.bg} ${tc.text}`}>{p.moveset}</span>
                )}
                <span className="text-[10px] text-gray-500">{p.tier}</span>
              </button>
            );
          })}
          {query.length >= 2 && results.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No Pokémon found</p>
          )}
          {query.length < 2 && (
            <p className="text-gray-500 text-sm text-center py-4">Type at least 2 characters</p>
          )}
        </div>
      </div>
    </div>
  );
}

type HuntMatch = Hunt & { moveset: string; coveringMembers: TeamMember[] };

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(MAX_TEAM).fill(null));
  const [searchSlot, setSearchSlot] = useState<number | null>(null);

  function addToSlot(slot: number, member: TeamMember) {
    setTeam((prev) => {
      const next = [...prev];
      next[slot] = member;
      return next;
    });
    setSearchSlot(null);
  }

  function removeSlot(slot: number) {
    setTeam((prev) => {
      const next = [...prev];
      next[slot] = null;
      return next;
    });
  }

  const members = team.filter(Boolean) as TeamMember[];

  const teamMovesets = useMemo(() => {
    return Array.from(new Set(members.map((m) => m.moveset)));
  }, [members]);

  const teamWeaknesses = useMemo(() => {
    if (members.length === 0) return [];
    const weakTypes: Record<string, number> = {};
    members.forEach((m) => {
      TYPES.forEach((atk) => {
        if (getStandardEffectiveness(atk, m.moveset) >= 2) {
          weakTypes[atk] = (weakTypes[atk] || 0) + 1;
        }
      });
    });
    return Object.entries(weakTypes)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }, [members]);

  const bestHunts = useMemo(() => {
    if (members.length === 0) return [];

    const results: HuntMatch[] = [];

    hunts.forEach((hunt) => {
      const huntInfo = tierMap.get(hunt.pokemon.toLowerCase());
      const huntMoveset = huntInfo?.moveset ?? "?";

      const allCover = members.every((member) => {
        const eff = getCombinedStandardEffectiveness(member.moveset, hunt.types);
        if (eff < 2) return false;
        if (huntMoveset !== "?" && getStandardEffectiveness(huntMoveset, member.moveset) >= 2) return false;
        return true;
      });

      if (allCover) {
        results.push({ ...hunt, moveset: huntMoveset, coveringMembers: members });
      }
    });

    return results;
  }, [members]);


  return (
    <div>
      <h1 className="page-title">Team Builder</h1>
      <p className="text-gray-400 text-sm mb-6">
        Build your team of 6 and see which Hoenn hunts you can cover effectively.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {team.map((slot, i) => (
          <div key={i} className="card flex flex-col items-center text-center p-3 min-h-[140px] justify-center">
            {slot ? (
              <>
                <button onClick={() => removeSlot(i)} className="self-end text-gray-600 hover:text-red-400 text-xs mb-1 transition-colors">✕</button>
                <Image
                  src={slot.sprite}
                  alt={slot.pokemon}
                  width={56}
                  height={56}
                  unoptimized
                  className="w-14 h-14 object-contain"
                />
                <span className="text-xs font-medium text-gray-200 truncate w-full mt-1">{slot.pokemon}</span>
                {TYPE_COLORS[slot.moveset as PokemonType] && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${TYPE_COLORS[slot.moveset as PokemonType].bg} ${TYPE_COLORS[slot.moveset as PokemonType].text}`}>
                    {slot.moveset}
                  </span>
                )}
              </>
            ) : (
              <button
                onClick={() => setSearchSlot(i)}
                className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-colors text-2xl"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      {searchSlot !== null && (
        <PokemonSearch
          onSelect={(p) => addToSlot(searchSlot, p)}
          onClose={() => setSearchSlot(null)}
        />
      )}

      {members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Team Movesets</h2>
            <div className="flex flex-wrap gap-1.5">
              {teamMovesets.length > 0 ? teamMovesets.map((type) => {
                const tc = TYPE_COLORS[type as PokemonType];
                return tc ? (
                  <span key={type} className={`px-2.5 py-1 rounded text-xs font-bold ${tc.bg} ${tc.text}`}>{type}</span>
                ) : null;
              }) : <span className="text-gray-500 text-sm">None</span>}
            </div>
            {teamMovesets.length > 0 && (
              <div className="mt-3 text-[11px] text-gray-500">
                Missing: {TYPES.filter((t) => !teamMovesets.includes(t)).map((t) => t).join(", ") || "None — full coverage!"}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Team Weaknesses</h2>
            <div className="flex flex-wrap gap-1.5">
              {teamWeaknesses.length > 0 ? teamWeaknesses.map(({ type, count }) => {
                const tc = TYPE_COLORS[type as PokemonType];
                return tc ? (
                  <div key={type} className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${tc.bg} ${tc.text}`}>{type}</span>
                    {count > 1 && <span className="text-[10px] text-red-400 font-bold">×{count}</span>}
                  </div>
                ) : null;
              }) : <span className="text-gray-500 text-sm">None</span>}
            </div>
          </div>
        </div>
      )}

      {members.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-100 mb-2">Best Hunts for Your Team</h2>
          <p className="text-gray-500 text-xs mb-4">
            Showing {bestHunts.length} Pokémon where your <strong>entire team</strong> hits super effective and safe.
          </p>

          {bestHunts.length === 0 && (
            <p className="text-gray-500 text-sm">No safe super effective hunts found. Try adding different movesets to your team.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {bestHunts.map((h) => {
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
                        width={48}
                        height={48}
                        unoptimized
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">?</div>
                    )}
                  </Link>
                  <span className="text-xs text-gray-200 truncate w-full">{h.pokemon}</span>
                  <div className="flex gap-1 justify-center">
                    {h.types.map((t) => {
                      const tc = TYPE_COLORS[t as PokemonType];
                      return tc ? (
                        <span key={t} className={`text-[9px] font-bold px-1 py-0.5 rounded ${tc.bg} ${tc.text}`}>{t}</span>
                      ) : null;
                    })}
                  </div>
                  {h.location.startsWith("http") && (
                    <a href={h.location} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand hover:underline">
                      View map
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
