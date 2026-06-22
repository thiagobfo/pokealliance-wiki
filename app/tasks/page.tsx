"use client";

import { useState } from "react";
import tasksData from "@/data/tasks.json";
import hazardData from "@/data/hazardTasks.json";

type Task = { pokemon: string; npc: string; location: string };
type Hazard = { npc: string; location: string; task: string };

const tasks = tasksData as Task[];
const hazard = hazardData as Hazard[];

export default function TasksPage() {
  const [tab, setTab] = useState<"tasks" | "hazard">("tasks");
  const [query, setQuery] = useState("");

  const filteredTasks = tasks.filter(
    (t) =>
      t.pokemon.toLowerCase().includes(query.toLowerCase()) ||
      t.npc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredHazard = hazard.filter(
    (h) =>
      h.npc.toLowerCase().includes(query.toLowerCase()) ||
      h.task.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Tasks</h1>

      <div className="flex gap-2 mb-4">
        {(["tasks", "hazard"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setQuery(""); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-brand text-gray-900" : "bg-gray-800 text-gray-400 hover:text-gray-100"}`}
          >
            {t === "tasks" ? "Tasks" : "Hazard Tasks"}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-6"
      />

      {tab === "tasks" && (
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th>Pokémon</th>
              <th>NPC</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredTasks.map((t, i) => (
              <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                <td className="font-medium text-gray-100">{t.pokemon}</td>
                <td className="text-gray-400">{t.npc}</td>
                <td>
                  {t.location?.startsWith("http") ? (
                    <a href={t.location} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline text-sm">
                      View location
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">{t.location || "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "hazard" && (
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th>NPC</th>
              <th>Location</th>
              <th>Task</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredHazard.map((h, i) => (
              <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                <td className="font-medium text-gray-100">{h.npc}</td>
                <td>
                  {h.location?.startsWith("http") ? (
                    <a href={h.location} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline text-sm">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">{h.location}</span>
                  )}
                </td>
                <td className="text-gray-300 text-sm">{h.task}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
