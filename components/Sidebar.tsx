"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    label: "General",
    items: [
      { href: "/", label: "Home", icon: "🏠" },
      { href: "/faq", label: "FAQ", icon: "❓" },
      { href: "/tips", label: "Tips", icon: "💡" },
      { href: "/brokes", label: "Brokes", icon: "🎯" },
    ],
  },
  {
    label: "Pokémon",
    items: [
      { href: "/pokedex", label: "Pokédex", icon: "📖" },
      { href: "/drops", label: "Item Drops", icon: "💎" },
      { href: "/medals", label: "Medals", icon: "🏅" },
      { href: "/boost", label: "Boost", icon: "⚡" },
      { href: "/effectiveness", label: "Effectiveness", icon: "🔥" },
    ],
  },
  {
    label: "Combat",
    items: [
      { href: "/gyms", label: "Gyms", icon: "🏟️" },
      { href: "/dungeons", label: "Dungeons", icon: "⚔️" },
      { href: "/rockets", label: "Rockets / Officers", icon: "🚀" },
      { href: "/calculator", label: "Damage Calculator", icon: "🧮" },
    ],
  },
  {
    label: "Hoenn",
    items: [
      { href: "/hunts", label: "Hunts", icon: "🗺️" },
      { href: "/team-builder", label: "Team Builder", icon: "👥" },
    ],
  },
  {
    label: "Quests",
    items: [
      { href: "/tasks", label: "Tasks", icon: "📋" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-gray-900 border-r border-gray-800 flex flex-col z-20">
      <div className="p-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <div>
            <div className="text-sm font-bold text-brand leading-tight">PokeAlliance</div>
            <div className="text-xs text-gray-400">Wiki</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
              {section.label}
            </div>
            {section.items.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-brand/20 text-brand font-medium"
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-500 space-y-0.5">
        <div>Wiki by <span className="text-brand font-medium">Lukkezin</span></div>
      </div>
    </aside>
  );
}
