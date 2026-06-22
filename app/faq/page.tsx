"use client";

import { useState } from "react";
import faqData from "@/data/faq.json";

type FAQEntry = { keywords: string[]; answer: string };
const faq = faqData as FAQEntry[];

export default function FAQPage() {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? faq.filter((e) =>
        e.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())) ||
        e.answer.toLowerCase().includes(query.toLowerCase())
      )
    : faq;

  return (
    <div>
      <h1 className="page-title">FAQ</h1>

      <input
        type="text"
        placeholder="Search keywords or answers…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-6"
      />

      <div className="space-y-3">
        {results.map((entry, i) => (
          <div key={i} className="card">
            <div className="flex flex-wrap gap-1 mb-2">
              {entry.keywords.map((k) => (
                <span key={k} className="badge bg-brand/20 text-brand">
                  {k}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {entry.answer.split(/(https?:\/\/[^\s]+)/g).map((part, j) =>
                part.startsWith("http") ? (
                  <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline break-all">
                    {part}
                  </a>
                ) : (
                  part
                )
              )}
            </p>
          </div>
        ))}
        {results.length === 0 && (
          <p className="text-gray-500 text-sm">No results for &quot;{query}&quot;</p>
        )}
      </div>
    </div>
  );
}
