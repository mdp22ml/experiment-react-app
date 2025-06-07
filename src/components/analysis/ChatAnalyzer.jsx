import { useState } from "react";

export default function ChatAnalyzer() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResponse(data.result || data.error);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your experiment data here..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}
