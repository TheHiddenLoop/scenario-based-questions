import { useEffect, useRef, useState, useMemo } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [onlyCompleted, setOnlyCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const abortRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos", { signal });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, []);

  const filtered = useMemo(() => {
    let list = todos;
    if (onlyCompleted) list = list.filter(t => t.completed);
    if (search.trim()) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [todos, onlyCompleted, search]);

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        <div>{error}</div>
        <button onClick={fetchData}>Retry</button>
      </div>
    );


  return (
    <div>
      <button onClick={fetchData}>Refresh</button>

      <div>
        <input
          type="checkbox"
          checked={onlyCompleted}
          onChange={(e) => setOnlyCompleted(e.target.checked)}
        />
        <span>Only Completed</span>
      </div>

      <input type="text" onChange={(e) => setSearch(e.target.value)} />

      {filtered.length === 0 ? (
        <div>No tasks found</div>
      ) : (
        filtered.map((t) => (
          <div key={t.id}>{t.title}</div>
        ))
      )}

    </div>
  );
}
