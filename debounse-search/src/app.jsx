import { useEffect } from "react";
import useFetch from "./hook/useFetch"

function App() {

  const {loaderRef, loading, hasMore, products, skip, loadProducts} = useFetch();
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadProducts();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [loaderRef.current]);

  useEffect(() => {
    loadProducts();
  }, []);
  

  return (
    <div className="p-6 space-y-4 max-w-lg mx-auto">
      {products.map((p, i) => (
        <div key={i} className="p-4 bg-gray-800 text-white rounded">
          <div className="font-bold">{p.title}</div>
          <div className="text-sm text-gray-300">{p.description}</div>
        </div>
      ))}

      {hasMore && (
        <div
          ref={loaderRef}
          className="text-center py-4 text-gray-700 font-semibold"
        >
          {loading ? "Loading…" : "Scroll to load more"}
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-4 text-gray-500">
          No more products.
        </div>
      )}
    </div>
  )
}

export default App
