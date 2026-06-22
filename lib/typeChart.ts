export const TYPES = [
  "Normal", "Fire", "Water", "Electric", "Grass", "Ice",
  "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
] as const;

export type PokemonType = (typeof TYPES)[number];

export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string; border: string }> = {
  Normal:   { bg: "bg-gray-500/25",    text: "text-gray-300",    border: "border-gray-500/50" },
  Fire:     { bg: "bg-orange-600/25",   text: "text-orange-400",  border: "border-orange-600/50" },
  Water:    { bg: "bg-blue-600/25",     text: "text-blue-400",    border: "border-blue-600/50" },
  Electric: { bg: "bg-yellow-500/25",   text: "text-yellow-400",  border: "border-yellow-500/50" },
  Grass:    { bg: "bg-emerald-600/25",  text: "text-emerald-400", border: "border-emerald-600/50" },
  Ice:      { bg: "bg-cyan-500/25",     text: "text-cyan-400",    border: "border-cyan-500/50" },
  Fighting: { bg: "bg-red-700/25",      text: "text-red-400",     border: "border-red-700/50" },
  Poison:   { bg: "bg-purple-600/25",   text: "text-purple-400",  border: "border-purple-600/50" },
  Ground:   { bg: "bg-amber-700/25",    text: "text-amber-400",   border: "border-amber-700/50" },
  Flying:   { bg: "bg-sky-500/25",      text: "text-sky-400",     border: "border-sky-500/50" },
  Psychic:  { bg: "bg-pink-600/25",     text: "text-pink-400",    border: "border-pink-600/50" },
  Bug:      { bg: "bg-lime-600/25",     text: "text-lime-400",    border: "border-lime-600/50" },
  Rock:     { bg: "bg-stone-600/25",    text: "text-stone-400",   border: "border-stone-600/50" },
  Ghost:    { bg: "bg-indigo-700/25",   text: "text-indigo-400",  border: "border-indigo-700/50" },
  Dragon:   { bg: "bg-violet-700/25",   text: "text-violet-400",  border: "border-violet-700/50" },
  Dark:     { bg: "bg-neutral-700/25",  text: "text-neutral-300", border: "border-neutral-600/50" },
  Steel:    { bg: "bg-slate-500/25",    text: "text-slate-400",   border: "border-slate-500/50" },
  Fairy:    { bg: "bg-pink-500/25",     text: "text-pink-300",    border: "border-pink-500/50" },
};

// Attacking type → defending types that are NOT 1x
// Only non-1x entries are stored; missing = 1x
const CHART: Record<string, Record<string, number>> = {
  Normal:   { Rock: 0.5, Steel: 0.5, Ghost: 0 },
  Fire:     { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
  Water:    { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
  Grass:    { Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Ice:      { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
  Poison:   { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground:   { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Flying:   { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Bug:      { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Ghost:    { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
  Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:     { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Steel:    { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Fairy:    { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
};

const PKA_MULT: Record<number, number> = {
  0: 0.023,
  0.5: 0.381,
  1: 1.0,
  2: 1.93,
};

export function getStandardEffectiveness(attackType: string, defendType: string): number {
  return CHART[attackType]?.[defendType] ?? 1;
}

export function getEffectiveness(attackType: string, defendType: string): number {
  const std = CHART[attackType]?.[defendType] ?? 1;
  return PKA_MULT[std] ?? std;
}

export function getCombinedEffectiveness(attackType: string, defendTypes: string[]): number {
  return defendTypes.reduce((mult, dt) => mult * getEffectiveness(attackType, dt), 1);
}

export function getCombinedStandardEffectiveness(attackType: string, defendTypes: string[]): number {
  return defendTypes.reduce((mult, dt) => mult * getStandardEffectiveness(attackType, dt), 1);
}

export function getEffectivenessLabel(mult: number): { label: string; color: string } {
  if (mult >= 3.0)  return { label: "Double Super Effective", color: "text-green-300" };
  if (mult >= 1.5)  return { label: "Super Effective",        color: "text-green-400" };
  if (mult >= 0.9)  return { label: "Normal",                 color: "text-gray-400" };
  if (mult >= 0.5)  return { label: "Resisted",               color: "text-yellow-400" };
  if (mult >= 0.2)  return { label: "Ineffective",            color: "text-orange-400" };
  if (mult >= 0.05) return { label: "Very Resistant",          color: "text-red-400" };
  return { label: "Immune",                                    color: "text-red-500" };
}
