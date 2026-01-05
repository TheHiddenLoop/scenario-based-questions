import React, { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";


function App() {
  const [input, setInput] = useState("");

  const debouncedChange = useDebounce((value) => {
    setInput(value);
  }, 300);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a name..."
        onChange={(e) => debouncedChange(e.target.value)}
      />
      {input}
    </div>
  );
}

export default App;
