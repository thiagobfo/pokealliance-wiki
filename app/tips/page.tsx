import tipsData from "@/data/tips.json";

const tips = tipsData as string[];

export default function TipsPage() {
  return (
    <div>
      <h1 className="page-title">Tips</h1>

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="card">
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {tip.split(/(https?:\/\/[^\s]+)/g).map((part, j) =>
                part.startsWith("http") ? (
                  <a
                    key={j}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline break-all"
                  >
                    {part}
                  </a>
                ) : (
                  part
                )
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
