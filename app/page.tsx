import Link from "next/link";

const quickLinks = [
  { href: "/pokedex", label: "Pokédex", desc: "Pokémon list, tiers & locations", icon: "📖" },
  { href: "/drops", label: "Item Drops", desc: "Search drops by item or Pokémon", icon: "💎" },
  { href: "/faq", label: "FAQ", desc: "Frequently asked questions", icon: "❓" },
  { href: "/dungeons", label: "Dungeons", desc: "DG mobs, items & XP rates", icon: "⚔️" },
  { href: "/gyms", label: "Gyms", desc: "Gym tasks and leader Pokémon", icon: "🏟️" },
  { href: "/rockets", label: "Rockets / Officers", desc: "Battle recommendations", icon: "🚀" },
  { href: "/tasks", label: "Tasks", desc: "Task & Hazard Task locations", icon: "📋" },
  { href: "/medals", label: "Medals", desc: "Medal buffs and debuffs", icon: "🏅" },
  { href: "/boost", label: "Boost", desc: "Items needed to boost each type", icon: "⚡" },
  { href: "/brokes", label: "Brokes", desc: "Max broke counts per tier", icon: "🎯" },
  { href: "/tips", label: "Tips", desc: "Quick game tips", icon: "💡" },
];

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-brand mb-2">PokeAlliance Wiki</h1>
        <p className="text-gray-400 text-lg">
          Community reference for the PokeAlliance fan game.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card hover:border-brand/50 hover:bg-gray-800/80 transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{link.icon}</span>
              <div>
                <div className="font-semibold text-gray-100 group-hover:text-brand transition-colors">
                  {link.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{link.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
        <span>
          <span className="text-brand font-semibold">PokeAlliance</span> — free-to-play Pokémon fan game.{" "}
          <a href="https://pokealliance.com" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            pokealliance.com
          </a>
          {" "}·{" "}
          <a href="https://discord.gg/pokealliance" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            Discord
          </a>
        </span>
        <span className="text-gray-600">·</span>
        <span>Wiki by <span className="text-brand font-medium">Lukkezin</span> · Data by Mts Vitor</span>
      </div>
    </div>
  );
}
