import React, { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const setWithExpiry = (key, value) => {
    const item = { value, expiry: Date.now() + 5 * 60 * 1000 };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  const fetchPosts = async (cachedLength) => {
    try {
      const res = await fetch("https://dummyjson.com/posts");
      const data = await res.json();

      if (!data.posts) return;

      if (cachedLength !== data.posts.length) {
        setPosts(data.posts);
        setWithExpiry("posts", data.posts);
      }
    } catch (err) {
      if (cachedLength === 0) setError("No data available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = getWithExpiry("posts");

    if (cached) {
      setPosts(cached);
      setLoading(false);
      fetchPosts(cached.length);
    } else {
      fetchPosts(0);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {posts.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}

export default App;
