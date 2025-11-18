import React, { useEffect, useState, useMemo, useRef } from "react";

export default function App() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [ascending, setAscending] = useState(true);

  const rolesRef = useRef({}); // prevents infinite loop

  // Assign roles ONCE
  const assignRoleOnce = (users) => {
    const ROLE_POOL = ["admin", "editor", "viewer"];

    users.forEach((u) => {
      if (!rolesRef.current[u.id]) {
        rolesRef.current[u.id] =
          ROLE_POOL[Math.floor(Math.random() * ROLE_POOL.length)];
      }
    });

    return users.map((u) => ({
      ...u,
      role: rolesRef.current[u.id],
    }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setList(assignRoleOnce(data));
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // runs once
  }, []);

  const processedList = useMemo(() => {
    let data = [...list];

    // SEARCH
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((u) => u.name.toLowerCase().includes(q));
    }

    // FILTER BY ROLE
    if (filter !== "all") {
      data = data.filter((u) => u.role === filter);
    }

    // SORT
    data.sort((a, b) =>
      ascending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return data;
  }, [list, search, filter, ascending]);

  const roleColor = {
    admin: "red",
    editor: "blue",
    viewer: "gray",
  };

  if (loading) return <h2>Loading...</h2>;

  if (error)
    return (
      <div>
        <h2>{error}</h2>
        <button onClick={fetchData}>Retry</button>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1>User List</h1>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => setAscending((prev) => !prev)}
      >
        Sort: {ascending ? "A → Z" : "Z → A"}
      </button>

      {/* REFRESH */}
      <button style={{ marginLeft: "10px" }} onClick={fetchData}>
        Refresh
      </button>

      <ul style={{ marginTop: "20px" }}>
        {processedList.length === 0 ? (
          <h3>No users found</h3>
        ) : (
          processedList.map((user) => (
            <li key={user.id} style={{ marginBottom: "10px" }}>
              <strong>{user.name}</strong> — {user.email} —{" "}
              <span style={{ color: roleColor[user.role], fontWeight: "bold" }}>
                {user.role}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
