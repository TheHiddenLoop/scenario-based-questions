import React, { useState, useEffect } from "react";
import {useDebounce} from "../hook/useDebounce.js";
import { fetchPosts } from "../lib/api";

export default function Search({ onResults }) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    let cancelled = false;
    if (debouncedQ.trim() === "") {
      onResults([]);
      return;
    }

    (async () => {
      const res = await fetchPosts(debouncedQ);
      if (!cancelled) {
        onResults(res);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQ, onResults]);

  return (
    <input
      aria-label="Search posts"
      placeholder="Search..."
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
}
