import { useEffect, useRef } from "react";


export function useDebounce(callback, delay){
    const timerRef = useRef(null);

    function debounce(...args) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }

    useEffect(()=>{
        return ()=>clearTimeout(timerRef.current);
    }, []);

    return debounce;
}