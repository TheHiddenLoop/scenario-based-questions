import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post.jsx";
import { useState, useMemo } from "react";

function App() {
  const [sortBy, setSortBy] = useState("none");

  const { data, isLoading, error } = useQuery({
    queryKey: ["myData"],
    queryFn: async () => {
      const res = await fetch("https://www.jsonkeeper.com/b/MOYTG");
      return res.json();
    }
  });

  if (isLoading) return <div className="p-6 text-center text-lg">Loading...</div>;
  if (error) return <div className="p-6 text-center text-lg">Error loading data</div>;

  const sortedPosts = useMemo(() => {
    const copy = [...data];

    if (sortBy === "likes") {
      copy.sort((a, b) => b.likes - a.likes);
    }

    if (sortBy === "comments") {
      copy.sort((a, b) => b.comments - a.comments);
    }

    if (sortBy === "newest") {
      copy.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return copy;
  }, [data, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="px-4 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="none">Default</option>
          <option value="likes">Sort by Likes</option>
          <option value="comments">Sort by Comments</option>
          <option value="newest">Sort by Newest</option>
        </select>
      </div>

      <div className="
        max-w-7xl mx-auto px-4 grid gap-6 
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      ">
        {sortedPosts.map((post) => (
          <Post
            key={post.id}
            image={post.postImage}
            title={post.title}
            like={post.likes}
            comment={post.comments}
          />
        ))}
      </div>

    </div>
  );
}

export default App;
