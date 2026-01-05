import express from "express"

const app = express();
app.use(express.json());

const employees = [
  { id: 1, name: "Arya", email: "arya@gmail.com", role: "admin" },
  { id: 2, name: "John", email: "john@gmail.com", role: "editor" },
  { id: 3, name: "Mira", email: "mira@gmail.com", role: "viewer" },
  { id: 4, name: "Sam", email: "sam@gmail.com", role: "viewer" },
  { id: 5, name: "Riya", email: "riya@gmail.com", role: "editor" }
];

app.get("/employees", (req, res) => {
  try {
    let { search = "", role = "", sort = "asc" } = req.query;

    const validRoles = ["admin", "editor", "viewer"];
    const validSort = ["asc", "desc"];

    if (role && !validRoles.includes(role.toLowerCase())) {
      return res.json({ success: false, error: "Invalid role" });
    }

    if (!validSort.includes(sort.toLowerCase())) {
      return res.json({ success: false, error: "Invalid sort" });
    }

    let list = [...employees];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q));
    }

    if (role) {
      list = list.filter(e => e.role === role.toLowerCase());
    }

    list.sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return res.json({
      success: true,
      count: list.length,
      data: list
    });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});


app.listen(3000, () => console.log("Server running on 3000"));