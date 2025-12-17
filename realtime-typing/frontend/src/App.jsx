import React, { useEffect, useRef, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "room1",
            userId: crypto.randomUUID(),
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "typing") {
        setText(msg.payload.text);
      }

      if (msg.type === "typing-indicator") {
        setTypingUser(
          msg.payload.isTyping ? msg.payload.userId : null
        );
      }
    };

    return () => ws.close();
  }, []);

  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    socketRef.current.send(
      JSON.stringify({
        type: "typing",
        payload: { text: value },
      })
    );

    socketRef.current.send(
      JSON.stringify({ type: "typing:start" })
    );

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({ type: "typing:stop" })
      );
    }, 700);
  };

  return (
    <div className="app">
      <h2>Realtime Room Editor</h2>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
      />

      {typingUser && (
        <div className="typing">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}

    </div>
  );
}

export default App;
