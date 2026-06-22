import gymsData from "@/data/gyms.json";

type Gym = { city: string; task1: string; task2: string; dungeon: string };
const gyms = gymsData as Gym[];

const GYM_NOTES = [
  "Level 250+ required",
  "Talk to NPC Alfred at the gym entrance to start and complete tasks",
  "Dungeons have a 10-minute limit — no revives allowed",
  "Dying in the dungeon counts as a normal death (lose XP/bless)",
  "Failed dungeon: 250k to retry",
  "Failed gym leader: 3 simple orbs of the respective type",
  "Reward: 4 Potent Boost Stones (Lvl 21–25) of the respective type",
];

export default function GymsPage() {
  return (
    <div>
      <h1 className="page-title">Gyms</h1>

      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Requirements & Rules</h2>
        <ul className="space-y-1.5">
          {GYM_NOTES.map((note, i) => (
            <li key={i} className="text-sm text-gray-300 flex gap-2">
              <span className="text-brand mt-0.5">•</span>
              {note}
            </li>
          ))}
        </ul>
        <a
          href="https://www.youtube.com/watch?v=khbKeyFrczI"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand hover:underline mt-3 inline-block"
        >
          📺 Video guide
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th>City</th>
              <th>Task 1</th>
              <th>Task 2</th>
              <th>Dungeon Map</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {gyms.map((gym, i) => (
              <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                <td className="font-medium text-gray-100">{gym.city}</td>
                <td className="text-gray-300 text-sm">{gym.task1}</td>
                <td className="text-gray-300 text-sm">{gym.task2}</td>
                <td>
                  {gym.dungeon?.startsWith("http") ? (
                    <a href={gym.dungeon} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline text-sm">
                      View map
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">{gym.dungeon}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
