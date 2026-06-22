import brokesData from "@/data/brokes.json";

type Broke = { tier: string; max: string };
const brokes = brokesData as Broke[];

const TIER_COLORS: Record<string, string> = {
  Legendary: "text-amber-400",
  "Ultra Rare": "text-pink-400",
  "Super Rare": "text-indigo-400",
  T1: "text-yellow-400",
  T2: "text-orange-400",
  T3: "text-red-400",
  T4: "text-purple-400",
  T5: "text-blue-400",
  T6: "text-green-400",
  T7: "text-gray-400",
  Mythic: "text-rose-400",
};

const NOTES = [
  "Premier/Alliance balls always count as the first ball thrown.",
  "Premier/Alliance balls count toward total broke count.",
  "The max is an unofficial value discovered by the community and may change.",
  "Brokes apply to shinies only. Normal Pokémon have no max.",
  "Reaching max doesn't guarantee a catch — catch chance only becomes very high.",
  "Rates: PB = 4×, UB = 4×, AB = 5×, Elemental = 5×",
];

export default function BrokesPage() {
  return (
    <div>
      <h1 className="page-title">Max Brokes</h1>

      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Notes</h2>
        <ul className="space-y-1.5">
          {NOTES.map((note, i) => (
            <li key={i} className="text-sm text-gray-300 flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th>Tier</th>
            <th>Max Brokes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {brokes.map((b, i) => (
            <tr key={i} className="hover:bg-gray-800/40 transition-colors">
              <td className={`font-semibold ${TIER_COLORS[b.tier] ?? "text-gray-300"}`}>{b.tier}</td>
              <td className="text-gray-200 font-mono">{b.max}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
