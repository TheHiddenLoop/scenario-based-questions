import { useEffect, useRef, useState, useMemo } from "react";

const App = () => {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/comments", { signal });
      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setNotification(data.map((e) => ({ ...e, isRead: false })));
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, []);

  const sortedNotifications = useMemo(() => {
    return [...notification].sort(
      (a, b) => Number(a.isRead) - Number(b.isRead)
    );
  }, [notification]);

  const markAllRead = () => {
    setNotification((prev) => prev.map((e) => ({ ...e, isRead: true })));
  };

  const markOneRead = (id) => {
    setNotification((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
  };

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        <div>{error}</div>
        <button onClick={fetchData}>Retry</button>
      </div>
    );

  if (notification.length === 0) return <div>No notifications</div>;

  return (
    <div>
      <button onClick={markAllRead}>Mark All Read</button>
      {sortedNotifications.map((n) => (
        <div key={n.id}>
          <p style={{ color: n.isRead ? "gray" : "blue" }}>{n.body}</p>
          {!n.isRead && (
            <button onClick={() => markOneRead(n.id)}>Mark Read</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
