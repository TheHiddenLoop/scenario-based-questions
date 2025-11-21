"use client";
import { useEffect, useState, useMemo } from "react";

type Task = {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "in-progress";
  dueDate: string;
};

export default function Page() {
  const [filterStatus, setFilterStatus] = useState<"all" | Task["status"]>("all");
  const [data, setData] = useState<Task[]>([]);
  const [sortDesc, setSortDesc] = useState(false); // false = Asc, true = Desc
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://mocki.io/v1/b115f81c-1a8d-40f7-a8e5-3dd76675b135");
      if (!res.ok) throw new Error("Failed to load tasks");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function priorityColor(priority: string) {
    if (priority === "high") return "text-red-600";
    if (priority === "medium") return "text-orange-500";
    return "text-green-600";
  }

  const processedTasks = useMemo(() => {
    const filtered =
      filterStatus === "all"
        ? data
        : data.filter(task => task.status === filterStatus);

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDesc ? dateB - dateA : dateA - dateB;
    });
  }, [data, filterStatus, sortDesc]);

  function isOverdue(task: Task) {
    return (
      new Date(task.dueDate).getTime() < Date.now() &&
      task.status !== "completed"
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-[900px] bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Task Dashboard</h1>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border rounded-md px-3 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="font-medium">Due Date</span>
            <button
              onClick={() => setSortDesc(prev => !prev)}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition
                ${sortDesc ? "bg-gray-900 justify-end" : "bg-gray-300 justify-start"}`}
            >
              <span className="w-5 h-5 bg-white rounded-full shadow" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : error ? (
          <div className="text-center py-8 flex flex-col gap-2">
            <span className="text-red-600">{error}</span>
            <button
              onClick={fetchData}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        ) : processedTasks.length === 0 ? (
          <div className="text-center py-8">No tasks available</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {processedTasks.map(task => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {task.title}
                    {isOverdue(task) && (
                      <span className="ml-2 text-yellow-600 font-bold">⚠</span>
                    )}
                  </td>
                  <td className={`p-3 font-semibold ${priorityColor(task.priority)}`}>
                    {task.priority}
                  </td>
                  <td
                    className={`p-3 ${
                      task.status === "completed"
                        ? "text-green-700"
                        : task.status === "pending"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td className="p-3">{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
