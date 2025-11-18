import { useEffect, useState, useCallback, useRef, memo } from "react";

const Dashboard = memo(() => {
  const [data, setData] = useState({ stats: null, projects: null, alerts: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const [s, p, a] = await Promise.all([
        fetch("https://mocki.io/v1/4bd0f5ef-a19b-40ec-9d56-95e2da233c40", { signal }),
        fetch("https://mocki.io/v1/8bc4a3bc-46d8-4252-8c3e-775882cf2df0", { signal }),
        fetch("https://mocki.io/v1/5e0d5074-4331-4b55-b88e-4793a2a0d558", { signal }),
      ]);

      if (!s.ok || !p.ok || !a.ok) throw new Error();

      const [stats, projects, alerts] = await Promise.all([s.json(), p.json(), a.json()]);
      setData({ stats, projects, alerts });
    } catch {
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => abortRef.current && abortRef.current.abort();
  }, [fetchData]);

  if (loading) return <div>Loading…</div>;

  if (error)
    return (
      <div>
        <div>Error loading data</div>
        <button onClick={fetchData}>Retry</button>
      </div>
    );

  const { stats, projects, alerts } = data;

  return (
    <div>
      <h2>Stats</h2>
      <div>Users: {stats.users}</div>
      <div>Active: {stats.active}</div>
      <div>Inactive: {stats.inactive}</div>

      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.title} ({p.status})
          </li>
        ))}
      </ul>

      <h2>Alerts</h2>
      <ul>
        {alerts.map((a) => (
          <li key={a.id}>{a.msg}</li>
        ))}
      </ul>
    </div>
  );
});

export default Dashboard;
