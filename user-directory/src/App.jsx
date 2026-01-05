import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";

export default function App() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [role, setRole] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await res.json();

      // Assign random roles
      const roles = ["admin", "editor", "viewer"];
      return users.map(u => ({
        ...u,
        role: roles[Math.floor(Math.random() * roles.length)]
      }));
    }
  });

  const filtered = useMemo(() => {
    if (!data) return [];

    return data.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(debounced.toLowerCase()) ||
        user.email.toLowerCase().includes(debounced.toLowerCase());

      const matchesRole =
        role === "all" ? true : user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [data, debounced, role]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Directory</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {isLoading && <div>Loading users...</div>}

      {!isLoading && filtered.length === 0 && (
        <div>No users found</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(user => (
          <div key={user.id} className="border p-4 rounded shadow-sm">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}