import React, { useRef, useState } from 'react'

function useFetch() {
    const [products, setProducts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const abortRef = useRef(null);

    async function loadProducts() {
        if (loading || !hasMore) return;

        if (abortRef.current) {
            abortRef.current.abort();
        }

        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);

        try {
            const res = await fetch(
                `https://dummyjson.com/products?limit=10&skip=${skip}`,
                { signal: controller.signal }
            );
            if (!res.ok) throw new Error("Network error");

            const data = await res.json();

            if (data.products.length === 0) {
                setHasMore(false);
            } else {
                setProducts((prev) => [...prev, ...data.products]);
                setSkip((prev) => prev + 10);
            }
        } catch (err) {
            if (err.name !== "AbortError") console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return {loaderRef, loading, hasMore, products, skip, loadProducts}
}

export default useFetch
