import rocketsData from "@/data/rockets.json";

type Battle = { npcPokemon: string; recommended: string };
type RocketGroups = Record<string, Battle[]>;

const rockets = rocketsData as RocketGroups;

const GROUP_COLORS: Record<string, string> = {
  SHADOW: "border-purple-500/40",
  FROST: "border-blue-500/40",
  THORN: "border-green-500/40",
  CIPHER: "border-red-500/40",
  PHOENIX: "border-orange-500/40",
  SCYTHE: "border-gray-500/40",
  MIRAGE: "border-pink-500/40",
  ZEPHYR: "border-cyan-500/40",
};

export default function RocketsPage() {
  const groups = Object.entries(rockets);

  return (
    <div>
      <h1 className="page-title">Rockets &amp; Officers</h1>

      <div className="card mb-6 text-sm text-gray-300">
        Left column = NPC&apos;s Pokémon · Right column = Recommended counter.{" "}
        <a href="https://imgur.com/a/p3eK6yV" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
          View locations →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map(([name, battles]) => (
          <div key={name} className={`card border ${GROUP_COLORS[name] ?? "border-gray-700"}`}>
            <h2 className="font-bold text-sm mb-3 text-gray-200 tracking-wide">{name}</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-xs text-gray-500 font-medium pb-1 text-left">NPC</th>
                  <th className="text-xs text-gray-500 font-medium pb-1 text-left">Counter</th>
                </tr>
              </thead>
              <tbody>
                {battles.map((b, i) => (
                  <tr key={i} className="border-t border-gray-800/50">
                    <td className="py-1 text-xs text-gray-400">{b.npcPokemon}</td>
                    <td className="py-1 text-xs text-brand font-medium">{b.recommended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
