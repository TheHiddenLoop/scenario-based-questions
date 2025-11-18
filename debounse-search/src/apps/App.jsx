import React, { useEffect, useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-400 font-sans flex items-center justify-center p-8">
      <SearchDebounce />
    </div>
  );
}

function SearchDebounce() {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    fetch(`https://dummyjson.com/posts/search?q=${encodeURIComponent(debounced)}`, { signal })
      .then((r) => {
        if (!r.ok) throw new Error("Network error");
        return r.json();
      })
      .then((json) => {
        setResults(json.posts || []);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
        } else {
          console.error("Fetch error:", err);
          setResults([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debounced]);

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-md text-white">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search posts..."
        className="w-full px-3 py-2 mb-4 bg-gray-700 rounded outline-none"
      />

      {loading && <div className="mb-2">Loading...</div>}

      <div className="space-y-3 max-h-72 overflow-auto">
        {results.length === 0 && !loading && <div>No results</div>}
        {results.map((p) => (
          <div key={p.id} className="p-3 bg-gray-700 rounded">
            <div className="font-bold">{p.title}</div>
            <div className="text-sm text-gray-300">{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
