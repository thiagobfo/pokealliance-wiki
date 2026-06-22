import Image from "next/image";
import Link from "next/link";
import tierData from "@/data/tierList.json";
import dropsData from "@/data/drops.json";
import locData from "@/data/locations.json";
import medalsData from "@/data/medals.json";
import { getArtworkUrl, getSpriteUrl } from "@/lib/pokemon";

type TierEntry = { pokemon: string; tier: string };
type DropEntry = { pokemon: string; drops: string[] };
type LocEntry = { pokemon: string; wildscape: string; normal: string };
type MedalEntry = { pokemon: string; buff: string; debuff: string };

const tierList = tierData as TierEntry[];
const drops = dropsData as DropEntry[];
const locations = locData as LocEntry[];
const medals = medalsData as MedalEntry[];

const TIER_COLORS: Record<string, string> = {
  T1: "bg-yellow-500/20 text-yellow-400",
  T2: "bg-orange-500/20 text-orange-400",
  T3: "bg-red-500/20 text-red-400",
  T4: "bg-purple-500/20 text-purple-400",
  T5: "bg-blue-500/20 text-blue-400",
  T6: "bg-green-500/20 text-green-400",
  T7: "bg-gray-500/20 text-gray-400",
  "Ultra Rare": "bg-pink-500/20 text-pink-400",
  "Super Rare": "bg-indigo-500/20 text-indigo-400",
  Legendary: "bg-amber-500/20 text-amber-400",
};

export async function generateStaticParams() {
  return tierList.map((e) => ({
    slug: encodeURIComponent(e.pokemon.toLowerCase().replace(/ /g, "-")),
  }));
}

function slugToName(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export default async function PokemonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slugToName(slug);

  const tier = tierList.find((e) => e.pokemon.toLowerCase() === name.toLowerCase());
  const drop = drops.find((e) => e.pokemon.toLowerCase() === name.toLowerCase());
  const loc = locations.find((e) => e.pokemon.toLowerCase() === name.toLowerCase());
  const medal = medals.find((e) => e.pokemon.toLowerCase() === name.toLowerCase());

  const isShiny = name.toLowerCase().startsWith("shiny ");
  const shinyName = isShiny ? name : `Shiny ${name}`;
  const normalName = isShiny ? name.slice(6).trim() : name;
  const counterpart = isShiny
    ? tierList.find((e) => e.pokemon.toLowerCase() === normalName.toLowerCase())
    : tierList.find((e) => e.pokemon.toLowerCase() === shinyName.toLowerCase());

  const artworkUrl = getArtworkUrl(name);
  const spriteUrl = getSpriteUrl(name);
  const imageUrl = isShiny ? spriteUrl : artworkUrl;

  if (!tier && !drop) {
    return (
      <div>
        <Link href="/pokedex" className="text-sm text-gray-500 hover:text-brand mb-4 inline-block">← Back to Pokédex</Link>
        <p className="text-gray-400">Pokémon not found: {name}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/pokedex" className="text-sm text-gray-500 hover:text-brand mb-6 inline-block">← Back to Pokédex</Link>

      <div className="flex items-start gap-6 mb-8">
        {imageUrl && (
          <div className="flex-shrink-0">
            <Image
              src={imageUrl}
              alt={tier?.pokemon ?? name}
              width={isShiny ? 96 : 160}
              height={isShiny ? 96 : 160}
              unoptimized
              className={`object-contain drop-shadow-lg ${isShiny ? "w-24 h-24" : "w-40 h-40"}`}
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-100">{tier?.pokemon ?? name}</h1>
          {tier && (
            <span className={`badge mt-2 inline-block ${TIER_COLORS[tier.tier] ?? "bg-gray-700 text-gray-400"}`}>
              {tier.tier}
            </span>
          )}
          {counterpart && (
            <div className="mt-3">
              <Link
                href={`/pokedex/${encodeURIComponent(counterpart.pokemon.toLowerCase().replace(/ /g, "-"))}`}
                className="text-sm text-brand hover:underline"
              >
                → {counterpart.pokemon}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {drop && drop.drops.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Drops</h2>
            <div className="flex flex-wrap gap-2">
              {drop.drops.map((d, i) => (
                <span key={i} className="badge bg-gray-800 text-gray-300 text-sm px-3 py-1">{d}</span>
              ))}
            </div>
          </div>
        )}

        {loc && (loc.normal || loc.wildscape) && (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Locations</h2>
            <div className="space-y-2 text-sm">
              {loc.normal && loc.normal !== "-" && (
                <div>
                  <span className="text-gray-500">Normal hunt: </span>
                  {loc.normal.startsWith("http") ? (
                    <a href={loc.normal} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                      View map
                    </a>
                  ) : loc.normal}
                </div>
              )}
              {loc.wildscape && loc.wildscape !== "-" && (
                <div>
                  <span className="text-gray-500">Wildscape (lvl 150+): </span>
                  {loc.wildscape.startsWith("http") ? (
                    <a href={loc.wildscape} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                      View map
                    </a>
                  ) : loc.wildscape}
                </div>
              )}
            </div>
          </div>
        )}

        {medal && medal.buff && (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Medal</h2>
            <div className="flex gap-6 text-sm">
              <div><span className="text-green-400">Buff:</span> <span className="text-gray-300">{medal.buff}</span></div>
              {medal.debuff && <div><span className="text-red-400">Debuff:</span> <span className="text-gray-300">{medal.debuff}</span></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
